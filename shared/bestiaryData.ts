export interface BestiaryEntry {
  name: string;
  category: string;
  baseXp: number;
  notes?: string;
  isDragonPriest?: boolean;
  isDragon?: boolean;
}

export const BESTIARY_DATA: Record<string, BestiaryEntry> = {
  'bandit': { name: 'Bandit', category: 'Humanoides', baseXp: 10.0, notes: 'Inimigo comum de referência inicial' },
  'riekling': { name: 'Riekling', category: 'Humanoides', baseXp: 10.0, notes: 'Equivalente tribal ao bandido' },
  'silver_hand': { name: 'Silver Hand', category: 'Humanoides', baseXp: 12.0, notes: 'Guerreiros caçadores com armas de prata' },
  'reaver': { name: 'Reaver', category: 'Humanoides', baseXp: 13.0, notes: 'Saqueadores nórdicos de Solstheim' },
  'forsworn': { name: 'Forsworn', category: 'Humanoides', baseXp: 15.0, notes: 'Tribais rebeldes de Reach' },
  'warlock': { name: 'Warlock / Necromancer', category: 'Humanoides', baseXp: 15.0, notes: 'Conjuradores hostis e necromantes' },
  'vampire': { name: 'Vampire', category: 'Humanoides', baseXp: 16.0, notes: 'Predadores da noite com magias de dreno' },
  'thalmor': { name: 'Thalmor Justiciar', category: 'Humanoides', baseXp: 18.0, notes: 'Tropa de elite armada com magia e vidro' },

  // Mortos-vivos
  'skeleton': { name: 'Skeleton', category: 'Mortos-Vivos', baseXp: 8.0, notes: 'Lacaio frágil de túmulos' },
  'draugr': { name: 'Draugr', category: 'Mortos-Vivos', baseXp: 18.0, notes: 'Guerreiro antigo de criptas nórdicas' },
  'ghost': { name: 'Ghost / Corrupted Shade', category: 'Mortos-Vivos', baseXp: 14.0, notes: 'Entidade etérea imune a veneno' },
  'ash_spawn': { name: 'Ash Spawn', category: 'Mortos-Vivos', baseXp: 20.0, notes: 'Monstruosidade vulcânica de Solstheim' },
  'dragon_priest': { name: 'Dragon Priest', category: 'Mortos-Vivos', baseXp: 500.0, notes: 'Chefe Épico de cripta nórdica', isDragonPriest: true },

  // Animais e Insetoides
  'mudcrab': { name: 'Mudcrab', category: 'Animais e Insetoides', baseXp: 3.0, notes: 'Crustáceo trivial de rios' },
  'skeever': { name: 'Skeever', category: 'Animais e Insetoides', baseXp: 4.0, notes: 'Roedor comum com doenças' },
  'slaughterfish': { name: 'Slaughterfish', category: 'Animais e Insetoides', baseXp: 4.0, notes: 'Peixe carnívoro de rios e lagos' },
  'wolf': { name: 'Wolf', category: 'Animais e Insetoides', baseXp: 5.0, notes: 'Predador comum de matilha' },
  'horker': { name: 'Horker', category: 'Animais e Insetoides', baseXp: 6.0, notes: 'Mamífero marinho costeiro resistente' },
  'frostbite_spider': { name: 'Frostbite Spider', category: 'Animais e Insetoides', baseXp: 7.0, notes: 'Aranha tecelã venenosa' },
  'sabre_cat': { name: 'Sabre Cat', category: 'Animais e Insetoides', baseXp: 9.0, notes: 'Predador felino ágil' },
  'bear': { name: 'Bear', category: 'Animais e Insetoides', baseXp: 10.0, notes: 'Urso territorial de força pesada' },
  'death_hound': { name: 'Death Hound', category: 'Animais e Insetoides', baseXp: 12.0, notes: 'Cão corrompido de vampiros' },
  'netch': { name: 'Netch', category: 'Animais e Insetoides', baseXp: 13.0, notes: 'Criatura flutuante de Solstheim' },
  'mammoth': { name: 'Mammoth', category: 'Animais e Insetoides', baseXp: 15.0, notes: 'Colosso dos acampamentos de gigantes' },
  'giant': { name: 'Giant', category: 'Criaturas e Monstros', baseXp: 25.0, notes: 'Gigante pastor de mamutes' },
  'troll': { name: 'Frost / Cave Troll', category: 'Criaturas e Monstros', baseXp: 20.0, notes: 'Besta feroz com regeneração acelerada' },
  'hagraven': { name: 'Hagraven', category: 'Criaturas e Monstros', baseXp: 24.0, notes: 'Bruxa ave corrompida de Reach' },
  'chaurus': { name: 'Chaurus', category: 'Animais e Insetoides', baseXp: 15.0, notes: 'Inseto subterrâneo com ácido' },
  'falmer': { name: 'Falmer', category: 'Humanoides', baseXp: 18.0, notes: 'Elfos cegos das profundezas' },
  'lurker': { name: 'Lurker', category: 'Criaturas e Monstros', baseXp: 28.0, notes: 'Monstro abissal de Apocrypha' },
  'seeker': { name: 'Seeker', category: 'Criaturas e Monstros', baseXp: 30.0, notes: 'Entidade mágica arcana de Apocrypha' },

  // Autômatos Dwemer
  'dwarven_spider': { name: 'Dwarven Spider', category: 'Autômatos Dwemer', baseXp: 12.0, notes: 'Autômato ágil de patrulha' },
  'dwarven_sphere': { name: 'Dwarven Sphere', category: 'Autômatos Dwemer', baseXp: 18.0, notes: 'Guardião rápido com lâmina e besta' },
  'dwarven_ballista': { name: 'Dwarven Ballista', category: 'Autômatos Dwemer', baseXp: 24.0, notes: 'Artilharia pesada dwemer' },
  'dwarven_centurion': { name: 'Dwarven Centurion', category: 'Autômatos Dwemer', baseXp: 30.0, notes: 'Colosso dwemer a vapor' },

  // Daedra
  'flame_atronach': { name: 'Flame Atronach', category: 'Daedra', baseXp: 20.0, notes: 'Daedra elemental de fogo' },
  'frost_atronach': { name: 'Frost Atronach', category: 'Daedra', baseXp: 22.0, notes: 'Golem bruto elemental de gelo' },
  'storm_atronach': { name: 'Storm Atronach', category: 'Daedra', baseXp: 25.0, notes: 'Elemental de eletricidade' },
  'dremora': { name: 'Dremora', category: 'Daedra', baseXp: 30.0, notes: 'Guerreiro daédrico avançado' },

  // Dragões
  'dragon': { name: 'Dragon (Todas as variantes)', category: 'Dragões', baseXp: 1000.0, notes: 'Ameaça mítica rara. Evento de servidor.', isDragon: true }
};

export function findBestiaryEntry(nameOrKey: string): BestiaryEntry {
  const normalized = nameOrKey.toLowerCase().replace(/[\s\-_]/g, '');
  for (const [k, v] of Object.entries(BESTIARY_DATA)) {
    const kNorm = k.replace(/[\s\-_]/g, '');
    const nameNorm = v.name.toLowerCase().replace(/[\s\-_]/g, '');
    if (normalized.includes(kNorm) || normalized.includes(nameNorm) || kNorm.includes(normalized)) {
      return v;
    }
  }

  // Fallback para inimigo padrão
  return {
    name: nameOrKey,
    category: 'Desconhecido',
    baseXp: 10.0,
    notes: 'Criatura não catalogada'
  };
}
