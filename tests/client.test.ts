import { PartyHud } from '../client/partyHud';
import { findBestiaryEntry } from '../shared/bestiaryData';
import { PartyMember, PartyState } from '../shared/types';

// Mock do ambiente skyrimPlatform para execução em Jest
(global as any).Game = {
  getPlayer: () => ({
    getFormId: () => 0x00000014,
    getPositionX: () => 0,
    getPositionY: () => 0,
    getPositionZ: () => 0,
    getParentCell: () => ({
      getName: () => 'Tamriel'
    }),
    addPerk: jest.fn(),
    removePerk: jest.fn()
  }),
  getFormFromFile: jest.fn((localId: number, plugin: string) => {
    return {
      getFormId: () => 0x08000000 | localId,
      getName: () => 'MockPerk'
    };
  })
};

(global as any).printConsole = jest.fn();

describe('Cliente - PartyHud e Proximidade de Combate', () => {
  let partyHud: PartyHud;

  beforeEach(() => {
    partyHud = PartyHud.getInstance();
  });

  test('Deve calcular corretamente membros dentro e fora do raio de 5000 unidades', () => {
    const mockParty: PartyState = {
      partyId: 'party_123',
      leaderId: 0x00000014,
      isRaid: false,
      maxMembers: 8,
      members: [
        {
          id: 0x00000014,
          name: 'Jogador Local',
          classId: 'barbaro',
          className: 'Bárbaro',
          level: 10,
          health: 100,
          maxHealth: 100,
          magicka: 50,
          maxMagicka: 50,
          stamina: 100,
          maxStamina: 100,
          isLeader: true,
          subgroupId: 1,
          pos: [0, 0, 0],
          cellOrWorldDesc: 'Tamriel',
          isOnline: true
        },
        {
          id: 102,
          name: 'Aliado Próximo',
          classId: 'clerigo',
          className: 'Clérigo',
          level: 10,
          health: 90,
          maxHealth: 100,
          magicka: 120,
          maxMagicka: 120,
          stamina: 80,
          maxStamina: 80,
          isLeader: false,
          subgroupId: 1,
          pos: [1000, 1000, 0], // dist ~ 1414 <= 5000
          cellOrWorldDesc: 'Tamriel',
          isOnline: true
        },
        {
          id: 103,
          name: 'Aliado Distante',
          classId: 'arqueiro',
          className: 'Arqueiro',
          level: 10,
          health: 100,
          maxHealth: 100,
          magicka: 50,
          maxMagicka: 50,
          stamina: 100,
          maxStamina: 100,
          isLeader: false,
          subgroupId: 1,
          pos: [6000, 0, 0], // dist 6000 > 5000
          cellOrWorldDesc: 'Tamriel',
          isOnline: true
        },
        {
          id: 104,
          name: 'Aliado em Outra Célula',
          classId: 'mago_puro',
          className: 'Mago Puro',
          level: 10,
          health: 80,
          maxHealth: 80,
          magicka: 200,
          maxMagicka: 200,
          stamina: 50,
          maxStamina: 50,
          isLeader: false,
          subgroupId: 1,
          pos: [100, 100, 0], // perto, mas interior
          cellOrWorldDesc: 'BleakFallsBarrow',
          isOnline: true
        }
      ]
    };

    partyHud.updatePartyState(mockParty);
    const proximity = partyHud.refreshProximity();

    expect(proximity).toHaveLength(4);

    // Aliado Próximo: dentro do range
    const aliadoProx = proximity.find(p => p.memberId === 102);
    expect(aliadoProx).toBeDefined();
    expect(aliadoProx?.inXpRange).toBe(true);
    expect(aliadoProx?.distance).toBe(1414);

    // Aliado Distante: fora do range
    const aliadoDist = proximity.find(p => p.memberId === 103);
    expect(aliadoDist).toBeDefined();
    expect(aliadoDist?.inXpRange).toBe(false);
    expect(aliadoDist?.distance).toBe(6000);

    // Aliado em Outra Célula: fora do range
    const aliadoOutra = proximity.find(p => p.memberId === 104);
    expect(aliadoOutra).toBeDefined();
    expect(aliadoOutra?.inXpRange).toBe(false);
  });
});

describe('Cliente - Bestiário e Resolução de Inimigos', () => {
  test('Identifica corretamente dragões e sacerdotes do dragão', () => {
    const dragon = findBestiaryEntry('Elder Dragon');
    expect(dragon.isDragon).toBe(true);
    expect(dragon.baseXp).toBe(1000);

    const priest = findBestiaryEntry('Dragon Priest Krosis');
    expect(priest.isDragonPriest).toBe(true);
    expect(priest.baseXp).toBe(500);

    const bandit = findBestiaryEntry('Bandit Highwayman');
    expect(bandit.baseXp).toBe(10);
  });
});
