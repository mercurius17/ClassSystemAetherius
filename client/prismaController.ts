import { printConsole, Input, Ui } from 'skyrimPlatform';
import { PlayerClassState, PartyState } from '../shared/types';
import { ClientPerkApplier } from './clientPerkApplier';
import { PartyHud } from './partyHud';

declare const mp: any;
declare const PrismaUIBridge: any;

export class PrismaController {
  private static instance: PrismaController;
  private isOpen: boolean = false;
  private currentMode: 'selection' | 'panel' = 'selection';
  private viewHandle: any = null;
  private playerState: PlayerClassState | null = null;
  private partyState: PartyState | null = null;
  private perkApplier: ClientPerkApplier;
  private partyHud: PartyHud;

  constructor() {
    this.perkApplier = ClientPerkApplier.getInstance();
    this.partyHud = PartyHud.getInstance();
  }

  public static getInstance(): PrismaController {
    if (!PrismaController.instance) {
      PrismaController.instance = new PrismaController();
    }
    return PrismaController.instance;
  }

  /**
   * Inicializa o controlador de interface Prisma UI.
   */
  public initialize(): void {
    printConsole('[PrismaController] Inicializando controlador Prisma UI...');

    // Cria a view Prisma apontando para a interface unificada (SPA) ou painel
    if (typeof PrismaUIBridge !== 'undefined' && PrismaUIBridge.createView) {
      try {
        this.viewHandle = PrismaUIBridge.createView('AetheriusClasses/index.html', () => {
          printConsole('[PrismaController] DOM da interface Prisma pronto.');
          this.registerBridgeListeners();
        });
      } catch (err) {
        printConsole(`[PrismaController] Falha ao criar view Prisma: ${err}`);
      }
    }

    // Registra manipuladores de pacotes remotos do SkyMP
    this.registerSkyMPListeners();
  }

  /**
   * Alterna a visibilidade da interface ao pressionar a tecla configurada (padrão: K).
   */
  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Abre a interface apropriada para o jogador.
   * Se não escolheu classe -> Abre Seleção de Classes.
   * Se já possui classe -> Abre Painel da Classe.
   */
  public open(mode?: 'selection' | 'panel'): void {
    if (this.isOpen) return;

    // Determina o modo adequado com base no estado do jogador
    if (mode) {
      this.currentMode = mode;
    } else if (this.playerState && this.playerState.classId) {
      this.currentMode = 'panel';
    } else {
      this.currentMode = 'selection';
    }

    this.isOpen = true;
    printConsole(`[PrismaController] Abrindo interface no modo: ${this.currentMode}`);

    // Foca a view no Prisma UI (libera cursor do mouse e gerencia foco)
    if (this.viewHandle && typeof PrismaUIBridge !== 'undefined') {
      PrismaUIBridge.show(this.viewHandle);
      PrismaUIBridge.focus(this.viewHandle, false);
    }

    // Solicita dados atualizados ao servidor SkyMP
    this.requestServerSync();

    // Notifica o frontend sobre a rota ativa
    this.sendToUI('navigate', { view: this.currentMode });
  }

  /**
   * Fecha a interface e devolve o controle ao Skyrim.
   */
  public close(): void {
    if (!this.isOpen) return;

    this.isOpen = false;
    printConsole('[PrismaController] Fechando interface...');

    if (this.viewHandle && typeof PrismaUIBridge !== 'undefined') {
      PrismaUIBridge.unfocus(this.viewHandle);
      PrismaUIBridge.hide(this.viewHandle);
    }

    this.sendToUI('uiClosed', {});
  }

  public isUIOpen(): boolean {
    return this.isOpen;
  }

  /**
   * Envia dados ou comandos para a interface web via JavaScript.
   */
  public sendToUI(type: string, data: any): void {
    const packet = JSON.stringify({ type, data });
    
    // Método 1: Prisma UI SKSE Interop
    if (this.viewHandle && typeof PrismaUIBridge !== 'undefined') {
      try {
        PrismaUIBridge.invoke(this.viewHandle, `window.receivePrismaPacket(${JSON.stringify(packet)});`);
        return;
      } catch (err) {
        printConsole(`[PrismaController] Erro no PrismaUIBridge.invoke: ${err}`);
      }
    }

    // Método 2: Injeção global no ambiente JS se compartilhado
    if (typeof (globalThis as any).receivePrismaPacket === 'function') {
      (globalThis as any).receivePrismaPacket(packet);
    }
  }

