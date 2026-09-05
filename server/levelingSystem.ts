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
    const baseXp = event.victimBaseXp > 0 ? event.victimBaseXp : bestiary.baseXp;
    const isDragonPriest = event.isDragonPriest || !!bestiary.isDragonPriest;
    const isDragon = event.isDragon || !!bestiary.isDragon;

    const party = partySystem.getPartyByPlayerId(event.killerId);
    const results: Array<{ playerId: number; xpAwarded: number; newLevel: number; leveledUp: boolean }> = [];

    if (party && party.members.length > 1) {
      // Verifica membros que estão na mesma célula e a até 5000 unidades
      const validMembers = (killerPos && cell)
        ? partySystem.getProximateMembers(party.partyId, killerPos, cell, 5000)
        : party.members;

      const memberCount = Math.max(validMembers.length, 1);
      const isRaid = party.isRaid;

      for (const m of validMembers) {
        const memberState = playerRepo.getPlayerState(m.id);
        if (!memberState || !memberState.classId) continue;

        const effectiveXp = calculateCombatXp(
          baseXp,
          event.victimLevel,
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
        event.victimLevel,
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
    if (playerState.level >= MAX_CLASS_LEVEL) {
      return { newLevel: MAX_CLASS_LEVEL, leveledUp: false, xpAwarded: 0 };
    }

    // 1. Atualiza o ciclo diário caso tenha virado às 06:00 BRT
    const playerRepo = PlayerRepository.getInstance();
    playerRepo.refreshDailyCycle(playerState);

    // 2. O cansaço diário só é ativo a partir do nível 15
    const fatigueActive = isFatigueSystemActive(playerState.level);

    if (fatigueActive) {
      playerState.dailyXpCap = calculateDailyXpCap(playerState.level);
      const cap = playerState.dailyXpCap || 0;
      const currentGained = playerState.dailyXpGained || 0;
      const remainingAllowed = Math.max(0, cap - currentGained);

      // Se atingiu o limite de 20%, entra em cansaço e não recebe XP
      if (remainingAllowed <= 0) {
        playerState.isFatigued = true;
        playerRepo.savePlayerState(playerState);
        return { newLevel: playerState.level, leveledUp: false, xpAwarded: 0 };
      }

      const actualXp = Math.min(xp, remainingAllowed);
      playerState.dailyXpGained = currentGained + actualXp;
      playerState.isFatigued = playerState.dailyXpGained >= cap;

      playerState.currentXp += actualXp;
      playerState.totalXpAccumulated += actualXp;
      let leveledUp = false;

      while (playerState.level < MAX_CLASS_LEVEL && playerState.currentXp >= playerState.nextLevelXp) {
        playerState.currentXp -= playerState.nextLevelXp;
        playerState.level++;
        playerState.nextLevelXp = getXpRequiredForNextLevel(playerState.level);
        playerState.unspentAttributePoints += ATTRIBUTE_POINTS_PER_LEVEL;
        leveledUp = true;

        // Desbloqueia novas perks se atingiu marco de estágio
        this.checkAndUnlockStagePerks(playerState);
      }

      // Atualiza teto diário para o novo nível se ainda ativo
      if (isFatigueSystemActive(playerState.level)) {
        playerState.dailyXpCap = calculateDailyXpCap(playerState.level);
      }

      playerRepo.savePlayerState(playerState);
      return { newLevel: playerState.level, leveledUp, xpAwarded: actualXp };
    } else {
      // Níveis 1 a 14: Sistema de cansaço NÃO existe (ganho ilimitado e irrestrito)
      playerState.dailyXpCap = null;
      playerState.isFatigued = false;
      playerState.dailyXpGained = 0;

      playerState.currentXp += xp;
      playerState.totalXpAccumulated += xp;
      let leveledUp = false;

      while (playerState.level < MAX_CLASS_LEVEL && playerState.currentXp >= playerState.nextLevelXp) {
        playerState.currentXp -= playerState.nextLevelXp;
        playerState.level++;
        playerState.nextLevelXp = getXpRequiredForNextLevel(playerState.level);
        playerState.unspentAttributePoints += ATTRIBUTE_POINTS_PER_LEVEL;
        leveledUp = true;

        this.checkAndUnlockStagePerks(playerState);
      }

      // Se com o level up o personagem alcançou o nível 15, inicializa o sistema de cansaço
      if (isFatigueSystemActive(playerState.level)) {
        playerState.dailyXpCap = calculateDailyXpCap(playerState.level);
        playerState.dailyXpGained = 0;
        playerState.isFatigued = false;
      }

      playerRepo.savePlayerState(playerState);
      return { newLevel: playerState.level, leveledUp, xpAwarded: xp };
    }
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
