import { ClassSystem } from './classSystem';
import { LevelingSystem } from './levelingSystem';
import { PartySystem } from './partySystem';
import { RaidSystem } from './raidSystem';
import { PlayerRepository } from './storage/playerRepository';
import { CombatKillEvent, PlayerClassState } from '../shared/types';
import { PerkResolver } from '../shared/perkResolver';

declare const mp: any;

export class SkyMPClassServer {
  private static instance: SkyMPClassServer;
  public classSystem: ClassSystem;
  public levelingSystem: LevelingSystem;
  public partySystem: PartySystem;
  public raidSystem: RaidSystem;
  public playerRepo: PlayerRepository;

  constructor() {
    this.classSystem = ClassSystem.getInstance();
    this.levelingSystem = LevelingSystem.getInstance();
    this.partySystem = PartySystem.getInstance();
    this.raidSystem = RaidSystem.getInstance();
    this.playerRepo = PlayerRepository.getInstance();
  }

  public static getInstance(): SkyMPClassServer {
    if (!SkyMPClassServer.instance) {
      SkyMPClassServer.instance = new SkyMPClassServer();
    }
    return SkyMPClassServer.instance;
  }

  public initialize(): void {
    console.log('[SkyMPClassServer] Inicializando Sistema de Classes, Leveling, Grupos e Raids...');

    // 1. Diagnóstico do PerkResolver
    const perkReport = PerkResolver.getInstance().initializeResolver();
    console.log(`[SkyMPClassServer] PerkResolver inicializado: ${perkReport.resolved}/${perkReport.total} perks registradas.`);

    // 2. Registro de propriedades no SkyMP se presente
    if (typeof mp !== 'undefined' && mp.makeProperty) {
      mp.makeProperty('playerClassData', {
        isVisibleByOwner: true,
        isVisibleByNeighbors: false,
        updateOwner: '',
        updateNeighbor: ''
      });

      mp.makeProperty('partyStateData', {
        isVisibleByOwner: true,
        isVisibleByNeighbors: false,
        updateOwner: '',
        updateNeighbor: ''
      });
    }

    console.log('[SkyMPClassServer] Pronto para processar eventos e conexões.');
  }

  /**
   * Processador de pacotes vindos do cliente (Prisma UI / Skyrim Platform).
   */
  public handleClientPacket(playerId: number, packetType: string, payload: any): any {
    switch (packetType) {
      case 'requestInitialData': {
        const state = this.playerRepo.getPlayerState(playerId);
        const party = this.partySystem.getPartyByPlayerId(playerId);
        return {
          type: 'syncPlayerState',
          data: {
            player: state,
            party: party || null
          }
        };
      }

      case 'selectClass': {
        const res = this.classSystem.selectClass(playerId, payload.classId);
        return {
          type: 'classSelectedResponse',
          data: res
        };
      }

      case 'allocateAttributes': {
        const res = this.classSystem.allocateAttributes(
          playerId,
          payload.health || 0,
          payload.magicka || 0,
          payload.stamina || 0
        );
        return {
          type: 'attributesAllocatedResponse',
          data: res
        };
      }

      case 'resetClass': {
        const res = this.classSystem.resetClass(playerId);
        return {
          type: 'resetClassResponse',
          data: res
        };
      }

      case 'createParty': {
        const party = this.partySystem.createParty(playerId);
        return { type: 'partyCreated', data: party };
      }

      case 'inviteParty': {
        const res = this.partySystem.invitePlayer(playerId, payload.targetId);
        return { type: 'partyInviteSent', data: res };
      }

      case 'acceptPartyInvite': {
        const res = this.partySystem.acceptInvite(payload.inviteId, playerId);
        return { type: 'partyInviteAccepted', data: res };
      }

      case 'declinePartyInvite': {
        this.partySystem.declineInvite(payload.inviteId);
        return { type: 'partyInviteDeclined', data: { success: true } };
      }

      case 'leaveParty': {
        const res = this.partySystem.leaveParty(playerId);
        return { type: 'partyLeft', data: res };
      }

      case 'kickPartyMember': {
        const res = this.partySystem.kickMember(playerId, payload.targetId);
        return { type: 'partyMemberKicked', data: res };
      }

      case 'promotePartyLeader': {
        const res = this.partySystem.promoteLeader(playerId, payload.newLeaderId);
        return { type: 'partyLeaderPromoted', data: res };
      }

      case 'convertToRaid': {
        const res = this.raidSystem.convertToRaid(playerId);
        return { type: 'raidConverted', data: res };
      }

      case 'assignRaidSubgroup': {
        const res = this.raidSystem.assignSubgroup(playerId, payload.targetMemberId, payload.subgroupId);
        return { type: 'raidSubgroupAssigned', data: res };
      }

      case 'reportCombatKill': {
        const event: CombatKillEvent = {
          killerId: playerId,
          victimName: payload.victimName || 'Bandit',
          victimLevel: payload.victimLevel || 1,
          victimBaseXp: payload.victimBaseXp || 0,
          isDragonPriest: !!payload.isDragonPriest,
          isDragon: !!payload.isDragon
        };
        const res = this.levelingSystem.processCombatKill(event, payload.pos, payload.cell);
        return { type: 'combatKillProcessed', data: res };
      }

      default:
        return { type: 'error', message: `Tipo de pacote desconhecido: ${packetType}` };
    }
  }
}

// Inicializa a instância principal
export const serverInstance = SkyMPClassServer.getInstance();
serverInstance.initialize();
