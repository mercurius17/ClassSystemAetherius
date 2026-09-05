const fs = require('fs');
const path = require('path');

const spellsData = {
  // Destruição - Fogo
  'Flames': {
    namePt: 'Chamas',
    tier: 'Novato',
    descriptionPt: 'Dispara uma rajada contínua de fogo que causa 8 de dano por segundo. Alvos em chamas sofrem dano adicional residual.'
  },
  'Firebolt': {
    namePt: 'Dardo Ígneo',
    tier: 'Aprendiz',
    descriptionPt: 'Dispara um projétil flamejante veloz que causa 20 de dano de fogo no impacto.'
  },
  'Fire Bolt': {
    namePt: 'Dardo de Fogo',
    tier: 'Aprendiz',
    descriptionPt: 'Dispara um projétil flamejante veloz que causa 20 de dano de fogo no impacto.'
  },
  'Burning Touch': {
    namePt: 'Toque Flamejante',
    tier: 'Aprendiz',
    descriptionPt: 'Causa 30 de dano de fogo imediato a adversários em alcance de combate corpo a corpo.'
  },
  'Fire Rune': {
    namePt: 'Runa de Fogo',
    tier: 'Aprendiz',
    descriptionPt: 'Grava uma armadilha rúnica no chão que explode quando um inimigo se aproxima, causando 40 de dano de fogo em área.'
  },
  'Greater Flames': {
    namePt: 'Chamas Superiores',
    tier: 'Adepto',
    descriptionPt: 'Libera uma torrente concentrada de fogo que causa 20 de dano de fogo por segundo.'
  },
  'Flame Cloak': {
    namePt: 'Manto de Chamas',
    tier: 'Adepto',
    descriptionPt: 'Por 60 segundos, envolve o conjurador em fogo, causando 8 de dano de fogo por segundo a todos os inimigos próximos.'
  },
  'Fireball': {
    namePt: 'Bola de Fogo',
    tier: 'Adepto',
    descriptionPt: 'Lança uma esfera explosiva de chamas que detona ao impacto causando 40 de dano de fogo em um amplo raio.'
  },
  'Wall of Flames': {
    namePt: 'Muralha de Chamas',
    tier: 'Especialista',
    descriptionPt: 'Pinta o solo com fogo persistente que causa 20 de dano por segundo a qualquer adversário que atravessar a barreira.'
  },
  'Incinerate': {
    namePt: 'Incinerar',
    tier: 'Especialista',
    descriptionPt: 'Dispara uma poderosa labareda incandescente que causa 60 de dano de fogo massivo ao alvo.'
  },
  'Firestorm': {
    namePt: 'Tempestade de Fogo',
    tier: 'Mestre',
    descriptionPt: 'Libera uma detonação apocalíptica de chamas que causa até 100 de dano de fogo a todos os inimigos em uma área colossal.'
  },
  'Flame Shell': {
    namePt: 'Carapaça Ígnea',
    tier: 'Adepto',
    descriptionPt: 'Aumenta a resistência a dano de Fogo do conjurador em 50% por 120 segundos.'
  },

  // Destruição - Gelo
  'Frostbite': {
    namePt: 'Mordedura de Gelo',
    tier: 'Novato',
    descriptionPt: 'Dispara um jato contínuo de geada que causa 8 de dano por segundo à Vida e ao Vigor, desacelerando o alvo.'
  },
  'Ice Spike': {
    namePt: 'Estaca de Gelo',
    tier: 'Aprendiz',
    descriptionPt: 'Arremessa um espinho pontiagudo de gelo que causa 20 de dano de gelo à Vida e ao Vigor do inimigo.'
  },
  'Chilling Touch': {
    namePt: 'Toque Congelante',
    tier: 'Aprendiz',
    descriptionPt: 'Aplica um frio sepulcral em combate corpo a corpo, causando 30 de dano de gelo à Vida e drenando o Vigor.'
  },
  'Frost Rune': {
    namePt: 'Runa de Gelo',
    tier: 'Aprendiz',
    descriptionPt: 'Grava uma runa gélida no solo que explode ao contato inimigo, causando 40 de dano de gelo em área e lentidão.'
  },
  'Greater Frostbite': {
    namePt: 'Geada Superior',
    tier: 'Adepto',
    descriptionPt: 'Projeta um vendaval gélido denso que inflige 20 de dano de gelo por segundo à Vida e ao Vigor dos oponentes.'
  },
  'Frost Cloak': {
    namePt: 'Manto de Gelo',
    tier: 'Adepto',
    descriptionPt: 'Por 60 segundos, envolve o conjurador em uma tempestade invernal que causa 8 de dano de gelo por segundo a inimigos próximos.'
  },
  'Ice Storm': {
    namePt: 'Tempestade de Gelo',
    tier: 'Adepto',
    descriptionPt: 'Dispara uma espiral rodopiante de gelo que rasga os inimigos na trajetória causando 40 de dano de gelo à Vida e Vigor.'
  },
  'Wall of Frost': {
    namePt: 'Muralha de Gelo',
    tier: 'Especialista',
    descriptionPt: 'Ergue uma barreira de estilhaços glaciais no solo que causa 20 de dano de gelo por segundo a quem a atravessar.'
  },
  'Icy Spear': {
    namePt: 'Lança Glacial',
    tier: 'Especialista',
    descriptionPt: 'Arremessa uma lança maciça de puro gelo que empala o alvo causando 60 de dano de gelo e drenando o Vigor.'
  },
  'Blizzard': {
    namePt: 'Nevasca',
    tier: 'Mestre',
    descriptionPt: 'Conjura uma nevasca devastadora ao redor do mago por 10 segundos, causando 20 de dano de gelo contínuo em área massiva.'
  },
  'Frost Shell': {
    namePt: 'Carapaça Glacial',
    tier: 'Adepto',
    descriptionPt: 'Aumenta a resistência a dano de Gelo do conjurador em 50% por 120 segundos.'
  },

  // Destruição - Choque / Eletricidade
  'Sparks': {
    namePt: 'Faíscas',
    tier: 'Novato',
    descriptionPt: 'Canaliza uma corrente de relâmpagos contínuos que causa 8 de dano de choque por segundo à Vida e à Mágicka.'
  },
  'Lightning Bolt': {
    namePt: 'Raio Relampejante',
    tier: 'Aprendiz',
    descriptionPt: 'Dispara um relâmpago veloz e concentrado que atinge o alvo instantaneamente com 20 de dano de choque à Vida e Mágicka.'
  },
  'Shocking Touch': {
    namePt: 'Toque Elétrico',
    tier: 'Aprendiz',
    descriptionPt: 'Descarrega alta voltagem a curta distância, causando 30 de dano elétrico à Vida e dizimando a Mágicka do oponente.'
  },
  'Lightning Rune': {
    namePt: 'Runa de Eletricidade',
    tier: 'Aprendiz',
    descriptionPt: 'Grava uma armadilha elétrica no chão que detona com a passagem inimiga causando 40 de dano de choque e desestabilização.'
  },
  'Greater Sparks': {
    namePt: 'Faíscas Superiores',
    tier: 'Adepto',
    descriptionPt: 'Canaliza uma torrente eletrificada de alta voltagem causando 20 de dano de choque por segundo à Vida e Mágicka.'
  },
  'Lightning Cloak': {
    namePt: 'Manto da Tempestade',
    tier: 'Adepto',
    descriptionPt: 'Por 60 segundos, arcos elétricos circundam o conjurador causando 8 de dano de choque por segundo a inimigos adjacentes.'
  },
  'Chain Lightning': {
    namePt: 'Relâmpago em Cadeia',
    tier: 'Adepto',
    descriptionPt: 'Dispara uma poderosa descarga que causa 40 de dano de choque e salta para múltiplos inimigos próximos.'
  },
  'Wall of Storms': {
    namePt: 'Muralha da Tempestade',
    tier: 'Especialista',
    descriptionPt: 'Eletrifica o solo criando uma cerca viva de raios que causa 20 de dano de choque contínuo por segundo a quem passar.'
  },
  'Thunderbolt': {
    namePt: 'Trovão Fulminante',
    tier: 'Especialista',
    descriptionPt: 'Conjura um raio fulminante devastador que causa 60 de dano de choque instantâneo à Vida e Mágicka do alvo.'
  },
  'Lightning Storm': {
    namePt: 'Tempestade de Raios',
    tier: 'Mestre',
    descriptionPt: 'Canaliza um feixe contínuo cataclísmico que desintegra inimigos na mira causando 75 de dano de choque por segundo.'
  },
  'Shock Shell': {
    namePt: 'Carapaça Elétrica',
    tier: 'Adepto',
    descriptionPt: 'Aumenta a resistência a dano de Choque do conjurador em 50% por 120 segundos.'
  },

  // Alteração
  'Oakflesh': {
    namePt: 'Pele de Carvalho',
    tier: 'Novato',
    descriptionPt: 'Aumenta o índice de armadura do conjurador em 40 pontos durante 60 segundos.'
  },
  'Stoneflesh': {
    namePt: 'Pele de Pedra',
    tier: 'Aprendiz',
    descriptionPt: 'Endurece a pele do mago aumentando a armadura em 80 pontos durante 60 segundos.'
  },
  'Ironflesh': {
    namePt: 'Pele de Ferro',
    tier: 'Adepto',
    descriptionPt: 'Fortalece o corpo com densidade de ferro, concedendo +120 de armadura durante 60 segundos.'
  },
  'Ebonyflesh': {
    namePt: 'Pele de Ébano',
    tier: 'Especialista',
    descriptionPt: 'Reveste o corpo com a dureza mítica do ébano, aumentando a armadura em 160 pontos durante 60 segundos.'
  },
  'Dragonhide': {
    namePt: 'Couro de Dragão',
    tier: 'Mestre',
    descriptionPt: 'Endurece o tecido corpóreo ao extremo, ignorando 80% de todo o dano físico sofrido durante 30 segundos.'
  },
  'Candlelight': {
    namePt: 'Luz de Vela',
    tier: 'Novato',
    descriptionPt: 'Cria uma esfera mágica de luz que paira sobre a cabeça do conjurador por 60 segundos.'
  },
  'Magelight': {
    namePt: 'Luz Mágica',
    tier: 'Aprendiz',
    descriptionPt: 'Dispara um orbe luminoso que se fixa no local de impacto ou alvo iluminando o ambiente por 300 segundos.'
  },
  'Windwalker': {
    namePt: 'Passo do Vento',
    tier: 'Aprendiz',
    descriptionPt: 'Aumenta a velocidade de movimento do personagem em 10% durante 120 segundos.'
  },
  'Detect Life': {
    namePt: 'Detectar Vida',
    tier: 'Adepto',
    descriptionPt: 'Permite ao conjurador enxergar seres vivos através de paredes e obstáculos próximos enquanto canalizado.'
  },
  'Detect Dead': {
    namePt: 'Detectar Mortos',
    tier: 'Especialista',
    descriptionPt: 'Permite enxergar cadáveres e mortos-vivos através de paredes e estruturas enquanto canalizado.'
  },
  'Telekinesis': {
    namePt: 'Telecinese',
    tier: 'Adepto',
    descriptionPt: 'Puxa objetos distantes para as mãos do conjurador ou arremessa itens como projéteis.'
  },
  'Waterbreathing': {
    namePt: 'Respiração Aquática',
    tier: 'Adepto',
    descriptionPt: 'Permite ao conjurador respirar debaixo d\'água sem risco de afogamento por 60 segundos.'
  },
  'Transmute Mineral Ore': {
    namePt: 'Transmutar Minério',
    tier: 'Adepto',
    descriptionPt: 'Transmuta uma unidade de minério de ferro bruto em prata, ou prata em ouro puro no inventário.'
  },
  'Paralyze': {
    namePt: 'Paralisia',
    tier: 'Especialista',
    descriptionPt: 'Imobiliza totalmente o alvo no chão durante 10 segundos, impedindo qualquer movimento ou ataque.'
  },
  'Mass Paralysis': {
    namePt: 'Paralisia em Massa',
    tier: 'Mestre',
    descriptionPt: 'Paralisa todos os inimigos ao redor do conjurador em uma ampla área por 15 segundos.'
  },
  'Ash Cloud': {
    namePt: 'Nuvem de Cinzas',
    tier: 'Especialista',
    descriptionPt: 'Envolve os inimigos em uma nuvem de cinzas vulcânicas por 30 segundos, imobilizando-os em casulos.'
  },
  'Cinder Storm': {
    namePt: 'Tempestade de Cinzas',
    tier: 'Mestre',
    descriptionPt: 'Provoca uma erupção de cinzas em área colossal que petrifica múltiplos oponentes por 30 segundos.'
  },
  'Weight of the World': {
    namePt: 'Peso do Mundo',
    tier: 'Mestre',
    descriptionPt: 'Aumenta drasticamente a gravidade sobre os inimigos, reduzindo sua velocidade de ataque e movimento em 40%.'
  },
  'Burden': {
    namePt: 'Fardo Gravitacional',
    tier: 'Aprendiz',
    descriptionPt: 'Sobrecarrega o alvo com peso mágico, diminuindo sua velocidade de movimento e ataque em 20% por 30 segundos.'
  },
  'Featherlight': {
    namePt: 'Leveza da Pluma',
    tier: 'Adepto',
    descriptionPt: 'Torna o corpo do conjurador leve como uma pluma por 30 segundos, anulando dano de queda e acelerando a corrida.'
  },

  // Restauração
  'Healing': {
    namePt: 'Cura Básica',
    tier: 'Novato',
    descriptionPt: 'Canaliza energia sagrada para curar o conjurador em 10 pontos de Vida por segundo.'
  },
  'Fast Healing': {
    namePt: 'Cura Rápida',
    tier: 'Aprendiz',
    descriptionPt: 'Restaura instantaneamente 50 pontos de Vida do conjurador.'
  },
  'Close Wounds': {
    namePt: 'Fechar Feridas',
    tier: 'Adepto',
    descriptionPt: 'Fecha lacerações e regenera tecidos, restaurando instantaneamente 100 pontos de Vida.'
  },
  'Close Greater Wounds': {
    namePt: 'Fechar Grandes Feridas',
    tier: 'Especialista',
    descriptionPt: 'Regenera ferimentos graves, restaurando instantaneamente 150 pontos de Vida ao conjurador.'
  },
  'Greater Healing': {
    namePt: 'Cura Superior',
    tier: 'Adepto',
    descriptionPt: 'Restaura 30 pontos de Vida por segundo para o conjurador e aliados próximos enquanto canalizado.'
  },
  'Grand Healing': {
    namePt: 'Grande Cura',
    tier: 'Especialista',
    descriptionPt: 'Restaura instantaneamente 200 pontos de Vida do conjurador e de todos os aliados no raio de alcance.'
  },
  'Heal Other': {
    namePt: 'Curar Aliado',
    tier: 'Adepto',
    descriptionPt: 'Restaura instantaneamente 75 pontos de Vida do companheiro de equipe mirado.'
  },
  'Lesser Ward': {
    namePt: 'Barreira Menor',
    tier: 'Novato',
    descriptionPt: 'Ergue um escudo de energia pura que anula até 40 pontos de dano mágico e concede +40 de armadura.'
  },
  'Steadfast Ward': {
    namePt: 'Barreira Firme',
    tier: 'Aprendiz',
    descriptionPt: 'Ergue uma barreira defensiva resiliente que bloqueia até 60 pontos de dano mágico recebido.'
  },
  'Greater Ward': {
    namePt: 'Barreira Maior',
    tier: 'Adepto',
    descriptionPt: 'Ergue uma barreira defensiva impenetrável que absorve e anula até 90 pontos de dano de feitiços.'
  },
  'Grand Ward': {
    namePt: 'Barreira Suprema',
    tier: 'Especialista',
    descriptionPt: 'Ergue um escudo protetor reforçado capaz de anular até 120 pontos de dano mágico de feitiços inimigos.'
  },
  'Turn Undead': {
    namePt: 'Expulsar Mortos-Vivos',
    tier: 'Aprendiz',
    descriptionPt: 'Faz com que mortos-vivos até o nível 10 fujam aterrorizados em pânico sagrado durante 30 segundos.'
  },
  'Turn Greater Undead': {
    namePt: 'Expulsar Grandes Mortos-Vivos',
    tier: 'Adepto',
    descriptionPt: 'Afugenta mortos-vivos poderosos até o nível 15 em uma ampla área durante 30 segundos.'
  },
  'Bane of the Undead': {
    namePt: 'Ruína dos Mortos-Vivos',
    tier: 'Mestre',
    descriptionPt: 'Emite uma onda sacra que incinera mortos-vivos até o nível 30 e os força a debandada total.'
  },
  'Sunbeam': {
    namePt: 'Raio Solar',
    tier: 'Novato',
    descriptionPt: 'Dispara um feixe concentrado de luz celestial que causa 8 de dano por segundo a mortos-vivos.'
  },
  'Sun Fire': {
    namePt: 'Fogo Solar',
    tier: 'Aprendiz',
    descriptionPt: 'Dispara uma labareda consagrada que causa 25 de dano de luz pura a mortos-vivos.'
  },
  "Vampire's Bane": {
    namePt: 'Ruína dos Vampiros',
    tier: 'Adepto',
    descriptionPt: 'Detona uma rajada de radiação solar causando 40 de dano em área a vampiros e mortos-vivos.'
  },
  'Vampire’s Bane': {
    namePt: 'Ruína dos Vampiros',
    tier: 'Adepto',
    descriptionPt: 'Detona uma rajada de radiação solar causando 40 de dano em área a vampiros e mortos-vivos.'
  },
  "Stendarr's Aura": {
    namePt: 'Aura de Stendarr',
    tier: 'Adepto',
    descriptionPt: 'Envolve o paladino em uma emanação luminosa que queima mortos-vivos próximos em 8 de dano por segundo por 60 segundos.'
  },
  'Stendarr’s Aura': {
    namePt: 'Aura de Stendarr',
    tier: 'Adepto',
    descriptionPt: 'Envolve o paladino em uma emanação luminosa que queima mortos-vivos próximos em 8 de dano por segundo por 60 segundos.'
  },
  'Sun Shard': {
    namePt: 'Fragmento Solar',
    tier: 'Mestre',
    descriptionPt: 'Manifesta uma réplica miniatura de um sol ardente por 30 segundos que queima mortos-vivos ao redor.'
  },
  'Circle of Protection': {
    namePt: 'Círculo de Proteção',
    tier: 'Adepto',
    descriptionPt: 'Cria um santuário sagrado no chão por 60 segundos que impede a entrada de mortos-vivos até nível 20.'
  },
  'Circle of Vitality': {
    namePt: 'Círculo de Vitalidade',
    tier: 'Adepto',
    descriptionPt: 'Cria uma zona consagrada no solo que regenera 10 pontos de Vida por segundo de todos os aliados dentro dela.'
  },
  'Circle of Life': {
    namePt: 'Círculo da Vida',
    tier: 'Adepto',
    descriptionPt: 'Desenha um anel divino no solo por 120 segundos que cura 10 de Vida por segundo de quem estiver no perímetro.'
  },
  'Circle of Strength': {
    namePt: 'Círculo da Força',
    tier: 'Adepto',
    descriptionPt: 'Cria uma zona sagrada no solo que fortalece o Vigor e o dano físico de todos os aliados por 120 segundos.'
  },
  'Circle of Wisdom': {
    namePt: 'Círculo da Sabedoria',
    tier: 'Adepto',
    descriptionPt: 'Cria uma zona rúnica que acelera a regeneração de Mágicka dos aliados dentro dela em 50% por 120 segundos.'
  },
  'Guardian Circle': {
    namePt: 'Círculo Guardião',
    tier: 'Mestre',
    descriptionPt: 'Ergue um grande perímetro sagrado que cura 20 de Vida por segundo nos aliados e repele mortos-vivos até nível 35.'
  },
  'Font of Vitality': {
    namePt: 'Fonte de Vitalidade',
    tier: 'Adepto',
    descriptionPt: 'Cria uma fonte luminosa no solo por 120 segundos que concede regeneração constante aos companheiros.'
  },
  'Font of Life': {
    namePt: 'Fonte da Vida',
    tier: 'Adepto',
    descriptionPt: 'Cria uma fonte sagrada por 120 segundos que cura ferimentos de todos os aliados em combate.'
  },
  'Font of Strength': {
    namePt: 'Fonte da Força',
    tier: 'Adepto',
    descriptionPt: 'Cria uma fonte abençoada no chão que amplia a força física e a resistência dos guerreiros aliados.'
  },
  'Mutagen': {
    namePt: 'Mutagênico Restaurador',
    tier: 'Adepto',
    descriptionPt: 'Acelera o metabolismo celular restaurando 4 pontos de Vida por segundo durante 120 segundos.'
  },
  'Dispel': {
    namePt: 'Dissipar Magia',
    tier: 'Adepto',
    descriptionPt: 'Purifica o corpo do conjurador removendo imediatamente todas as penalidades e efeitos mágicos hostis.'
  },

  // Conjuração
  'Bound Dagger': {
    namePt: 'Adaga Vinculada',
    tier: 'Novato',
    descriptionPt: 'Conjura uma lâmina espectral daédrica por 120 segundos, ideal para ataques furtivos silenciosos.'
  },
  'Bound Sword': {
    namePt: 'Espada Vinculada',
    tier: 'Novato',
    descriptionPt: 'Materializa uma espada de uma mão mágica do Oblivion por 120 segundos que aprisiona almas.'
  },
  'Bound Battleaxe': {
    namePt: 'Machado Vinculado',
    tier: 'Aprendiz',
    descriptionPt: 'Materializa um colossal machado de batalha de duas mãos do Oblivion por 120 segundos.'
  },
  'Bound Bow': {
    namePt: 'Arco Vinculado',
    tier: 'Adepto',
    descriptionPt: 'Conjura um arco mágico e 100 flechas daédricas espectrais de alta penetração durante 120 segundos.'
  },
  'Bound Shield': {
    namePt: 'Escudo Vinculado',
    tier: 'Aprendiz',
    descriptionPt: 'Materializa um escudo espectral de pura energia do Oblivion durante 120 segundos.'
  },
  'Soul Trap': {
    namePt: 'Aprisionar Alma',
    tier: 'Aprendiz',
    descriptionPt: 'Se o alvo morrer dentro de 60 segundos, sua alma é capturada e enche uma gema da alma no inventário.'
  },
  'Conjure Familiar': {
    namePt: 'Invocar Familiar',
    tier: 'Novato',
    descriptionPt: 'Invoca um lobo espectral por 60 segundos para auxiliar em combate e atrair a atenção dos inimigos.'
  },
  'Conjure Spectral Wolf': {
    namePt: 'Invocar Lobo Espectral',
    tier: 'Novato',
    descriptionPt: 'Invoca um lobo fantasmagórico veloz por 60 segundos para perseguir e morder alvos distantes.'
  },
  'Conjure Spectral Dire Wolf': {
    namePt: 'Invocar Lobo Atroz Espectral',
    tier: 'Aprendiz',
    descriptionPt: 'Invoca um lobo atroz espectral de grande porte por 60 segundos com mordidas dilacerantes.'
  },
  'Conjure Spectral Sabre Cat': {
    namePt: 'Invocar Tigre-dentes-de-sabre Espectral',
    tier: 'Adepto',
    descriptionPt: 'Invoca um predador felino espectral voraz e ágil por 60 segundos que derruba oponentes.'
  },
  'Conjure Spectral Bear': {
    namePt: 'Invocar Urso Espectral',
    tier: 'Adepto',
    descriptionPt: 'Invoca um urso espectral maciço por 60 segundos que golpeia com patadas atordoantes e alta vida.'
  },
  'Conjure Spectral Manbeast': {
    namePt: 'Invocar Fera Espectral',
    tier: 'Especialista',
    descriptionPt: 'Invoca uma abominação homem-fera espectral colossal com fúria implacável por 60 segundos.'
  },
  'Conjure Flame Atronach': {
    namePt: 'Invocar Atronach da Chama',
    tier: 'Aprendiz',
    descriptionPt: 'Invoca um ser elemental de fogo por 60 segundos que ataca com dardos flamejantes à distância.'
  },
  'Conjure Frost Atronach': {
    namePt: 'Invocar Atronach do Gelo',
    tier: 'Adepto',
    descriptionPt: 'Invoca um golém brutal de gelo resistente por 60 segundos para esmagar a linha de frente.'
  },
  'Conjure Storm Atronach': {
    namePt: 'Invocar Atronach da Tempestade',
    tier: 'Especialista',
    descriptionPt: 'Invoca um colosso elétrico flutuante por 60 segundos que bombardeia com relâmpagos em área.'
  },
  'Conjure Flame Monarch': {
    namePt: 'Invocar Monarca da Chama',
    tier: 'Mestre',
    descriptionPt: 'Invoca um monarca superior elemental de fogo por 60 segundos com poder de detonação duplicado.'
  },
  'Conjure Frost Monarch': {
    namePt: 'Invocar Monarca do Gelo',
    tier: 'Mestre',
    descriptionPt: 'Invoca um monarca superior de gelo por 60 segundos com armadura impenetrável e pisada congelante.'
  },
  'Conjure Storm Monarch': {
    namePt: 'Invocar Monarca da Tempestade',
    tier: 'Mestre',
    descriptionPt: 'Invoca um monarca superior de tempestade por 60 segundos que desintegra pelotões com raios.'
  },
  'Conjure Dremora Lord': {
    namePt: 'Invocar Lorde Dremora',
    tier: 'Especialista',
    descriptionPt: 'Invoca um lorde guerreiro daédrico armado com grande espada de fogo que corta tudo em seu caminho por 60 segundos.'
  },
  'Unbound Atronach': {
    namePt: 'Atronach Indomável',
    tier: 'Especialista',
    descriptionPt: 'Invoca um atronach primal aleatório e descontrolado por 30 segundos com poder de destruição avassalador.'
  },
  'Daedric Cure': {
    namePt: 'Cura Daédrica',
    tier: 'Adepto',
    descriptionPt: 'Restaura 20 pontos de Vida por segundo de todas as criaturas invocadas e zumbis reanimados próximos.'
  },
  'Raise Zombie': {
    namePt: 'Erguer Zumbi',
    tier: 'Novato',
    descriptionPt: 'Reanima um cadáver humanoide fraco para lutar sob suas ordens durante 60 segundos.'
  },
  'Reanimate Corpse': {
    namePt: 'Reanimar Cadáver',
    tier: 'Aprendiz',
    descriptionPt: 'Reanima um cadáver de poder moderado para guerrear lealmente ao seu lado por 60 segundos.'
  },
  'Revenant': {
    namePt: 'Aparição Vingadora',
    tier: 'Adepto',
    descriptionPt: 'Reanima um cadáver forte e experiente para combater seus inimigos por 60 segundos.'
  },
  'Dread Zombie': {
    namePt: 'Zumbi Pavoroso',
    tier: 'Especialista',
    descriptionPt: 'Reanima um guerreiro de elite muito poderoso que luta furiosamente por você durante 60 segundos.'
  },
  'Dead Thrall': {
    namePt: 'Servo Cadavérico Permanente',
    tier: 'Mestre',
    descriptionPt: 'Reanima um cadáver permanentemente como seu servo leal até que seja morto em combate.'
  },
  'Banish Daedra': {
    namePt: 'Banir Daedra',
    tier: 'Adepto',
    descriptionPt: 'Envia criaturas invocadas de Oblivion até o nível 15 de volta para o vazio abissal.'
  },
  'Command Daedra': {
    namePt: 'Comandar Daedra',
    tier: 'Especialista',
    descriptionPt: 'Toma o controle de seres daédricos invocados por conjuradores inimigos até o nível 20.'
  },
  'Expel Daedra': {
    namePt: 'Expulsar Daedra Maior',
    tier: 'Mestre',
    descriptionPt: 'Bane daedras poderosos até o nível 40 de volta para o Oblivion imediatamente.'
  },

  // Ilusão
  'Clairvoyance': {
    namePt: 'Clarividência',
    tier: 'Novato',
    descriptionPt: 'Projeta um trilho luminoso mágico guiando o conjurador até seu objetivo de missão atual.'
  },
  'Courage': {
    namePt: 'Coragem',
    tier: 'Novato',
    descriptionPt: 'Impede que o alvo fuja de pavor por 60 segundos e concede bônus de +20 de Vida e Vigor.'
  },
  'Calm': {
    namePt: 'Acalmar',
    tier: 'Aprendiz',
    descriptionPt: 'Pacificação mental que faz alvos até nível 9 cessarem o combate por 30 segundos.'
  },
  'Pacify': {
    namePt: 'Pacificar',
    tier: 'Especialista',
    descriptionPt: 'Pacificação avançada que impede criaturas e humanoides até nível 20 de lutarem durante 60 segundos.'
  },
  'Fury': {
    namePt: 'Fúria Cega',
    tier: 'Novato',
    descriptionPt: 'Leva alvos até nível 6 à loucura sangrenta, forçando-os a atacar qualquer um por perto durante 30 segundos.'
  },
  'Frenzy': {
    namePt: 'Frenesi Caótico',
    tier: 'Adepto',
    descriptionPt: 'Provoca insanidade em alvos até nível 14, fazendo-os atacar aliados e inimigos indiscriminadamente por 60 segundos.'
  },
  'Mayhem': {
    namePt: 'Caos Generalizado',
    tier: 'Mestre',
    descriptionPt: 'Onda psíquica em área monumental que enlouquece seres vivos até nível 25 fazendo-os despedaçar uns aos outros.'
  },
  'Fear': {
    namePt: 'Pavor',
    tier: 'Aprendiz',
    descriptionPt: 'Infiltra terror absoluto na mente do adversário até nível 9, fazendo-o fugir em pânico por 30 segundos.'
  },
  'Rout': {
    namePt: 'Debandada',
    tier: 'Especialista',
    descriptionPt: 'Terror psíquico ampliado que faz alvos até nível 20 fugirem desesperados por 30 segundos.'
  },
  'Muffle': {
    namePt: 'Passos Suaves',
    tier: 'Aprendiz',
    descriptionPt: 'Abafa todo o ruído de passos e armaduras do conjurador por 180 segundos garantindo silêncio absoluto.'
  },
  'Invisibility': {
    namePt: 'Invisibilidade',
    tier: 'Especialista',
    descriptionPt: 'Torna o usuário completamente invisível por até 240 segundos ou até desferir um ataque ou interagir.'
  },
  'Fade': {
    namePt: 'Desvanecer',
    tier: 'Especialista',
    descriptionPt: 'Faz com que o alvo desapareça visual e sonoramente por 30 segundos, não podendo ser visto ou ouvido.'
  },

  // Magias Especiais e de Classes Únicas
  'Vampiric Bolt': {
    namePt: 'Dardo Vampírico',
    tier: 'Especialista',
    descriptionPt: 'Dispara um raio de sangue sombrio que drena 40 pontos de Vida do alvo vivo, curando o conjurador.'
  },
  "Scion's Embrace": {
    namePt: 'Abraço do Progenitor',
    tier: 'Mestre',
    descriptionPt: 'Por 60 segundos, suga continuamente 10 pontos de Vida por segundo de todos os inimigos vivos em combate corpo a corpo.'
  },
  'Scion’s Embrace': {
    namePt: 'Abraço do Progenitor',
    tier: 'Mestre',
    descriptionPt: 'Por 60 segundos, suga continuamente 10 pontos de Vida por segundo de todos os inimigos vivos em combate corpo a corpo.'
  },
  'Equilibrium': {
    namePt: 'Equilíbrio Vital',
    tier: 'Adepto',
    descriptionPt: 'Sacrifica 25 pontos de Vida por segundo do próprio conjurador para converter diretamente em Mágicka.'
  },
  'Create Water Totem': {
    namePt: 'Totem das Águas',
    tier: 'Aprendiz',
    descriptionPt: 'Ergue um totem xamânico por 60 segundos que restaura 5 pontos de Vida por segundo dos aliados no entorno.'
  },
  'Trickster': {
    namePt: 'Trapaceiro Ilusório',
    tier: 'Mestre',
    descriptionPt: 'Cria 2 cópias espectrais ilusórias perfeitas de si mesmo durante 60 segundos para confundir e distrair adversários.'
  },
  'Shadow Dance': {
    namePt: 'Dança das Sombras',
    tier: 'Adepto',
    descriptionPt: 'Permite desferir um avanço relâmpago de 20 pés de distância consumindo 10 de Mágicka ao saltar.'
  },
  'Magic Barrier': {
    namePt: 'Cúpula de Barreira Mágica',
    tier: 'Adepto',
    descriptionPt: 'Ergue uma redoma de energia impenetrável ao redor do conjurador por 15 segundos bloqueando projéteis e ataques.'
  },
  'Nightblade': {
    namePt: 'Lâmina Noturna',
    tier: 'Adepto',
    descriptionPt: 'Permite teleportar para um inimigo a até 50 pés de distância e desferir um ataque corpo a corpo surpresa devastador.'
  },
  'Shadow Clone': {
    namePt: 'Clone das Sombras',
    tier: 'Especialista',
    descriptionPt: 'Manifesta uma duplicata sombria combatente que distrai e ataca os oponentes por 45 segundos.'
  },
  'Whirlwind Cloak': {
    namePt: 'Manto do Turbilhão',
    tier: 'Adepto',
    descriptionPt: 'Por 60 segundos, ventos com força de furacão circundam o usuário e arremessam inimigos corpo a corpo pelos ares.'
  },
  'Aura of Thorns': {
    namePt: 'Aura de Espinhos',
    tier: 'Adepto',
    descriptionPt: 'O conjurador e aliados refletem 50 pontos de dano cortante aos atacantes corpo a corpo por 60 segundos.'
  },
  'Switcheroo': {
    namePt: 'Troca Espacial',
    tier: 'Adepto',
    descriptionPt: 'Troca instantaneamente de posição espacial com o alvo mirado, desorientando as linhas inimigas.'
  },
  'Teleportation': {
    namePt: 'Teletransporte',
    tier: 'Especialista',
    descriptionPt: 'Dobra o espaço e teletransporta o conjurador instantaneamente para a posição apontada.'
  },
  'Bestow Gift': {
    namePt: 'Conceder Bênção',
    tier: 'Adepto',
    descriptionPt: 'Permite transferir o efeito de um feitiço de auto-alvo diretamente para um companheiro de equipe.'
  },
  'Disintegrate Weapon': {
    namePt: 'Desintegrar Arma',
    tier: 'Adepto',
    descriptionPt: 'Enfraquece a estrutura das armas do inimigo, reduzindo seu dano de ataque físico em 25% por 60 segundos.'
  },
  'Corrode Armor': {
    namePt: 'Corroer Armadura',
    tier: 'Adepto',
    descriptionPt: 'Aplica ácido mágico sobre o inimigo, reduzindo seu índice de armadura em 150 pontos por 60 segundos.'
  },
  'Armoreater': {
    namePt: 'Devorador de Armaduras',
    tier: 'Especialista',
    descriptionPt: 'Corrói equipamentos de todos os inimigos em uma ampla área, reduzindo o índice de armadura em 300 pontos por 60 segundos.'
  },
  'Weakness to Fire': {
    namePt: 'Vulnerabilidade ao Fogo',
    tier: 'Adepto',
    descriptionPt: 'Reduz a resistência a dano de Fogo do inimigo em 50% durante 60 segundos.'
  },
  'Weakness to Frost': {
    namePt: 'Vulnerabilidade ao Gelo',
    tier: 'Adepto',
    descriptionPt: 'Reduz a resistência a dano de Gelo do inimigo em 50% durante 60 segundos.'
  },
  'Weakness to Shock': {
    namePt: 'Vulnerabilidade ao Choque',
    tier: 'Adepto',
    descriptionPt: 'Reduz a resistência a dano de Choque do inimigo em 50% durante 60 segundos.'
  },
  'Weakness to Poison': {
    namePt: 'Vulnerabilidade ao Veneno',
    tier: 'Adepto',
    descriptionPt: 'Reduz a resistência a venenos do inimigo em 50% durante 60 segundos.'
  }
};

