export interface RaceBaseAttributes {
  health: number;
  magicka: number;
  stamina: number;
}

/**
 * Atributos base de Nível 1 definidos pelas passivas raciais do mod AETHERIUS:
 * - High Elf (Altmer) - Highborn: +50 Mágicka (100 Vida, 150 Mágicka, 100 Vigor)
 * - Imperial - Red Diamond: +25 Vida, +25 Mágicka, +25 Vigor (125 Vida, 125 Mágicka, 125 Vigor)
 * - Orc (Orsimer) - Orsinium's Heir: +50 Vida (150 Vida, 100 Mágicka, 100 Vigor)
 * - Redguard - Martial Training: +50 Vigor (100 Vida, 100 Mágicka, 150 Vigor)
 * - Demais raças: Padrão (100 Vida, 100 Mágicka, 100 Vigor)
 */
export const AETHERIUS_RACE_ATTRIBUTES: Record<string, RaceBaseAttributes> = {
  highelf: { health: 100, magicka: 150, stamina: 100 },
  altmer: { health: 100, magicka: 150, stamina: 100 },
  imperial: { health: 125, magicka: 125, stamina: 125 },
  orc: { health: 150, magicka: 100, stamina: 100 },
  orsimer: { health: 150, magicka: 100, stamina: 100 },
  redguard: { health: 100, magicka: 100, stamina: 150 }
};

export const DEFAULT_BASE_ATTRIBUTES: RaceBaseAttributes = {
  health: 100,
  magicka: 100,
  stamina: 100
};

/**
 * Retorna os atributos base de Nível 1 para uma determinada raça.
 */
export function getRaceBaseAttributes(race?: string | null): RaceBaseAttributes {
  if (!race) return { ...DEFAULT_BASE_ATTRIBUTES };

  const normalized = race.toLowerCase().replace(/race|\s+|_|-/g, '');

  for (const [key, attrs] of Object.entries(AETHERIUS_RACE_ATTRIBUTES)) {
    if (normalized.includes(key)) {
      return { ...attrs };
    }
  }

  return { ...DEFAULT_BASE_ATTRIBUTES };
}
