import { Game, printConsole } from 'skyrimPlatform';
import { PartyMember, PartyState } from '../shared/types';

export const PARTY_MAX_DISTANCE_UNITS = 5000;

export class PartyHud {
  private static instance: PartyHud;
  private currentParty: PartyState | null = null;

  constructor() {}

  public static getInstance(): PartyHud {
    if (!PartyHud.instance) {
      PartyHud.instance = new PartyHud();
    }
    return PartyHud.instance;
  }

  public updatePartyState(party: PartyState | null): void {
    this.currentParty = party;
    this.refreshHud();
  }

  public getPartyState(): PartyState | null {
    return this.currentParty;
  }

  /**
   * Atualiza a distância e status de proximidade de XP para cada membro do grupo.
   */
  public refreshProximity(): Array<{
    memberId: number;
    name: string;
    distance: number;
    inXpRange: boolean;
  }> {
    if (!this.currentParty || !this.currentParty.members) {
      return [];
    }

    if (typeof Game === 'undefined' || !Game.getPlayer) {
      return [];
    }

    const player = Game.getPlayer();
    if (!player) {
      return [];
    }

    const px = player.getPositionX();
    const py = player.getPositionY();
    const pz = player.getPositionZ();
    const playerCell = player.getParentCell();
    const cellName = playerCell ? playerCell.getName() : 'Tamriel';

    return this.currentParty.members.map(member => {
      let dist = 0;
      let inRange = true;

      if (member.pos) {
        const dx = member.pos[0] - px;
        const dy = member.pos[1] - py;
        const dz = member.pos[2] - pz;
        dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const sameCell = !member.cellOrWorldDesc || member.cellOrWorldDesc === cellName;
        inRange = sameCell && dist <= PARTY_MAX_DISTANCE_UNITS;
      }

      return {
        memberId: member.id,
        name: member.name,
        distance: Math.round(dist),
        inXpRange: inRange
      };
    });
  }

  private refreshHud(): void {
    if (!this.currentParty) {
      return;
    }
    const typeLabel = this.currentParty.isRaid ? 'Raid' : 'Grupo';
    printConsole(`[PartyHud] ${typeLabel} atualizado: ${this.currentParty.members.length} membros.`);
  }
}
