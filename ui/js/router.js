/**
 * Router SPA para alternar entre Seleção de Classes e Painel da Classe
 */

class UIRouter {
  constructor() {
    this.currentView = null;
    this.init();
  }

  init() {
    window.bridge.on('syncPlayerState', (data) => {
      const player = data.player;
      if (player && player.classId) {
        this.navigateTo('panel');
      } else {
        this.navigateTo('selection');
      }
    });

    // Solicita os dados iniciais ao carregar a página
    document.addEventListener('DOMContentLoaded', () => {
      window.bridge.send('requestInitialData');
    });
  }

  navigateTo(viewName) {
    this.currentView = viewName;

    const viewSelection = document.getElementById('view-selection');
    const viewPanel = document.getElementById('view-panel');

    if (!viewSelection || !viewPanel) return;

    if (viewName === 'selection') {
      viewSelection.style.display = 'flex';
      viewPanel.style.display = 'none';
      if (window.selectionController) window.selectionController.render();
    } else if (viewName === 'panel') {
      viewSelection.style.display = 'none';
      viewPanel.style.display = 'flex';
      if (window.panelController) window.panelController.render();
    }
  }
}

window.router = new UIRouter();
