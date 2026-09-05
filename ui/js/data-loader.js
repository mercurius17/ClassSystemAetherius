/**
 * AetheriusDataLoader
 * Gerencia o carregamento de dados JSON para a Interface de Classes (PRISMA UI / Web / CEF)
 * 
 * 1. Em ambiente CEF / file://: Utiliza instantaneamente os dados pré-carregados de embedded-data.js.
 * 2. Em ambiente HTTP / HTTPS (Preview / Servidor Web): Realiza fetch dinâmico e recarregamento a quente
 *    de data/*.json, garantindo que qualquer alteração externa feita por designers seja refletida imediatamente.
 */

(function() {
  function reloadDynamicData() {
    if (typeof window === 'undefined' || !window.location) return;

    // Apenas tenta fetch se estiver servido por HTTP/HTTPS (evita erros de CORS do file:// no CEF)
    if (window.location.protocol.startsWith('http')) {
      console.log('[AetheriusDataLoader] Buscando dados JSON atualizados de data/...');

      Promise.all([
        fetch('data/classes-config.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('data/perks-descriptions.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('data/spells-descriptions.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null)
      ]).then(([freshClasses, freshPerks, freshSpells]) => {
        let updated = false;

        if (freshClasses && Object.keys(freshClasses).length > 0) {
          window.AETHERIUS_CLASSES = freshClasses;
          updated = true;
        }

        if (freshPerks && Object.keys(freshPerks).length > 0) {
          window.AETHERIUS_PERKS = freshPerks;
          updated = true;
        }

        if (freshSpells && Object.keys(freshSpells).length > 0) {
          window.AETHERIUS_SPELLS = freshSpells;
          updated = true;
        }

        if (updated) {
          console.log('[AetheriusDataLoader] JSONs atualizados em memória com sucesso.');
          if (window.selectionController && typeof window.selectionController.render === 'function') {
            window.selectionController.render();
          }
          if (window.panelController && typeof window.panelController.render === 'function') {
            window.panelController.render();
          }
        }
      }).catch(err => {
        console.warn('[AetheriusDataLoader] Aviso ao recarregar JSONs dinâmicos (mantendo embedded-data):', err);
      });
    }
  }

  // Executa após o carregamento inicial do DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reloadDynamicData);
  } else {
    reloadDynamicData();
  }

  // Expõe função global para recarregamento manual sob demanda
  window.aetheriusReloadData = reloadDynamicData;
})();
