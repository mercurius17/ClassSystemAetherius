import { on, once, printConsole, Game, ButtonEvent } from 'skyrimPlatform';
import { PrismaController } from './prismaController';
import { CombatEvents } from './combatEvents';
import { ClientPerkApplier } from './clientPerkApplier';
import { PerkResolver } from '../shared/perkResolver';

export class SkyMPClassClient {
  private static instance: SkyMPClassClient;
  private prismaController: PrismaController;
  private combatEvents: CombatEvents;
  private perkApplier: ClientPerkApplier;

  constructor() {
    this.prismaController = PrismaController.getInstance();
    this.combatEvents = CombatEvents.getInstance();
    this.perkApplier = ClientPerkApplier.getInstance();
  }

  public static getInstance(): SkyMPClassClient {
    if (!SkyMPClassClient.instance) {
      SkyMPClassClient.instance = new SkyMPClassClient();
    }
    return SkyMPClassClient.instance;
  }

  public initialize(): void {
    printConsole('====================================================');
    printConsole('[Aetherius] Sistema de Classes, Leveling & Grupos');
    printConsole('[Aetherius] Inicializando Cliente Skyrim Platform / SkyMP...');
    printConsole('====================================================');

    // 1. Configura gancho de resolução dinâmica do PerkResolver para Skyrim Platform
    PerkResolver.getInstance().setRuntimeLookup({
      getFormFromFile: (localId: number, pluginName: string) => {
        try {
          if (typeof Game !== 'undefined' && Game.getFormFromFile) {
            const form = Game.getFormFromFile(localId, pluginName);
            return form ? form.getFormId() : null;
          }
        } catch {
          // Ignora silenciosamente
        }
        return null;
      }
    });

    // Diagnóstico inicial das perks
    const diag = PerkResolver.getInstance().initializeResolver();
    printConsole(`[Aetherius] PerkResolver: ${diag.resolved}/${diag.total} mapeamentos configurados.`);

    // 2. Inicializa o controlador da Prisma UI
    this.prismaController.initialize();

    // 3. Registra ganchos de teclado
    this.registerKeybinds();

    // 4. Conecta eventos de morte aos feedbacks visuais
    this.combatEvents.setKillHandler((event, pos, cell) => {
      printConsole(`[Aetherius] Morte detectada: ${event.victimName} (+${event.victimBaseXp} XP base)`);
    });

    printConsole('[Aetherius] Pressione [K] para abrir a Seleção / Painel de Classe.');
  }

  private registerKeybinds(): void {
    if (typeof on === 'undefined') {
      return;
    }

    try {
      // Monitora o evento público de botões do Skyrim Platform.
      on('buttonEvent', (event: ButtonEvent) => {
        if (!event) return;

        const isKeyDown = event.isDown && !event.isRepeating;
        const keyCode = event.code;

        if (isKeyDown) {
          // Tecla K: Alterna abrir/fechar interface
          if (keyCode === 0x25 /* DX scan code for K */) {
            this.prismaController.toggle();
          }
          // Tecla ESC: Se a interface estiver aberta, fecha a interface
          else if (keyCode === 0x01 && this.prismaController.isUIOpen()) {
            this.prismaController.close();
          }
        }
      });
    } catch (err) {
      printConsole(`[Aetherius] Aviso ao registrar ganchos de teclado: ${err}`);
    }
  }
}

// Inicialização segura ao carregar o ambiente
once('tick', () => {
  SkyMPClassClient.getInstance().initialize();
});
