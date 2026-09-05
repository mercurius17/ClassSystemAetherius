import { PartyState, PartyMember } from '../shared/types';
import { PartySystem } from './partySystem';
import { PlayerRepository } from './storage/playerRepository';

export class RaidSystem {
  private static instance: RaidSystem;

  public static getInstance(): RaidSystem {
    if (!RaidSystem.instance) {
      RaidSystem.instance = new RaidSystem();
    }
    return RaidSystem.instance;
  }

  /**
   * Converte uma party normal para modo RAID PARTY (capacidade de até 20 jogadores).
   */
  public convertToRaid(leaderId: number): { success: boolean; party?: PartyState; message: string } {
    const partySystem = PartySystem.getInstance();
    const party = partySystem.getPartyByPlayerId(leaderId);

    if (!party) {
      return { success: false, message: 'Você não está em um grupo.' };
    }

    if (party.leaderId !== leaderId) {
      return { success: false, message: 'Apenas o líder pode converter o grupo em Raid.' };
    }

    if (party.isRaid) {
      return { success: false, message: 'O grupo já é uma Raid Party.' };
    }
    if (party.members.length < 8) {
      return { success: false, message: 'O grupo precisa estar completo com 8 membros antes de virar Raid.' };
    }

    party.isRaid = true;
    party.maxMembers = 20;

    // Atualiza status nos membros
    const playerRepo = PlayerRepository.getInstance();
    for (const m of party.members) {
      const state = playerRepo.getPlayerState(m.id);
      state.isRaid = true;
      playerRepo.savePlayerState(state);
    }

    return {
      success: true,
      party,
      message: 'Grupo convertido para RAID PARTY! Limite expandido para 20 jogadores.'
    };
  }

  /**
   * Atribui um membro a um subgrupo específico da Raid (Subgrupos 1 a 4, com até 5 jogadores cada).
   */
  public assignSubgroup(leaderId: number, targetMemberId: number, targetSubgroupId: number): { success: boolean; message: string } {
    const partySystem = PartySystem.getInstance();
    const party = partySystem.getPartyByPlayerId(leaderId);

    if (!party || !party.isRaid) {
      return { success: false, message: 'Você precisa ser líder de uma Raid Party.' };
    }

    if (party.leaderId !== leaderId) {
      return { success: false, message: 'Apenas o líder da Raid pode reorganizar os esquadrões.' };
    }

    if (targetSubgroupId < 1 || targetSubgroupId > 4) {
      return { success: false, message: 'O subgrupo deve ser entre 1 e 4.' };
    }

    const membersInSubgroup = party.members.filter(m => m.subgroupId === targetSubgroupId);
    if (membersInSubgroup.length >= 5) {
      return { success: false, message: `O Subgrupo ${targetSubgroupId} já possui o limite máximo de 5 jogadores.` };
    }

    const member = party.members.find(m => m.id === targetMemberId);
    if (!member) {
      return { success: false, message: 'Jogador alvo não está na Raid.' };
    }

    member.subgroupId = targetSubgroupId;
    return { success: true, message: `${member.name} foi movido para o Subgrupo ${targetSubgroupId}.` };
  }

  /**
   * Retorna os membros da Raid agrupados por subgrupo (1 a 4).
   */
  public getRaidSubgroups(partyId: string): Record<number, PartyMember[]> {
    const partySystem = PartySystem.getInstance();
    // busca party
    const result: Record<number, PartyMember[]> = { 1: [], 2: [], 3: [], 4: [] };
    const party = partySystem.getPartyById(partyId);
    if (!party) return result;

    for (const m of party.members) {
      const g = m.subgroupId || 1;
      if (!result[g]) result[g] = [];
      result[g].push(m);
    }

    return result;
  }
}
