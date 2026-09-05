import { PlayerClassState, CombatKillEvent } from '../shared/types';
import {
  calculateCombatXp,
  getXpRequiredForNextLevel,
  MAX_CLASS_LEVEL,
  ATTRIBUTE_POINTS_PER_LEVEL,
  calculateDailyXpCap,
  isFatigueSystemActive
} from '../shared/levelingMath';
import { findBestiaryEntry } from '../shared/bestiaryData';
import { getClassById } from '../shared/classesData';
import { PerkResolver } from '../shared/perkResolver';
import { resolveSkillsForClassAndLevel } from '../shared/skillResolver';
import { PlayerRepository } from './storage/playerRepository';
import { PartySystem } from './partySystem';

export class LevelingSystem {
  private static instance: LevelingSystem;

  public static getInstance(): LevelingSystem {
    if (!LevelingSystem.instance) {
      LevelingSystem.instance = new LevelingSystem();
    }
    return LevelingSystem.instance;
  }

  /**
   * Processa a morte de um inimigo em combate e distribui o XP apropriado.
   */
  public processCombatKill(event: CombatKillEvent, killerPos?: [number, number, number], cell?: string): {
    awardedPlayers: Array<{ playerId: number; xpAwarded: number; newLevel: number; leveledUp: boolean }>;
  } {
    const playerRepo = PlayerRepository.getInstance();
    const partySystem = PartySystem.getInstance();

    const killerState = playerRepo.getPlayerState(event.killerId);
    if (!killerState || !killerState.classId) {
      // Jogador sem classe não acumula XP de classe
      return { awardedPlayers: [] };
    }

    // Resolve informações do inimigo a partir do bestiário se necessário
    const bestiary = findBestiaryEntry(event.victimName);
    // Recompensa e classificação vêm do catálogo do servidor. Valores enviados pelo
    // cliente são apenas informativos e não podem elevar o XP nem forjar um chefe.
    const baseXp = bestiary.baseXp;
    const victimLevel = Number.isFinite(event.victimLevel)
      ? Math.min(Math.max(Math.trunc(event.victimLevel), 1), 255)
      : 1;
    const isDragonPriest = !!bestiary.isDragonPriest;
    const isDragon = !!bestiary.isDragon;

    const party = partySystem.getPartyByPlayerId(event.killerId);
    const results: Array<{ playerId: number; xpAwarded: number; newLevel: number; leveledUp: boolean }> = [];

    if (party && party.members.length > 1) {
      // Verifica membros que estão na mesma célula e a até 5000 unidades
      const killerMember = party.members.find(member => member.id === event.killerId);
      const proximateMembers = (killerPos && cell)
        ? partySystem.getProximateMembers(party.partyId, killerPos, cell, 5000)
        : [];
      const validMembers = killerMember && !proximateMembers.some(member => member.id === event.killerId)
        ? [killerMember, ...proximateMembers]
        : proximateMembers;

      const memberCount = Math.max(validMembers.length, 1);
      const isRaid = party.isRaid;

      for (const m of validMembers) {
        const memberState = playerRepo.getPlayerState(m.id);
        if (!memberState || !memberState.classId) continue;

        const effectiveXp = calculateCombatXp(
          baseXp,
          victimLevel,
          memberState.level,
          memberCount,
          isRaid,
          isDragonPriest,
          isDragon
        );

        if (effectiveXp > 0) {
          const res = this.addExperience(memberState, effectiveXp);
          results.push({
            playerId: m.id,
            xpAwarded: res.xpAwarded,
            newLevel: res.newLevel,
            leveledUp: res.leveledUp
          });
        }
      }
    } else {
      // Combate Solo
      const effectiveXp = calculateCombatXp(
        baseXp,
        victimLevel,
        killerState.level,
        1,
        false,
        isDragonPriest,
        isDragon
      );

      if (effectiveXp > 0) {
        const res = this.addExperience(killerState, effectiveXp);
        results.push({
          playerId: event.killerId,
          xpAwarded: res.xpAwarded,
          newLevel: res.newLevel,
          leveledUp: res.leveledUp
        });
      }
    }

    return { awardedPlayers: results };
  }

