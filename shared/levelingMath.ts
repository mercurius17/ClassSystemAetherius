import { LevelProgressionEntry } from './types';

/**
 * Tabela oficial de progressão de níveis (Níveis 1 a 40)
 * Extraída diretamente da Seção 4 da planilha AETHERIUS - Sistema de Leveling.
 */
export const LEVEL_PROGRESSION_TABLE: LevelProgressionEntry[] = [
  { levelFrom: 1, levelTo: 2, pace: 'Rápida', xpRequired: 200, totalAccumulated: 200 },
  { levelFrom: 2, levelTo: 3, pace: 'Rápida', xpRequired: 320, totalAccumulated: 520 },
  { levelFrom: 3, levelTo: 4, pace: 'Rápida', xpRequired: 480, totalAccumulated: 1000 },
  { levelFrom: 4, levelTo: 5, pace: 'Rápida', xpRequired: 700, totalAccumulated: 1700 },
  { levelFrom: 5, levelTo: 6, pace: 'Média', xpRequired: 1000, totalAccumulated: 2700 },
  { levelFrom: 6, levelTo: 7, pace: 'Média', xpRequired: 1400, totalAccumulated: 4100 },
  { levelFrom: 7, levelTo: 8, pace: 'Média', xpRequired: 1900, totalAccumulated: 6000 },
  { levelFrom: 8, levelTo: 9, pace: 'Média', xpRequired: 2500, totalAccumulated: 8500 },
  { levelFrom: 9, levelTo: 10, pace: 'Média', xpRequired: 3200, totalAccumulated: 11700 },
  { levelFrom: 10, levelTo: 11, pace: 'Lenta', xpRequired: 4100, totalAccumulated: 15800 },
  { levelFrom: 11, levelTo: 12, pace: 'Lenta', xpRequired: 5100, totalAccumulated: 20900 },
  { levelFrom: 12, levelTo: 13, pace: 'Lenta', xpRequired: 6300, totalAccumulated: 27200 },
  { levelFrom: 13, levelTo: 14, pace: 'Lenta', xpRequired: 7600, totalAccumulated: 34800 },
  { levelFrom: 14, levelTo: 15, pace: 'Lenta', xpRequired: 9100, totalAccumulated: 43900 },
  { levelFrom: 15, levelTo: 16, pace: 'Lenta', xpRequired: 10800, totalAccumulated: 54700 },
  { levelFrom: 16, levelTo: 17, pace: 'Lenta', xpRequired: 12700, totalAccumulated: 67400 },
  { levelFrom: 17, levelTo: 18, pace: 'Lenta', xpRequired: 14800, totalAccumulated: 82200 },
  { levelFrom: 18, levelTo: 19, pace: 'Lenta', xpRequired: 17200, totalAccumulated: 99400 },
  { levelFrom: 19, levelTo: 20, pace: 'Lenta', xpRequired: 19800, totalAccumulated: 119200 },
  { levelFrom: 20, levelTo: 21, pace: 'Muito Lenta', xpRequired: 23000, totalAccumulated: 142200 },
  { levelFrom: 21, levelTo: 22, pace: 'Muito Lenta', xpRequired: 26500, totalAccumulated: 168700 },
  { levelFrom: 22, levelTo: 23, pace: 'Muito Lenta', xpRequired: 30500, totalAccumulated: 199200 },
  { levelFrom: 23, levelTo: 24, pace: 'Muito Lenta', xpRequired: 34800, totalAccumulated: 234000 },
  { levelFrom: 24, levelTo: 25, pace: 'Muito Lenta', xpRequired: 39500, totalAccumulated: 273500 },
  { levelFrom: 25, levelTo: 26, pace: 'Muito Lenta', xpRequired: 44500, totalAccumulated: 318000 },
  { levelFrom: 26, levelTo: 27, pace: 'Muito Lenta', xpRequired: 50000, totalAccumulated: 368000 },
  { levelFrom: 27, levelTo: 28, pace: 'Muito Lenta', xpRequired: 56000, totalAccumulated: 424000 },
  { levelFrom: 28, levelTo: 29, pace: 'Muito Lenta', xpRequired: 62500, totalAccumulated: 486500 },
  { levelFrom: 29, levelTo: 30, pace: 'Muito Lenta', xpRequired: 69500, totalAccumulated: 556000 },
  { levelFrom: 30, levelTo: 31, pace: 'Extremamente Lenta', xpRequired: 77000, totalAccumulated: 633000 },
  { levelFrom: 31, levelTo: 32, pace: 'Extremamente Lenta', xpRequired: 85500, totalAccumulated: 718500 },
  { levelFrom: 32, levelTo: 33, pace: 'Extremamente Lenta', xpRequired: 95000, totalAccumulated: 813500 },
  { levelFrom: 33, levelTo: 34, pace: 'Extremamente Lenta', xpRequired: 105500, totalAccumulated: 919000 },
  { levelFrom: 34, levelTo: 35, pace: 'Extremamente Lenta', xpRequired: 117000, totalAccumulated: 1036000 },
  { levelFrom: 35, levelTo: 36, pace: 'Extremamente Lenta', xpRequired: 130000, totalAccumulated: 1166000 },
  { levelFrom: 36, levelTo: 37, pace: 'Extremamente Lenta', xpRequired: 144500, totalAccumulated: 1310500 },
  { levelFrom: 37, levelTo: 38, pace: 'Extremamente Lenta', xpRequired: 160500, totalAccumulated: 1471000 },
  { levelFrom: 38, levelTo: 39, pace: 'Extremamente Lenta', xpRequired: 178500, totalAccumulated: 1649500 },
  { levelFrom: 39, levelTo: 40, pace: 'Extremamente Lenta', xpRequired: 198500, totalAccumulated: 1848000 }
];