// Carrega o arquivo existente para garantir que nenhuma chave seja perdida
const currentPath = path.resolve(__dirname, '../config/spells-descriptions.json');
const current = fs.existsSync(currentPath) ? JSON.parse(fs.readFileSync(currentPath, 'utf-8')) : {};

const finalResult = {};

// 1. Processa todas as chaves mapeadas
for (const [key, val] of Object.entries(spellsData)) {
  finalResult[key] = {
    name: key,
    namePt: val.namePt,
    tier: val.tier,
    descriptionPt: val.descriptionPt
  };
}

// 2. Verifica se havia alguma chave no arquivo antigo que faltou
for (const [key, oldVal] of Object.entries(current)) {
  if (!finalResult[key]) {
    finalResult[key] = {
      name: key,
      namePt: oldVal.namePt || key,
      tier: oldVal.tier || 'Novato',
      descriptionPt: oldVal.descriptionPt || 'Feitiço arcano autorizado da classe.'
    };
  }
}

fs.writeFileSync(currentPath, JSON.stringify(finalResult, null, 2), 'utf-8');
console.log('Salvo config/spells-descriptions.json com', Object.keys(finalResult).length, 'feitiços.');

// Validação final de feitiços sem tradução
let missingCount = 0;
for (const [k, v] of Object.entries(finalResult)) {
  if (v.namePt === v.name && !['Blizzard'].includes(v.name)) {
    console.warn('[AVISO] Possível nome não traduzido:', k, '->', v.namePt);
    missingCount++;
  }
  if (v.descriptionPt.includes('Deals') || v.descriptionPt.includes('Summons') || v.descriptionPt.includes('Feitiço arcano autorizado')) {
    console.warn('[AVISO] Descrição não traduzida:', k, '->', v.descriptionPt);
    missingCount++;
  }
}
console.log('Total de itens pendentes após tradução completa:', missingCount);
