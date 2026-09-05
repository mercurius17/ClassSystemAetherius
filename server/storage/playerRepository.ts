import { PlayerClassState } from '../../shared/types';
import { getXpRequiredForNextLevel, getDailyCycleKey, calculateDailyXpCap } from '../../shared/levelingMath';
import { getRaceBaseAttributes } from '../../shared/raceData';

declare const mp: any;

export class PlayerRepository {
  private static instance: PlayerRepository;
  private memoryStore: Map<number, PlayerClassState> = new Map();

  public static getInstance(): PlayerRepository {
    if (!PlayerRepository.instance) {
      PlayerRepository.instance = new PlayerRepository();
    }
    return PlayerRepository.instance;
  }

  public getPlayerState(playerId: number, playerName: string = `Player_${playerId}`): PlayerClassState {
    // 1. Tenta recuperar da memória
    if (this.memoryStore.has(playerId)) {
      const state = this.memoryStore.get(playerId)!;
      this.refreshDailyCycle(state);
      return state;
    }

    // 2. Tenta recuperar do SkyMP mp.get se disponível
    if (typeof mp !== 'undefined' && mp.get) {
      try {
        const raw = mp.get(playerId, 'playerClassData');
        if (raw) {
          const parsed: PlayerClassState = typeof raw === 'string' ? JSON.parse(raw) : raw;
          this.refreshDailyCycle(parsed);
          this.memoryStore.set(playerId, parsed);
          return parsed;
        }
      } catch (err) {
        console.error(`[PlayerRepository] Erro ao carregar dados do jogador ${playerId}:`, err);
      }
    }

    // 3. Cria estado inicial para novo jogador
    const defaultState: PlayerClassState = {
      playerId,
      playerName,
      classId: null,
      className: null,
      level: 1,
      currentXp: 0,
      nextLevelXp: getXpRequiredForNextLevel(1),
      totalXpAccumulated: 0,
      unspentAttributePoints: 0,
      allocatedHealth: 0,
      allocatedMagicka: 0,
      allocatedStamina: 0,
      unlockedPerks: [],
      hasWinterholdKeyword: false,
      hasResetTicket: false,
      partyId: null,
      isRaid: false,
      dailyCycleKey: getDailyCycleKey(),
      dailyXpGained: 0,
      dailyXpCap: calculateDailyXpCap(1),
      isFatigued: false,
      playerRace: undefined,
      baseAttributes: getRaceBaseAttributes(),
      unlockedSkills: {}
    };

    this.memoryStore.set(playerId, defaultState);
    this.savePlayerState(defaultState);
    return defaultState;
  }

  public refreshDailyCycle(state: PlayerClassState): void {
    const currentCycle = getDailyCycleKey();
    if (state.dailyCycleKey !== currentCycle) {
      state.dailyCycleKey = currentCycle;
      state.dailyXpGained = 0;
      state.dailyXpCap = calculateDailyXpCap(state.level);
      state.isFatigued = false;
    } else if (state.dailyXpCap === undefined) {
      state.dailyXpCap = calculateDailyXpCap(state.level);
    }

    if (state.level < 15) {
      state.isFatigued = false;
      state.dailyXpCap = null;
    }
  }

  public savePlayerState(state: PlayerClassState): void {
    this.memoryStore.set(state.playerId, state);

    if (typeof mp !== 'undefined' && mp.set) {
      try {
        mp.set(state.playerId, 'playerClassData', JSON.stringify(state));
      } catch (err) {
        console.error(`[PlayerRepository] Erro ao salvar dados do jogador ${state.playerId}:`, err);
      }
    }
  }

  public clearMemory(): void {
    this.memoryStore.clear();
  }
}