export const MAX_CLASS_LEVEL = 40;
export const ATTRIBUTE_POINTS_PER_LEVEL = 15;
export const TOTAL_DISTRIBUTED_ATTRIBUTE_POINTS = (MAX_CLASS_LEVEL - 1) * ATTRIBUTE_POINTS_PER_LEVEL; // 39 * 15 = 585
export const FREE_RESET_MAX_LEVEL = 15;

export const DRAGON_PRIEST_FIXED_XP = 500;
export const DRAGON_FIXED_XP = 1000;

// Sistema de Cansaço Diário (Limite de 20% da XP por nível a partir do Nv. 15, com reset às 06h de Brasília)
export const DAILY_XP_CAP_PERCENTAGE = 0.20;
export const FATIGUE_SYSTEM_MIN_LEVEL = 15;
export const BRASILIA_RESET_HOUR = 6;
export const BRASILIA_UTC_OFFSET = -3;

/**
 * Retorna se o sistema de cansaço diário está ativo para o nível informado.
 * O cansaço NÃO existe até o nível 15 em todas as classes, passando a valer estritamente a partir do nível 15.
 */
export function isFatigueSystemActive(level: number): boolean {
  return level >= FATIGUE_SYSTEM_MIN_LEVEL;
}

/**
 * Retorna a chave do ciclo diário de cansaço (formato 'YYYY-MM-DD') com reset às 06:00 (Horário de Brasília, UTC-3).
 * A virada do ciclo ocorre às 06:00 BRT (09:00 UTC).
 */
