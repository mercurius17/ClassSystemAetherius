import { ClassDefinition, ResolvedPerk } from './types';
import { PerkResolver } from './perkResolver';

// Carregamento resiliente de JSON
const rawClassesConfig = require('../config/classes-config.json');
export const CLASSES_REGISTRY: Record<string, ClassDefinition> = (rawClassesConfig.default || rawClassesConfig) as Record<string, ClassDefinition>;

export function getClassById(classId: string): ClassDefinition | undefined {
  const normalized = classId.toLowerCase().trim();
  return CLASSES_REGISTRY[normalized];
}

export function getAllClasses(): ClassDefinition[] {
  return Object.values(CLASSES_REGISTRY);
}

export function getClassesByArchetype(archetype: 'CONJURADORES' | 'GUERREIROS' | 'ESPECIALISTAS'): ClassDefinition[] {
  return getAllClasses().filter(c => c.archetype === archetype);
}

/**
 * Retorna as perks resolvidas de determinado estágio de uma classe.
 */
export function getResolvedStagePerks(classId: string, level: number): ResolvedPerk[] {
  const cls = getClassById(classId);
  if (!cls) return [];

  // Encontra os estágios já desbloqueados até o nível
  const unlockedPerkNames = new Set<string>();
  for (const st of cls.stages) {
    if (st.level <= level) {
      for (const p of st.perks) {
        unlockedPerkNames.add(p);
      }
    }
  }

  const resolver = PerkResolver.getInstance();
  const results: ResolvedPerk[] = [];
  for (const pName of unlockedPerkNames) {
    results.push(resolver.resolvePerk(pName));
  }

  return results;
}

/**
 * Retorna a lista completa de estágios com perks resolvidas para exibição na UI.
 */
export function getClassProgressionWithResolvedPerks(classId: string) {
  const cls = getClassById(classId);
  if (!cls) return null;

  const resolver = PerkResolver.getInstance();
  const stagesData = cls.stages.map(stage => {
    const resolvedPerks = stage.perks.map(p => resolver.resolvePerk(p));
    return {
      ...stage,
      resolvedPerks
    };
  });

  return {
    ...cls,
    stages: stagesData
  };
}

// Carregamento de feitiços configuráveis via JSON
const rawSpellsConfig = require('../config/spells-descriptions.json');
export const SPELLS_REGISTRY: Record<string, import('./types').SpellDescription> = (rawSpellsConfig.default || rawSpellsConfig);

export function getSpellInfo(spellName: string): import('./types').SpellDescription {
  const clean = spellName.trim();
  return SPELLS_REGISTRY[clean] || {
    name: clean,
    namePt: clean,
    tier: 'Novato',
    descriptionPt: 'Feitiço arcano autorizado da classe.'
  };
}

export function getSpellDisplayNamePt(spellName: string): string {
  const info = getSpellInfo(spellName);
  return info.namePt || info.name;
}