  /**
   * Adiciona experiência ao jogador respeitando o Sistema de Cansaço Diário.
   * O cansaço NÃO existe até o nível 15 em todas as classes, passando a valer estritamente a partir do nível 15.
   */
  public addExperience(playerState: PlayerClassState, xp: number): { newLevel: number; leveledUp: boolean; xpAwarded: number } {
    if (!Number.isFinite(xp) || xp <= 0 || playerState.level >= MAX_CLASS_LEVEL) {
      return { newLevel: playerState.level, leveledUp: false, xpAwarded: 0 };
    }

    const playerRepo = PlayerRepository.getInstance();
    playerRepo.refreshDailyCycle(playerState);
    let remainingXp = xp;
    let xpAwarded = 0;
    let leveledUp = false;

    // Processa por nível para que um prêmio grande recebido no nível 14 não contorne
    // o cansaço ao atravessar o marco do nível 15.
    while (remainingXp > 0 && playerState.level < MAX_CLASS_LEVEL) {
      const fatigueActive = isFatigueSystemActive(playerState.level);
      let allowedThisCycle = remainingXp;

      if (fatigueActive) {
        const cap = calculateDailyXpCap(playerState.level) || 0;
        playerState.dailyXpCap = cap;
        allowedThisCycle = Math.min(
          remainingXp,
          Math.max(0, cap - (playerState.dailyXpGained || 0))
        );
        if (allowedThisCycle <= 0) {
          playerState.isFatigued = true;
          break;
        }
      } else {
        playerState.dailyXpCap = null;
        playerState.dailyXpGained = 0;
        playerState.isFatigued = false;
      }

      const xpToNextLevel = Math.max(0, playerState.nextLevelXp - playerState.currentXp);
      const chunk = Math.min(allowedThisCycle, xpToNextLevel || allowedThisCycle);
      if (chunk <= 0) break;

      playerState.currentXp += chunk;
      playerState.totalXpAccumulated += chunk;
      xpAwarded += chunk;
      remainingXp -= chunk;

      if (fatigueActive) {
        playerState.dailyXpGained = (playerState.dailyXpGained || 0) + chunk;
      }

      if (playerState.currentXp >= playerState.nextLevelXp) {
        playerState.currentXp -= playerState.nextLevelXp;
        playerState.level++;
        playerState.nextLevelXp = getXpRequiredForNextLevel(playerState.level);
        playerState.unspentAttributePoints += ATTRIBUTE_POINTS_PER_LEVEL;
        leveledUp = true;
        this.checkAndUnlockStagePerks(playerState);
      }

      if (isFatigueSystemActive(playerState.level)) {
        playerState.dailyXpCap = calculateDailyXpCap(playerState.level);
        playerState.isFatigued = (playerState.dailyXpGained || 0) >= (playerState.dailyXpCap || 0);
      }
    }

    if (playerState.level >= MAX_CLASS_LEVEL) {
      playerState.level = MAX_CLASS_LEVEL;
      playerState.currentXp = 0;
      playerState.nextLevelXp = 0;
      playerState.dailyXpCap = null;
      playerState.isFatigued = false;
    }

    playerRepo.savePlayerState(playerState);
    return { newLevel: playerState.level, leveledUp, xpAwarded };
  }

  /**
   * Verifica se o jogador alcançou um novo marco de estágio e adiciona as perks correspondentes.
   */
  public checkAndUnlockStagePerks(playerState: PlayerClassState): string[] {
    if (!playerState.classId) return [];

    const cls = getClassById(playerState.classId);
    if (!cls) return [];

    const newlyUnlocked: string[] = [];
    const resolver = PerkResolver.getInstance();

    for (const stage of cls.stages) {
      if (stage.level <= playerState.level) {
        for (const p of stage.perks) {
          if (!playerState.unlockedPerks.includes(p)) {
            playerState.unlockedPerks.push(p);
            newlyUnlocked.push(p);
            // Resolve perk para validação
            resolver.resolvePerk(p);
          }
        }
      }
    }

    // Atualiza patamares de habilidades desbloqueadas conforme o estágio
    playerState.unlockedSkills = resolveSkillsForClassAndLevel(cls, playerState.level);

    return newlyUnlocked;
  }
}