export function getDailyCycleKey(nowMs: number = Date.now()): string {
  // 06:00 BRT = 09:00 UTC.
  // Deslocando 9 horas para trás, a virada de 06:00 BRT alinha-se perfeitamente com 00:00 UTC do dia correspondente.
  const shiftedMs = nowMs - (9 * 60 * 60 * 1000);
  const shiftedDate = new Date(shiftedMs);
  const year = shiftedDate.getUTCFullYear();
  const month = String(shiftedDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(shiftedDate.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retorna o timestamp em milissegundos do próximo reset diário às 06:00 BRT (09:00 UTC).
 */
export function getNextDailyResetTimestamp(nowMs: number = Date.now()): number {
  const currentCycle = getDailyCycleKey(nowMs);
  const [year, month, day] = currentCycle.split('-').map(Number);
  // O ciclo 'YYYY-MM-DD' iniciou às 09:00 UTC deste dia e encerra às 09:00 UTC do dia seguinte
  const cycleStartUtc = Date.UTC(year, month - 1, day, 9, 0, 0, 0);
  return cycleStartUtc + (24 * 60 * 60 * 1000);
}

/**
 * Calcula o teto diário de XP para o nível atual (exatamente 20% da XP necessária para o nível).
 * Válido apenas a partir do nível 15. Para níveis de 1 a 14, retorna null (sem restrição).
 * Exemplo: Nível 26 -> 50.000 XP requerida -> 10.000 XP limite diário.
 */
export function calculateDailyXpCap(level: number): number | null {
  if (!isFatigueSystemActive(level)) {
    return null;
  }
  const xpNeeded = getXpRequiredForNextLevel(level);
  return Math.floor(xpNeeded * DAILY_XP_CAP_PERCENTAGE);
}

/**
 * Retorna a quantidade de XP necessária para avançar do nível atual para o próximo.
 */
export function getXpRequiredForNextLevel(currentLevel: number): number {
  if (currentLevel >= MAX_CLASS_LEVEL) {
    return 0; // Teto máximo
  }
  const entry = LEVEL_PROGRESSION_TABLE.find(e => e.levelFrom === currentLevel);
  return entry ? entry.xpRequired : 200;
}

/**
 * Retorna o acumulado total de XP para atingir determinado nível a partir do nível 1.
 */
export function getTotalXpAccumulatedForLevel(targetLevel: number): number {
  if (targetLevel <= 1) return 0;
  const entry = LEVEL_PROGRESSION_TABLE.find(e => e.levelTo === targetLevel);
  return entry ? entry.totalAccumulated : 0;
}

/**
 * Calcula o Modificador Delta de Diferença de Nível entre Inimigo e Jogador.
 * (Delta = Nível_Inimigo - Nível_Jogador)
 * Baseado na Seção 3 da Planilha de Leveling.
 */
export function calculateDeltaModifier(enemyLevel: number, playerLevel: number): number {
  const delta = enemyLevel - playerLevel;

  if (delta <= -20) {
    return 0.0; // Muito Inferior: sem ganho de XP para prevenir farm trivial
  } else if (delta <= -11) {
    return 0.25; // Inferior Alto (-19 a -11)
  } else if (delta <= -6) {
    return 0.50; // Inferior Moderado (-10 a -6)
  } else if (delta <= -1) {
    return 0.75; // Levemente Inferior (-5 a -1)
  } else if (delta === 0) {
    return 1.00; // Nível Pareado
  } else if (delta <= 5) {
    return 1.10; // Leve Desafio (+1 a +5)
  } else if (delta <= 10) {
    return 1.25; // Desafio Elevado (+6 a +10)
  } else {
    return 1.50; // Ameaça Extrema (Delta >= +11)
  }
}

/**
 * Calcula o multiplicador de grupo ou raid (Mod_Party).
 * - Para Solo (1 membro): 1.0
 * - Para Party Normal (2 a 8 membros): 1.0 - (membros * 0.05) (Seção 2)
 * - Para Raid Party (8 a 20 membros): Tabela oficial regressiva de 60% a 40% (Seção 7)
 */
export function calculatePartyModifier(memberCount: number, isRaid: boolean = false): number {
  if (memberCount <= 1) {
    return 1.0;
  }

  // Tabela oficial de Raid (8 a 20 membros)
  if (isRaid || memberCount > 8) {
    const raidModifiers: Record<number, number> = {
      8: 0.600,
      9: 0.583,
      10: 0.567,
      11: 0.550,
      12: 0.533,
      13: 0.517,
      14: 0.500,
      15: 0.483,
      16: 0.467,
      17: 0.450,
      18: 0.433,
      19: 0.417,
      20: 0.400
    };

    if (memberCount in raidModifiers) {
      return raidModifiers[memberCount];
    }
    if (memberCount > 20) {
      return 0.400; // Cap máximo
    }
  }

  // Party normal (2 a 8 membros): Redução de 5% por membro
  const count = Math.min(Math.max(memberCount, 1), 8);
  const mod = 1.0 - (count * 0.05);
  return Number(mod.toFixed(2));
}

/**
 * Fórmulas Oficiais de Cálculo de XP de Combate (Seção 1 da Planilha de Leveling).
 *
 * @param baseXp XP base do inimigo (ex: Bandido = 10, Draugr = 18, Centurião = 30)
 * @param enemyLevel Nível do monstro/ator inimigo
 * @param playerLevel Nível atual da classe do jogador
 * @param partyMembers Quantidade de membros na party próximos
 * @param isRaid Se o grupo está em modo Raid
 * @param isDragonPriest Se o inimigo é um Dragon Priest (XP fixa de 500)
 * @param isDragon Se o inimigo é um Dragão (XP fixa de 1000)
 */
export function calculateCombatXp(
  baseXp: number,
  enemyLevel: number,
  playerLevel: number,
  partyMembers: number = 1,
  isRaid: boolean = false,
  isDragonPriest: boolean = false,
  isDragon: boolean = false
): number {
  const modParty = calculatePartyModifier(partyMembers, isRaid);

  // Chefes Épicos possuem recompensa fixa e ignoram nível do ator e delta, aplicando apenas Mod_Party
  if (isDragon) {
    return Number((DRAGON_FIXED_XP * modParty).toFixed(1));
  }

  if (isDragonPriest) {
    return Number((DRAGON_PRIEST_FIXED_XP * modParty).toFixed(1));
  }

  const modDelta = calculateDeltaModifier(enemyLevel, playerLevel);
  if (modDelta <= 0) {
    return 0; // Delta <= -20 sem XP
  }

  let xp: number;

  if (enemyLevel <= 20) {
    // Inimigos Regulares (Nível 1 a 20):
    // XP = XP_Base * (1 + (Nivel - 1) * 0.20) * Mod_Delta * Mod_Party
    const levelScaling = 1.0 + (enemyLevel - 1) * 0.20;
    xp = baseXp * levelScaling * modDelta * modParty;
  } else {
    // Inimigos Regulares (Nível 21 a 40 - Soft Cap):
    // XP = XP_Base * (4.80 + (Nivel - 20) * 0.05) * Mod_Delta * Mod_Party
    const softCapScaling = 4.80 + (enemyLevel - 20) * 0.05;
    xp = baseXp * softCapScaling * modDelta * modParty;
  }

  return Number(xp.toFixed(1));
}
