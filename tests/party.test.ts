import { PartySystem } from '../server/partySystem';
import { RaidSystem } from '../server/raidSystem';
import { PlayerRepository } from '../server/storage/playerRepository';

describe('Sistema de Grupos (Party) e Raids', () => {
  let partySystem: PartySystem;
  let raidSystem: RaidSystem;
  let playerRepo: PlayerRepository;

  beforeEach(() => {
    partySystem = PartySystem.getInstance();
    partySystem.clearAll();
    raidSystem = RaidSystem.getInstance();
    playerRepo = PlayerRepository.getInstance();
    playerRepo.clearMemory();
  });

  test('Deve criar grupo com líder e respeitar limite de 8 membros na Party normal', () => {
    const party = partySystem.createParty(1001);
    expect(party.partyId).toBeDefined();
    expect(party.leaderId).toBe(1001);
    expect(party.isRaid).toBe(false);
    expect(party.maxMembers).toBe(8);
    expect(party.members.length).toBe(1);
    expect(party.members[0].isLeader).toBe(true);
  });

  test('Deve permitir convidar e aceitar novos membros no grupo', () => {
    partySystem.createParty(1001);

    const inviteResult = partySystem.invitePlayer(1001, 1002);
    expect(inviteResult.success).toBe(true);
    expect(inviteResult.inviteId).toBeDefined();

    const acceptResult = partySystem.acceptInvite(inviteResult.inviteId!, 1002);
    expect(acceptResult.success).toBe(true);

    const party = partySystem.getPartyByPlayerId(1001);
    expect(party?.members.length).toBe(2);
    expect(party?.members[1].id).toBe(1002);
    expect(party?.members[1].isLeader).toBe(false);
  });

  test('Deve impedir que membros normais convidem outros jogadores (apenas líder)', () => {
    partySystem.createParty(1001);
    const inv = partySystem.invitePlayer(1001, 1002);
    partySystem.acceptInvite(inv.inviteId!, 1002);

    // Membro 1002 tenta convidar 1003
    const unauthorizedInvite = partySystem.invitePlayer(1002, 1003);
    expect(unauthorizedInvite.success).toBe(false);
    expect(unauthorizedInvite.message).toContain('Apenas o líder');
  });

  test('Deve permitir converter Party de 8 membros para RAID PARTY com limite de 20', () => {
    partySystem.createParty(1001);
    for (let playerId = 1002; playerId <= 1008; playerId++) {
      const invite = partySystem.invitePlayer(1001, playerId);
      partySystem.acceptInvite(invite.inviteId!, playerId);
    }
    const raidRes = raidSystem.convertToRaid(1001);

    expect(raidRes.success).toBe(true);
    const party = partySystem.getPartyByPlayerId(1001);
    expect(party?.isRaid).toBe(true);
    expect(party?.maxMembers).toBe(20);
  });

  test('Deve organizar membros da Raid em subgrupos de 1 a 4 com limite de 5 membros cada', () => {
    partySystem.createParty(1001);
    for (let playerId = 1002; playerId <= 1008; playerId++) {
      const invite = partySystem.invitePlayer(1001, playerId);
      partySystem.acceptInvite(invite.inviteId!, playerId);
    }
    raidSystem.convertToRaid(1001);

    const assignRes = raidSystem.assignSubgroup(1001, 1002, 2);
    expect(assignRes.success).toBe(true);

    const party = partySystem.getPartyByPlayerId(1001);
    const m2 = party?.members.find(m => m.id === 1002);
    expect(m2?.subgroupId).toBe(2);
  });

  test('Deve impedir conversão para Raid antes de a Party atingir 8 membros', () => {
    partySystem.createParty(1001);
    const result = raidSystem.convertToRaid(1001);
    expect(result.success).toBe(false);
    expect(result.message).toContain('8 membros');
  });

  test('Deve revalidar se o convidado entrou em outro grupo antes de aceitar', () => {
    partySystem.createParty(1001);
    const invite = partySystem.invitePlayer(1001, 1002);
    partySystem.createParty(1002);

    const result = partySystem.acceptInvite(invite.inviteId!, 1002);
    expect(result.success).toBe(false);
    expect(partySystem.getPartyByPlayerId(1002)?.leaderId).toBe(1002);
  });

  test('Deve impedir que terceiros recusem convites e que o líder expulse não membros', () => {
    partySystem.createParty(1001);
    const invite = partySystem.invitePlayer(1001, 1002);

    expect(partySystem.declineInvite(invite.inviteId!, 1003).success).toBe(false);
    expect(partySystem.acceptInvite(invite.inviteId!, 1002).success).toBe(true);
    expect(partySystem.kickMember(1001, 9999).success).toBe(false);
  });

  test('Deve filtrar apenas membros próximos (raio <= 5000 e mesma célula) para divisão de XP', () => {
    const party = partySystem.createParty(1001);
    const inv2 = partySystem.invitePlayer(1001, 1002);
    partySystem.acceptInvite(inv2.inviteId!, 1002);
    const inv3 = partySystem.invitePlayer(1001, 1003);
    partySystem.acceptInvite(inv3.inviteId!, 1003);

    // Jogador 1001 e 1002 estão perto em Whiterun
    partySystem.updateMemberStats(1001, { pos: [0, 0, 0], cellOrWorldDesc: 'WhiterunWorld' });
    partySystem.updateMemberStats(1002, { pos: [1000, 1000, 0], cellOrWorldDesc: 'WhiterunWorld' }); // ~1414 dist

    // Jogador 1003 está longe ou em outra célula (Riften)
    partySystem.updateMemberStats(1003, { pos: [20000, 20000, 0], cellOrWorldDesc: 'RiftenWorld' });

    const proximate = partySystem.getProximateMembers(party.partyId, [0, 0, 0], 'WhiterunWorld', 5000);
    expect(proximate.length).toBe(2);
    expect(proximate.map(m => m.id)).toEqual([1001, 1002]);
  });
});
