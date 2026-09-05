import { ClassDefinition } from './types';

export const SKILL_NAME_TO_ACTOR_VALUE: Record<string, string> = {
  'destruição': 'Destruction',
  'destruicao': 'Destruction',
  'alteração': 'Alteration',
  'alteracao': 'Alteration',
  'restauração': 'Restoration',
  'restauracao': 'Restoration',
  'conjuração': 'Conjuration',
  'conjuracao': 'Conjuration',
  'ilusão': 'Illusion',
  'ilusao': 'Illusion',
  'bloqueio': 'Block',
  'armadura pesada': 'HeavyArmor',
  'armadura leve': 'LightArmor',
  'uma-mão': 'OneHanded',
  'uma mão': 'OneHanded',
  'uma-mao': 'OneHanded',
  'uma mao': 'OneHanded',
  'duas-mãos': 'TwoHanded',
  'duas mãos': 'TwoHanded',
  'duas-maos': 'TwoHanded',
  'duas maos': 'TwoHanded',
  'arquearia': 'Marksman',
  'furtividade': 'Sneak',
  'alquimia': 'Alchemy',
  'encantamento': 'Enchanting',
  'ferraria': 'Smithing',
  'arrombamento': 'Lockpicking',
  'eloquência': 'Speechcraft',
  'eloquencia': 'Speechcraft',
  'furto': 'Pickpocket'
};

export const ACTOR_VALUE_TO_SKILL_NAME_PT: Record<string, string> = {
  'Destruction': 'Destruição',
  'Alteration': 'Alteração',
  'Restoration': 'Restauração',
  'Conjuration': 'Conjuração',
  'Illusion': 'Ilusão',
  'Block': 'Bloqueio',
  'HeavyArmor': 'Armadura Pesada',
  'LightArmor': 'Armadura Leve',
  'OneHanded': 'Uma-Mão',
  'TwoHanded': 'Duas-Mãos',
  'Marksman': 'Arquearia',
  'Sneak': 'Furtividade',
  'Alchemy': 'Alquimia',
  'Enchanting': 'Encantamento',
  'Smithing': 'Ferraria',
  'Lockpicking': 'Arrombamento',
  'Speechcraft': 'Eloquência',
  'Pickpocket': 'Furto'
};

/**
 * Identifica o conjunto de habilidades principais pertencentes a uma classe,
 * inspecionando todos os seus estágios e perks.
 */
export function getClassPrimarySkills(cls: ClassDefinition): string[] {
  const skills = new Set<string>();

  for (const stage of cls.stages) {
    if (!stage.skills) continue;
    const raw = stage.skills.trim();
    if (raw.toLowerCase().startsWith('todas')) continue;

    const parts = raw.split(',');
    for (const part of parts) {
      const match = part.trim().match(/^([a-zA-ZÀ-ÿ\s\-]+?)\s+(\d+)$/);
      if (match) {
        const namePt = match[1].trim().toLowerCase();
        const av = SKILL_NAME_TO_ACTOR_VALUE[namePt];
        if (av) skills.add(av);
      }
    }
  }

  // Complementa com base nas perks de estágio 1 caso existam habilidades não citadas explicitamente depois
  if (cls.stages && cls.stages.length > 0) {
    for (const stage of cls.stages) {
      if (!stage.perks) continue;
      for (const perk of stage.perks) {
        if (perk.includes('Destruction')) skills.add('Destruction');
        if (perk.includes('Alteration')) skills.add('Alteration');
        if (perk.includes('Restoration')) skills.add('Restoration');
        if (perk.includes('Conjuration')) skills.add('Conjuration');
        if (perk.includes('Illusion')) skills.add('Illusion');
        if (perk.includes('One-Handed') || perk.includes('OneHanded')) skills.add('OneHanded');
        if (perk.includes('Two-Handed') || perk.includes('TwoHanded')) skills.add('TwoHanded');
        if (perk.includes('Block')) skills.add('Block');
        if (perk.includes('Heavy Armor')) skills.add('HeavyArmor');
        if (perk.includes('Light Armor')) skills.add('LightArmor');
        if (perk.includes('Archery') || perk.includes('Marksman')) skills.add('Marksman');
        if (perk.includes('Sneak')) skills.add('Sneak');
      }
    }
  }

  return Array.from(skills);
}

/**
 * Resolve os patamares mínimos de cada habilidade exigidos pela classe até o nível atual.
 * Exemplo: Elementalista no Nível 15 atinge Destruição 40, Alteração 40 e Restauração 40.
 */
export function resolveSkillsForClassAndLevel(cls: ClassDefinition, level: number): Record<string, number> {
  const result: Record<string, number> = {};
  const primarySkills = getClassPrimarySkills(cls);

  for (const skill of primarySkills) {
    result[skill] = 0;
  }

  for (const stage of cls.stages) {
    if (stage.level <= level) {
      const raw = stage.skills ? stage.skills.trim() : '';
      if (!raw) continue;

      const lower = raw.toLowerCase();
      if (lower.startsWith('todas')) {
        const match = lower.match(/^todas\s+(\d+)$/);
        const val = match ? parseInt(match[1], 10) : 0;
        for (const skill of primarySkills) {
          result[skill] = Math.max(result[skill] || 0, val);
        }
      } else {
        const parts = raw.split(',');
        for (const part of parts) {
          const match = part.trim().match(/^([a-zA-ZÀ-ÿ\s\-]+?)\s+(\d+)$/);
          if (match) {
            const namePt = match[1].trim().toLowerCase();
            const val = parseInt(match[2], 10);
            const av = SKILL_NAME_TO_ACTOR_VALUE[namePt];
            if (av) {
              result[av] = Math.max(result[av] || 0, val);
            }
          }
        }
      }
    }
  }

  return result;
}
