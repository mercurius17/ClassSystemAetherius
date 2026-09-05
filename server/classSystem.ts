import { PlayerClassState, ResolvedPerk } from '../shared/types';
import { getClassById, getAllClasses } from '../shared/classesData';
import { PerkResolver } from '../shared/perkResolver';
import { getXpRequiredForNextLevel, FREE_RESET_MAX_LEVEL } from '../shared/levelingMath';
import { getRaceBaseAttributes } from '../shared/raceData';
import { resolveSkillsForClassAndLevel } from '../shared/skillResolver';
import { PlayerRepository } from './storage/playerRepository';

export class ClassSystem {
  private static instance: ClassSystem;

  public static getInstance(): ClassSystem {
    if (!ClassSystem.instance) {
      ClassSystem.instance = new ClassSystem();
    }
    return ClassSystem.instance;
  }

  /**
   * Processa a seleção de uma classe pelo jogador.
   */
  public selectClass(playerId: number, classId: string): {
    success: boolean;
    state?: PlayerClassState;
    message: string;
    unlockedPerks?: ResolvedPerk[];
  } {
    const playerRepo = PlayerRepository.getInstance();
    const playerState = playerRepo.getPlayerState(playerId);

    const classDef = getClassById(classId);
    if (!classDef) {
      return { success: false, message: `Classe com identificador '${classId}' não encontrada.` };
    }

    if (playerState.classId && playerState.classId !== classId) {
      return {
        success: false,
        message: `Você já possui a classe ${playerState.className}. É necessário resetar antes de escolher uma nova classe.`
      };
    }

    // Validação da Keyword de Winterhold para Conjuradores
    if (classDef.requiresWinterholdStudent && !playerState.hasWinterholdKeyword) {
      return {
        success: false,
        message: `A classe ${classDef.name} exige vínculo com o Colégio de Winterhold (permissão AlunoColegioWinterhold). Entre em contato com a Staff.`
      };
    }

    playerState.classId = classDef.id;
    playerState.className = classDef.name;
    playerState.level = 1;
    playerState.currentXp = 0;
    playerState.nextLevelXp = getXpRequiredForNextLevel(1);
    playerState.totalXpAccumulated = 0;
    playerState.unspentAttributePoints = 0;
    playerState.allocatedHealth = 0;
    playerState.allocatedMagicka = 0;
    playerState.allocatedStamina = 0;
    playerState.unlockedPerks = [];
    playerState.baseAttributes = getRaceBaseAttributes(playerState.playerRace);
    playerState.unlockedSkills = resolveSkillsForClassAndLevel(classDef, 1);

    // Desbloqueia as perks do estágio 1 (nível 1/0)
    const stage1 = classDef.stages.find(s => s.level === 1 || s.level === 0);
    const resolver = PerkResolver.getInstance();
    const resolvedStagePerks: ResolvedPerk[] = [];

    if (stage1) {
      for (const p of stage1.perks) {
        playerState.unlockedPerks.push(p);
        resolvedStagePerks.push(resolver.resolvePerk(p));
      }
    }

    playerRepo.savePlayerState(playerState);

    return {
      success: true,
      state: playerState,
      message: `Classe ${classDef.name} selecionada com sucesso!`,
      unlockedPerks: resolvedStagePerks
    };
  }

  /**
   * Aloca pontos de atributo conquistados por subida de nível.
   */
  public allocateAttributes(
    playerId: number,
    health: number,
    magicka: number,
    stamina: number
  ): { success: boolean; state?: PlayerClassState; message: string } {
    const playerRepo = PlayerRepository.getInstance();
    const playerState = playerRepo.getPlayerState(playerId);

    const totalToSpend = health + magicka + stamina;
    if (totalToSpend <= 0) {
      return { success: false, message: 'Nenhum ponto selecionado para alocação.' };
    }

    if (health % 5 !== 0 || magicka % 5 !== 0 || stamina % 5 !== 0) {
      return {
        success: false,
        message: 'Os pontos de atributos devem ser distribuídos apenas em múltiplos de 5.'
      };
    }

    if (totalToSpend > playerState.unspentAttributePoints) {
      return {
        success: false,
        message: `Pontos insuficientes. Você possui ${playerState.unspentAttributePoints} ponto(s) disponíveis.`
      };
    }

    playerState.allocatedHealth += health;
    playerState.allocatedMagicka += magicka;
    playerState.allocatedStamina += stamina;
    playerState.unspentAttributePoints -= totalToSpend;

    playerRepo.savePlayerState(playerState);

    return {
      success: true,
      state: playerState,
      message: `Atributos distribuídos: +${health} Vida, +${magicka} Mágicka, +${stamina} Vigor.`
    };
  }

  /**
   * Reseta a classe do personagem.
   * - Gratuito até o nível 15.
   * - A partir do nível 16, requer Ticket de Troca de Classe.
   */
  public resetClass(playerId: number): {
    success: boolean;
    state?: PlayerClassState;
    message: string;
  } {
    const playerRepo = PlayerRepository.getInstance();
    const playerState = playerRepo.getPlayerState(playerId);

    if (!playerState.classId) {
      return { success: false, message: 'Você não possui uma classe para resetar.' };
    }

    const isFree = playerState.level <= FREE_RESET_MAX_LEVEL;
    if (!isFree) {
      if (!playerState.hasResetTicket) {
        return {
          success: false,
          message: `Acima do nível ${FREE_RESET_MAX_LEVEL}, é necessário possuir um Ticket de Troca de Classe fornecido pela Staff.`
        };
      }
      // Consome o ticket
      playerState.hasResetTicket = false;
    }

    const previousClass = playerState.className;
    playerState.classId = null;
    playerState.className = null;
    playerState.level = 1;
    playerState.currentXp = 0;
    playerState.nextLevelXp = getXpRequiredForNextLevel(1);
    playerState.totalXpAccumulated = 0;
    playerState.unspentAttributePoints = 0;
    playerState.allocatedHealth = 0;
    playerState.allocatedMagicka = 0;
    playerState.allocatedStamina = 0;
    playerState.baseAttributes = getRaceBaseAttributes(playerState.playerRace);
    playerState.unlockedPerks = [];
    playerState.unlockedSkills = {};

    playerRepo.savePlayerState(playerState);

    return {
      success: true,
      state: playerState,
      message: `Classe ${previousClass} resetada com sucesso. Você pode escolher uma nova classe!`
    };
  }

  /**
   * Concede a keyword de aluno de Winterhold para o jogador (chamado por Staff / comando RP).
   */
  public setWinterholdStudent(playerId: number, isStudent: boolean): void {
    const playerRepo = PlayerRepository.getInstance();
    const playerState = playerRepo.getPlayerState(playerId);
    playerState.hasWinterholdKeyword = isStudent;
    playerRepo.savePlayerState(playerState);
  }

  /**
   * Concede o ticket de troca de classe para o jogador (chamado por Staff).
   */
  public giveResetTicket(playerId: number): void {
    const playerRepo = PlayerRepository.getInstance();
    const playerState = playerRepo.getPlayerState(playerId);
    playerState.hasResetTicket = true;
    playerRepo.savePlayerState(playerState);
  }
}
