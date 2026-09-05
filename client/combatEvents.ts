import { on, Game, Actor, Debug, printConsole } from 'skyrimPlatform';
import { findBestiaryEntry } from '../shared/bestiaryData';
import { CombatKillEvent } from '../shared/types';

declare const mp: any;

export class CombatEvents {
  private static instance: CombatEvents;
  private onKillCallback: ((event: CombatKillEvent, pos: [number, number, number], cell: string) => void) | null = null;

  constructor() {
    this.registerListeners();
  }

  public static getInstance(): CombatEvents {
    if (!CombatEvents.instance) {
      CombatEvents.instance = new CombatEvents();
    }
    return CombatEvents.instance;
  }

  public setKillHandler(callback: (event: CombatKillEvent, pos: [number, number, number], cell: string) => void): void {
    this.onKillCallback = callback;
  }

  private registerListeners(): void {
    if (typeof on === 'undefined') {
      return;
    }

    try {
      // Monitora evento de morte do Skyrim Platform
      on('death', (victim: Actor, killer: Actor) => {
        try {
          this.handleDeathEvent(victim, killer);
        } catch (err) {
          printConsole(`[CombatEvents] Erro ao processar evento de morte: ${err}`);
        }
      });
    } catch (e) {
      printConsole(`[CombatEvents] Falha ao registrar gancho de morte: ${e}`);
    }
  }

  private handleDeathEvent(victim: Actor, killer: Actor): void {
    if (!victim || typeof Game === 'undefined' || !Game.getPlayer) {
      return;
    }

    const player = Game.getPlayer();
    if (!player) {
      return;
    }

    const playerId = player.getFormId();
    const isPlayerKiller = killer && killer.getFormId() === playerId;

    // Se o assassino não for o jogador direto, verifica se o jogador está em combate próximo
    if (!isPlayerKiller) {
      return;
    }

    const victimBase = victim.getBaseObject ? victim.getBaseObject() : null;
    const victimName = victimBase ? victimBase.getName() : 'Inimigo';
    const victimLevel = victim.getLevel ? victim.getLevel() : 1;

    const bestiary = findBestiaryEntry(victimName);

    // Identificação de Dragão e Dragon Priest
    const nameLower = victimName.toLowerCase();
    const isDragon = !!bestiary.isDragon || nameLower.includes('dragon') || nameLower.includes('dragão');
    const isDragonPriest = !!bestiary.isDragonPriest || 
      nameLower.includes('dragon priest') || 
      nameLower.includes('sacerdote') ||
      this.isKnownDragonPriest(nameLower);

    const pos: [number, number, number] = [
      player.getPositionX ? player.getPositionX() : 0,
      player.getPositionY ? player.getPositionY() : 0,
      player.getPositionZ ? player.getPositionZ() : 0
    ];

    const cellObj = player.getParentCell ? player.getParentCell() : null;
    const cell = cellObj ? (cellObj.getName ? cellObj.getName() : 'Tamriel') : 'Tamriel';

    const event: CombatKillEvent = {
      killerId: playerId,
      victimName,
      victimLevel,
      victimBaseXp: bestiary.baseXp,
      isDragonPriest,
      isDragon
    };

    // 1. Invoca callback local se registrado
    if (this.onKillCallback) {
      this.onKillCallback(event, pos, cell);
    }

    // 2. Transmite ao SkyMP se disponível
    if (typeof mp !== 'undefined' && mp.events && mp.events.callRemote) {
      mp.events.callRemote('reportCombatKill', {
        ...event,
        pos,
        cell
      });
    }

    printConsole(`[CombatEvents] Inimigo abatido: ${victimName} (Nível ${victimLevel}). Base XP: ${bestiary.baseXp}`);
  }

  private isKnownDragonPriest(name: string): boolean {
    const priests = [
      'morokei', 'nahkriin', 'krosis', 'volsung', 'rahgot',
      'hevnoraak', 'otar', 'vokun', 'konahrik', 'zahkriisos',
      'dukaan', 'ahzidal', 'miraak'
    ];
    return priests.some(p => name.includes(p));
  }

  /**
   * Exibe notificação de XP recebida na tela do Skyrim.
   */
  public notifyXpGained(amount: number, reason?: string): void {
    const text = reason ? `+${amount} XP (${reason})` : `+${amount} XP`;
    if (typeof Debug !== 'undefined' && Debug.notification) {
      Debug.notification(text);
    }
  }
}