  /**
   * Manipulador de ações emitidas pela interface web.
   */
  public handleUIAction(packet: { type: string; payload: any }): void {
    printConsole(`[PrismaController] Ação recebida da UI: ${packet.type}`);

    switch (packet.type) {
      case 'closeUI':
        this.close();
        break;

      case 'selectClass':
      case 'allocateAttributes':
      case 'resetClass':
      case 'createParty':
      case 'inviteParty':
      case 'acceptPartyInvite':
      case 'declinePartyInvite':
      case 'leaveParty':
      case 'kickPartyMember':
      case 'promotePartyLeader':
      case 'convertToRaid':
      case 'assignRaidSubgroup':
      case 'requestInitialData':
        // Encaminha a requisição ao servidor SkyMP
        if (typeof mp !== 'undefined' && mp.events && mp.events.callRemote) {
          mp.events.callRemote('clientPacket', packet.type, packet.payload);
        }
        break;

      default:
        printConsole(`[PrismaController] Tipo de ação desconhecido: ${packet.type}`);
    }
  }

  /**
   * Atualiza o estado local do jogador e sincroniza perks e UI.
   */
  public updatePlayerState(state: PlayerClassState): void {
    this.playerState = state;

    // 1. Aplica ou sincroniza as perks no ator do Skyrim
    const perkSyncReport = this.perkApplier.syncPerks(state);
    if (perkSyncReport.applied.length > 0) {
      printConsole(`[PrismaController] Perks aplicadas no Skyrim: ${perkSyncReport.applied.join(', ')}`);
    }

    // 2. Aplica ou sincroniza as habilidades e atributos no ator do Skyrim
    this.perkApplier.syncSkills(state);
    this.perkApplier.syncAttributes(state);

    // 3. Se a interface estiver aberta, atualiza a exibição
    this.sendToUI('syncPlayerState', {
      player: state,
      party: this.partyState
    });

    // Se o jogador resetou a classe enquanto no painel, transita para a tela de seleção
    if (!state.classId && this.isOpen && this.currentMode === 'panel') {
      this.currentMode = 'selection';
      this.sendToUI('navigate', { view: 'selection' });
    }
  }

  /**
   * Atualiza o estado de grupo/raid e notifica o HUD e a UI.
   */
  public updatePartyState(party: PartyState | null): void {
    this.partyState = party;
    this.partyHud.updatePartyState(party);

    if (this.isOpen) {
      this.sendToUI('syncPartyState', party);
    }
  }

  private requestServerSync(): void {
    if (typeof mp !== 'undefined' && mp.events && mp.events.callRemote) {
      mp.events.callRemote('clientPacket', 'requestInitialData', {});
    }
  }

  private registerBridgeListeners(): void {
    if (this.viewHandle && typeof PrismaUIBridge !== 'undefined' && PrismaUIBridge.registerListener) {
      PrismaUIBridge.registerListener(this.viewHandle, 'onClassAction', (dataStr: string) => {
        try {
          const packet = JSON.parse(dataStr);
          this.handleUIAction(packet);
        } catch (e) {
          printConsole(`[PrismaController] Erro ao analisar pacote JSON da UI: ${e}`);
        }
      });
    }
  }

  private registerSkyMPListeners(): void {
    if (typeof mp === 'undefined' || !mp.events) return;

    // Resposta de seleção de classe
    mp.events.add('classSelectedResponse', (res: any) => {
      this.sendToUI('classSelectedResponse', res);
      if (res.success && res.state) {
        this.updatePlayerState(res.state);
        this.currentMode = 'panel';
        this.sendToUI('navigate', { view: 'panel' });
      }
    });

    // Resposta de alocação de atributos
    mp.events.add('attributesAllocatedResponse', (res: any) => {
      this.sendToUI('attributesAllocatedResponse', res);
      if (res.success && res.state) {
        this.updatePlayerState(res.state);
      }
    });

    // Resposta de reset de classe
    mp.events.add('resetClassResponse', (res: any) => {
      this.sendToUI('resetClassResponse', res);
      if (res.success && res.state) {
        this.updatePlayerState(res.state);
      }
    });

    // Sincronização geral de estado
    mp.events.add('syncPlayerState', (data: any) => {
      if (data.player) {
        this.updatePlayerState(data.player);
      }
      if (typeof data.party !== 'undefined') {
        this.updatePartyState(data.party);
      }
    });

    // Notificação de ganho de XP em combate
    mp.events.add('combatKillProcessed', (data: any) => {
      if (data.xpAwarded) {
        this.sendToUI('combatKillProcessed', data);
      }
    });
  }
}
