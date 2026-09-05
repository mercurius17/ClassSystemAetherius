const fs = require('fs');
const path = require('path');
const classes = require('../config/classes-config.json');

const spells = {};

for (const [id, cls] of Object.entries(classes)) {
  if (cls.allSpellsList) {
    for (const s of cls.allSpellsList) {
      if (!spells[s.name]) {
        spells[s.name] = {
          name: s.name,
          namePt: s.name,
          tier: s.tier || 'Novato',
          descriptionPt: s.description || ''
        };
      }
    }
  }
  if (cls.authorizedSpells) {
    for (const [tier, list] of Object.entries(cls.authorizedSpells)) {
      for (const s of list) {
        if (!spells[s]) {
          spells[s] = {
            name: s,
            namePt: s,
            tier: tier,
            descriptionPt: 'Feitiço arcano autorizado da classe.'
          };
        } else if (!spells[s].tier) {
          spells[s].tier = tier;
        }
      }
    }
  }
}

// Translations dictionary for common Skyrim spells
const ptTranslations = {
  'Flames': { namePt: 'Chamas', desc: 'Dispara uma rajada de fogo que causa 8 de dano por segundo. Alvos em chamas sofrem dano adicional ao longo do tempo.' },
  'Frostbite': { namePt: 'Mordedura de Gelo', desc: 'Dispara um jato de gelo que causa 8 de dano por segundo à Vida e ao Vigor.' },
  'Sparks': { namePt: 'Faíscas', desc: 'Dispara uma corrente de eletricidade que causa 8 de dano por segundo à Vida e à Mágicka.' },
  'Ice Spike': { namePt: 'Estaca de Gelo', desc: 'Dispara um projétil pontiagudo de gelo que causa 20 de dano de gelo à Vida e ao Vigor.' },
  'Lightning Bolt': { namePt: 'Raio Relampejante', desc: 'Dispara uma descarga elétrica concentrada que causa 20 de dano de choque à Vida e à Mágicka.' },
  'Burning Touch': { namePt: 'Toque Flamejante', desc: 'Causa 30 de dano de fogo imediato a inimigos em alcance corpo a corpo.' },
  'Fireball': { namePt: 'Bola de Fogo', desc: 'Lança uma esfera explosiva de fogo que explode em área causando 40 de dano de fogo.' },
  'Frost Cloak': { namePt: 'Manto de Gelo', desc: 'Por 60 segundos, envolve o conjurador em uma nevasca que causa 8 de dano de gelo por segundo a inimigos próximos.' },
  'Chain Lightning': { namePt: 'Relâmpago em Cadeia', desc: 'Dispara um arco elétrico que causa 40 de dano de choque e salta para alvos adjacentes.' },
  'Oakflesh': { namePt: 'Pele de Carvalho', desc: 'Aumenta a armadura do conjurador em 40 pontos por 60 segundos.' },
  'Stoneflesh': { namePt: 'Pele de Pedra', desc: 'Aumenta a armadura do conjurador em 80 pontos por 60 segundos.' },
  'Ironflesh': { namePt: 'Pele de Ferro', desc: 'Aumenta a armadura do conjurador em 120 pontos por 60 segundos.' },
  'Ebonyflesh': { namePt: 'Pele de Ébano', desc: 'Aumenta a armadura do conjurador em 160 pontos por 60 segundos.' },
  'Dragonhide': { namePt: 'Couro de Dragão', desc: 'Concede redução máxima de dano físico ignorando 80% do dano de ataques físicos.' },
  'Windwalker': { namePt: 'Passo do Vento', desc: 'Aumenta a velocidade de movimento em 10% por 120 segundos.' },
  'Magelight': { namePt: 'Luz Mágica', desc: 'Cria uma esfera luminosa que flutua por 300 segundos iluminando o ambiente onde você mirar.' },
  'Candlelight': { namePt: 'Luz de Vela', desc: 'Cria uma esfera de luz que paira sobre a cabeça do conjurador por 60 segundos.' },
  'Shock Shell': { namePt: 'Carapaça Elétrica', desc: 'Aumenta a resistência a Choque em 50% por 120 segundos.' },
  'Steadfast Ward': { namePt: 'Escudo Firme', desc: 'Gera uma barreira defensiva que anula até 60 pontos de dano mágico.' },
  'Lesser Ward': { namePt: 'Escudo Menor', desc: 'Gera uma barreira defensiva que anula até 40 pontos de dano mágico.' },
  'Greater Ward': { namePt: 'Escudo Maior', desc: 'Gera uma barreira defensiva robusta que anula até 90 pontos de dano mágico.' },
  'Healing': { namePt: 'Cura', desc: 'Cura o conjurador em 10 pontos de vida por segundo enquanto canalizado.' },
  'Fast Healing': { namePt: 'Cura Rápida', desc: 'Restaura instantaneamente 50 pontos de vida do conjurador.' },
  'Close Wounds': { namePt: 'Fechar Feridas', desc: 'Restaura instantaneamente 100 pontos de vida do conjurador.' },
  'Grand Healing': { namePt: 'Grande Cura', desc: 'Cura 200 pontos de vida de todos os aliados próximos e do conjurador.' },
  'Heal Other': { namePt: 'Curar Outro', desc: 'Restaura instantaneamente 75 pontos de vida do aliado alvo.' },
  'Sun Fire': { namePt: 'Fogo Solar', desc: 'Dispara um projétil de luz solar que causa 25 de dano de sol a mortos-vivos.' },
  "Vampire's Bane": { namePt: 'Ruína dos Vampiros', desc: 'Causa 40 de dano de luz solar em área a todos os mortos-vivos atingidos.' },
  "Stendarr's Aura": { namePt: 'Aura de Stendarr', desc: 'Envolve o paladino em luz consagrada que queima mortos-vivos próximos por 60 segundos.' },
  'Banish Daedra': { namePt: 'Banir Daedra', desc: 'Bane criaturas daédricas de volta ao Oblivion se forem até o nível 15.' },
  'Command Daedra': { namePt: 'Comandar Daedra', desc: 'Toma o controle de criaturas daédricas invocadas por inimigos até o nível 20.' },
  'Conjure Familiar': { namePt: 'Invocar Familiar', desc: 'Invoca um lobo espectral por 60 segundos para lutar ao seu lado.' },
  'Conjure Flame Atronach': { namePt: 'Invocar Atronach da Chama', desc: 'Invoca um elemental de fogo que dispara virotes de chamas à distância por 60 segundos.' },
  'Conjure Frost Atronach': { namePt: 'Invocar Atronach do Gelo', desc: 'Invoca um golem de gelo resistente que esmaga inimigos no combate corpo a corpo por 60 segundos.' },
  'Conjure Storm Atronach': { namePt: 'Invocar Atronach da Tempestade', desc: 'Invoca um colosso elétrico que dispara raios e relâmpagos devastadores por 60 segundos.' },
  'Conjure Dremora Lord': { namePt: 'Invocar Lorde Dremora', desc: 'Invoca um guerreiro daédrico armado com espada de duas mãos que dilacera oponentes por 60 segundos.' },
  'Soul Trap': { namePt: 'Aprisionar Alma', desc: 'Se o alvo morrer dentro de 60 segundos, sua alma é aprisionada em uma gema da alma adequada.' },
  'Raise Zombie': { namePt: 'Erguer Zumbi', desc: 'Ressuscita um corpo fraco para lutar por você durante 60 segundos.' },
  'Reanimate Corpse': { namePt: 'Reanimar Cadáver', desc: 'Ressuscita um corpo de nível intermediário para lutar por você durante 60 segundos.' },
  'Revenant': { namePt: 'Espectro Vingador', desc: 'Ressuscita um corpo poderoso para lutar por você durante 60 segundos.' },
  'Dread Zombie': { namePt: 'Zumbi Pavoroso', desc: 'Ressuscita um cadáver de elite muito poderoso para lutar por você durante 60 segundos.' },
  'Dead Thrall': { namePt: 'Escravo Cadavérico', desc: 'Ressuscita permanentemente um cadáver que luta lealmente ao seu lado até ser destruído.' },
  'Bound Sword': { namePt: 'Espada Vinculada', desc: 'Cria uma espada daédrica mágica por 120 segundos que aprisiona almas.' },
  'Bound Battleaxe': { namePt: 'Machado de Batalha Vinculado', desc: 'Cria um machado daédrico mágico de duas mãos por 120 segundos.' },
  'Bound Bow': { namePt: 'Arco Vinculado', desc: 'Cria um arco daédrico mágico e 100 flechas espectrais por 120 segundos.' },
  'Bound Dagger': { namePt: 'Adaga Vinculada', desc: 'Cria uma adaga mágica daédrica por 120 segundos silenciosa para assassinatos.' },
  'Clairvoyance': { namePt: 'Clarividência', desc: 'Mostra o caminho mágico até o seu objetivo de missão atual.' },
  'Courage': { namePt: 'Coragem', desc: 'O alvo não foge por 60 segundos e recebe +20 de vida e vigor.' },
  'Calm': { namePt: 'Acalmar', desc: 'Criaturas e pessoas até o nível 9 cessam hostilidades por 30 segundos.' },
  'Pacify': { namePt: 'Pacificar', desc: 'Criaturas e pessoas até o nível 20 cessam hostilidades por 60 segundos.' },
  'Fury': { namePt: 'Fúria', desc: 'Criaturas e pessoas até o nível 6 atacam qualquer um próximo por 30 segundos.' },
  'Frenzy': { namePt: 'Frenesi', desc: 'Criaturas e pessoas até o nível 14 atacam alvos aleatórios descontroladamente por 60 segundos.' },
  'Fear': { namePt: 'Medo', desc: 'Criaturas e pessoas até o nível 9 fogem aterrorizadas por 30 segundos.' },
  'Rout': { namePt: 'Debandada', desc: 'Criaturas e pessoas até o nível 20 fogem de pavor por 30 segundos.' },
  'Muffle': { namePt: 'Silenciar Passos', desc: 'Você se move em silêncio absoluto por 180 segundos.' },
  'Invisibility': { namePt: 'Invisibilidade', desc: 'O conjurador fica invisível por até 240 segundos ou até interagir com o mundo.' },
  'Fire Rune': { namePt: 'Runa de Fogo', desc: 'Desenha uma armadilha rúnica no chão que explode em chamas quando um inimigo passa por cima.' },
  'Frost Rune': { namePt: 'Runa de Gelo', desc: 'Desenha uma runa que explode em estilhaços de gelo ao contato inimigo.' },
  'Lightning Rune': { namePt: 'Runa de Eletricidade', desc: 'Desenha uma runa que explode em descarga elétrica ao contato inimigo.' },
  'Frenzy Rune': { namePt: 'Runa de Frenesi', desc: 'Runa que força os inimigos atingidos a lutarem entre si.' },
  'Ash Rune': { namePt: 'Runa de Cinzas', desc: 'Prende os inimigos em casulos de cinzas petrificadas por 30 segundos.' },
  'Paralyze': { namePt: 'Paralisia', desc: 'Paralisa o alvo por 10 segundos, impedindo qualquer movimento.' },
  'Mass Paralysis': { namePt: 'Paralisia em Massa', desc: 'Paralisa todos os inimigos em uma grande área ao redor do conjurador por 15 segundos.' },
  'Telekinesis': { namePt: 'Telecinese', desc: 'Puxa objetos distantes para a sua mão ou os arremessa como projéteis.' },
  'Detect Life': { namePt: 'Detectar Vida', desc: 'Permite enxergar seres vivos através de paredes e obstáculos por proximidade.' },
  'Detect Dead': { namePt: 'Detectar Mortos', desc: 'Permite enxergar mortos-vivos e cadáveres através de paredes e obstáculos.' },
  'Waterbreathing': { namePt: 'Respiração Aquática', desc: 'Permite respirar debaixo d\'água por 60 segundos.' },
  'Transmute Mineral Ore': { namePt: 'Transmutar Minério', desc: 'Transmuta minério de ferro em prata, e prata em ouro.' },
  'Blizzard': { namePt: 'Nevasca', desc: 'Cria uma tempestade congelante que devasta todos os alvos por 10 segundos.' },
  'Fire Storm': { namePt: 'Tempestade de Fogo', desc: 'Libera uma detonação cósmica que reduz tudo ao redor a cinzas com até 150 de dano.' },
  'Lightning Storm': { namePt: 'Tempestade de Raios', desc: 'Canaliza um raio contínuo de alta potência que desintegra inimigos com 75 de dano por segundo.' },
  'Bane of the Undead': { namePt: 'Ruína dos Mortos-Vivos', desc: 'Queima e coloca em fuga todos os mortos-vivos até o nível 30 em uma ampla área.' },
  'Guardian Circle': { namePt: 'Círculo Guardião', desc: 'Desenha um círculo consagrado no solo que cura aliados e expulsa mortos-vivos.' }
};

for (const [key, s] of Object.entries(spells)) {
  if (ptTranslations[key]) {
    s.namePt = ptTranslations[key].namePt;
    s.descriptionPt = ptTranslations[key].desc;
  } else {
    s.namePt = s.name;
    if (!s.descriptionPt || s.descriptionPt === '') {
      s.descriptionPt = 'Feitiço arcano autorizado da classe.';
    }
  }
}

const outputPath = path.resolve(__dirname, '../config/spells-descriptions.json');
fs.writeFileSync(outputPath, JSON.stringify(spells, null, 2), 'utf-8');
console.log('Gerado config/spells-descriptions.json com', Object.keys(spells).length, 'feitiços.');
