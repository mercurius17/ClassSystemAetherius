/**
 * Controlador do Painel da Classe (PAINEL DA CLASSE & PROGRESSÃO COMPACTA)
 * Navegação direta: Voltar à Seleção de Classes e Confirmar Classe
 * 100% dos feitiços e perks traduzidos em PT-BR
 * Alocação de atributos de 5 em 5 pontos
 */

class PanelController {
  constructor() {
    this.playerState = null;
    this.currentClassId = null;
    this.isInspecting = false;
    this.pendingAttributes = { health: 0, magicka: 0, stamina: 0 };
    this.init();
  }

  init() {
    this.bindEvents();

    window.bridge.on('syncPlayerState', (data) => {
      this.playerState = data.player;
      // Se não estiver inspecionando outra classe manualmente, foca na classe do jogador
      if (!this.isInspecting && this.playerState && this.playerState.classId) {
        this.currentClassId = this.playerState.classId;
      }
      this.render();
    });

    window.bridge.on('classSelectedResponse', (res) => {
      if (res.success) {
        alert(res.message || 'Classe confirmada com sucesso!');
        if (res.state) {
          this.playerState = res.state;
          this.currentClassId = res.state.classId;
          this.isInspecting = false;
        }
        this.render();
      } else {
        alert(res.message || 'Erro ao confirmar classe.');
      }
    });

    window.bridge.on('attributesAllocatedResponse', (res) => {
      if (res.success) {
        this.pendingAttributes = { health: 0, magicka: 0, stamina: 0 };
        this.playerState = res.state;
        this.render();
      } else {
        alert(res.message || 'Erro ao alocar atributos.');
      }
    });

    window.bridge.on('resetClassResponse', (res) => {
      if (res.success) {
        alert(res.message);
        this.isInspecting = false;
        this.currentClassId = null;
        if (window.router) {
          window.router.navigateTo('selection');
        }
      } else {
        alert(res.message || 'Erro ao resetar classe.');
      }
    });
  }

  bindEvents() {
    // 1. Botão de Voltar à Seleção de Classes
    const btnBack = document.getElementById('btn-back-selection');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (window.router) {
          window.router.navigateTo('selection');
        }
      });
    }

    // 2. Botão de Confirmar Classe (seleção da classe inspecionada)
    const btnConfirmClass = document.getElementById('btn-confirm-class');
    if (btnConfirmClass) {
      btnConfirmClass.addEventListener('click', () => {
        this.confirmSelectedClass();
      });
    }

    // 3. Modal de Grupo & Raid (Overlay sem poluir a tela principal)
    const btnToggleParty = document.getElementById('btn-toggle-party');
    const btnCloseParty = document.getElementById('btn-party-close');
    const partyBackdrop = document.getElementById('party-modal-backdrop');

    if (btnToggleParty && partyBackdrop) {
      btnToggleParty.addEventListener('click', () => {
        partyBackdrop.style.display = 'flex';
        if (window.partyUI) {
          window.partyUI.render();
        }
      });
    }

    if (btnCloseParty && partyBackdrop) {
      btnCloseParty.addEventListener('click', () => {
        partyBackdrop.style.display = 'none';
      });
    }

    if (partyBackdrop) {
      partyBackdrop.addEventListener('click', (e) => {
        if (e.target === partyBackdrop) {
          partyBackdrop.style.display = 'none';
        }
      });
    }

    // 4. Controles de Atributos [+] e [-] estritamente de 5 em 5
    const btnHealthPlus = document.getElementById('btn-attr-health-plus');
    const btnHealthMinus = document.getElementById('btn-attr-health-minus');
    const btnMagickaPlus = document.getElementById('btn-attr-magicka-plus');
    const btnMagickaMinus = document.getElementById('btn-attr-magicka-minus');
    const btnStaminaPlus = document.getElementById('btn-attr-stamina-plus');
    const btnStaminaMinus = document.getElementById('btn-attr-stamina-minus');
    const btnConfirmAttr = document.getElementById('btn-confirm-attributes');

    if (btnHealthPlus) btnHealthPlus.addEventListener('click', () => this.modifyAttribute('health', 5));
    if (btnHealthMinus) btnHealthMinus.addEventListener('click', () => this.modifyAttribute('health', -5));
    if (btnMagickaPlus) btnMagickaPlus.addEventListener('click', () => this.modifyAttribute('magicka', 5));
    if (btnMagickaMinus) btnMagickaMinus.addEventListener('click', () => this.modifyAttribute('magicka', -5));
    if (btnStaminaPlus) btnStaminaPlus.addEventListener('click', () => this.modifyAttribute('stamina', 5));
    if (btnStaminaMinus) btnStaminaMinus.addEventListener('click', () => this.modifyAttribute('stamina', -5));
    if (btnConfirmAttr) btnConfirmAttr.addEventListener('click', () => this.confirmAttributes());

    // 5. Botão de Reset de Classe
    const btnReset = document.getElementById('btn-reset-class');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.triggerReset());
    }

    // 6. Botão de Compra de Ticket de Troca de Classe
    const btnBuyTicket = document.getElementById('btn-buy-ticket');
    if (btnBuyTicket) {
      btnBuyTicket.addEventListener('click', (e) => {
        e.preventDefault();
        this.openExternalStore('https://aetherius.net.br/');
      });
    }
  }

  openExternalStore(url) {
    if (window.skyrimPlatform && typeof window.skyrimPlatform.openUrl === 'function') {
      window.skyrimPlatform.openUrl(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Inspeciona qualquer classe a partir do clique direto na tela de seleção.
   */
  inspectClass(classId) {
    this.currentClassId = classId;
    this.pendingAttributes = { health: 0, magicka: 0, stamina: 0 };

    if (this.playerState && this.playerState.classId === classId) {
      this.isInspecting = false;
    } else {
      this.isInspecting = true;
    }

    this.render();
  }

  /**
   * Confirma a escolha da classe inspecionada.
   */
  confirmSelectedClass() {
    if (!this.currentClassId) return;

    if (!this.isInspecting) {
      return; // Já é a classe ativa
    }

    const cls = window.AETHERIUS_CLASSES ? window.AETHERIUS_CLASSES[this.currentClassId] : null;
    const className = cls ? cls.name : this.currentClassId;

    if (confirm(`Deseja confirmar a escolha da classe ${className}?\n\nLembre-se: você poderá redefinir livremente sua classe até o nível 15.`)) {
      window.bridge.send('selectClass', { classId: this.currentClassId });
    }
  }

  render() {
    let activeClassId = this.currentClassId;
    if (!activeClassId && this.playerState && this.playerState.classId) {
      activeClassId = this.playerState.classId;
      this.currentClassId = activeClassId;
      this.isInspecting = false;
    }
    if (!activeClassId) {
      activeClassId = 'elementalista';
      this.currentClassId = activeClassId;
      this.isInspecting = true;
    }

    const classDef = window.AETHERIUS_CLASSES ? window.AETHERIUS_CLASSES[activeClassId] : null;
    if (!classDef) return;

    const isCurrentPlayerClass = Boolean(this.playerState && this.playerState.classId === activeClassId);
    this.isInspecting = !isCurrentPlayerClass;

    const effectiveLevel = this.isInspecting ? 40 : (this.playerState ? this.playerState.level : 1);

    // 1. Header do Painel
    const nameEl = document.getElementById('panel-class-title');
    const archetypeEl = document.getElementById('panel-class-archetype');
    const metaEl = document.getElementById('panel-class-meta');
    const iconEl = document.getElementById('panel-class-img');
    const btnConfirm = document.getElementById('btn-confirm-class');

    if (nameEl) nameEl.textContent = classDef.name;
    if (archetypeEl) {
      archetypeEl.textContent = classDef.archetype;
      archetypeEl.className = 'panel-archetype-badge ' + classDef.archetype.toLowerCase();
    }
    if (metaEl) {
      metaEl.textContent = this.isInspecting
        ? 'INSPEÇÃO DE CLASSE • PRÉ-VISUALIZAÇÃO DE PROGRESSÃO'
        : `CLASSE ATIVA • NÍVEL MÁXIMO 40`;
    }
    if (iconEl) {
      iconEl.src = `assets/icons/${activeClassId}.svg`;
      iconEl.onerror = () => { iconEl.src = 'assets/icons/elementalista.svg'; };
    }

    if (btnConfirm) {
      if (this.isInspecting) {
        btnConfirm.textContent = 'CONFIRMAR CLASSE';
        btnConfirm.className = 'btn-nordic btn-gold btn-confirm-class';
        btnConfirm.disabled = false;
      } else {
        btnConfirm.textContent = '✓ CLASSE ATIVA';
        btnConfirm.className = 'btn-nordic btn-confirm-class active-class';
        btnConfirm.disabled = true;
      }
    }

    // 2. Nível & Barra de Experiência
    const levelEl = document.getElementById('panel-level-val');
    const xpCurEl = document.getElementById('xp-cur-val');
    const xpNextEl = document.getElementById('xp-next-val');
    const xpPctEl = document.getElementById('xp-pct-val');
    const xpFillEl = document.getElementById('xp-fill-bar');

    if (this.isInspecting) {
      if (levelEl) levelEl.textContent = 'NV. 1 A 40';
      if (xpCurEl) xpCurEl.textContent = '0';
      if (xpNextEl) xpNextEl.textContent = '1.848.000';
      if (xpPctEl) xpPctEl.textContent = 'Demonstração';
      if (xpFillEl) xpFillEl.style.width = '100%';
    } else {
      const curLvl = this.playerState ? this.playerState.level : 1;
      const curXp = this.playerState ? this.playerState.currentXp : 0;
      const nextXp = this.playerState ? this.playerState.nextLevelXp : 200;
      const pct = nextXp > 0 ? Math.min(Math.round((curXp / nextXp) * 100), 100) : 100;

      if (levelEl) levelEl.textContent = `NÍVEL ${curLvl}`;
      if (xpCurEl) xpCurEl.textContent = curXp.toLocaleString();
      if (xpNextEl) xpNextEl.textContent = nextXp.toLocaleString();
      if (xpPctEl) xpPctEl.textContent = `${pct}%`;
      if (xpFillEl) xpFillEl.style.width = `${pct}%`;
    }

    // 2.1. Cansaço Diário (Máximo de 20% do nível com reset às 06h BRT)
    this.renderFatigueStatus();

    // 3. Descrição Completa da Classe
    this.renderClassDescription(classDef);

    // 4. Distribuição de Atributos
    this.renderAttributes();

    // 5. Redefinição de Classe & Ticket
    this.renderResetCard();

    // 6. Estágios & Perks (100% PT-BR) - Exibido Primeiro
    this.renderStagesAndPerks(classDef, effectiveLevel);

    // 7. Feitiços Autorizados (com RP obrigatório condicional) - Exibido Depois
    this.renderAuthorizedSpells(classDef);
  }

  renderClassDescription(classDef) {
    const descEl = document.getElementById('panel-class-full-desc');
    const tagEl = document.getElementById('panel-archetype-tag');
    if (descEl) {
      descEl.textContent = classDef.description || 'Descrição detalhada não informada para esta classe.';
    }
    if (tagEl) {
      tagEl.textContent = `${classDef.archetype}`;
    }
  }

  renderFatigueStatus() {
    const fatigueBox = document.getElementById('fatigue-box');
    const badgeEl = document.getElementById('fatigue-status-badge');
    const curXpEl = document.getElementById('fatigue-cur-xp');
    const maxXpEl = document.getElementById('fatigue-max-xp');
    const pctTextEl = document.getElementById('fatigue-pct-text');
    const fillBarEl = document.getElementById('fatigue-fill-bar');

    const curLvl = this.playerState ? this.playerState.level : 1;

    // Regra: O sistema de cansaço NÃO deve ser mostrado até que o jogador atinja o Nível 15.
    // Qualquer mensagem sobre o sistema de cansaço não deve aparecer na interface enquanto o jogador não atinge o nível 15.
    if (this.isInspecting || curLvl < 15) {
      if (fatigueBox) fatigueBox.style.display = 'none';
      return;
    }

    if (fatigueBox) fatigueBox.style.display = 'flex';
    if (!badgeEl || !curXpEl || !maxXpEl || !pctTextEl || !fillBarEl) return;

    fillBarEl.classList.remove('unlimited');
    const nextLvlXp = this.playerState ? this.playerState.nextLevelXp : 200;
    const cap = (this.playerState && this.playerState.dailyXpCap !== undefined && this.playerState.dailyXpCap !== null)
      ? this.playerState.dailyXpCap
      : Math.floor(nextLvlXp * 0.20);
    const gained = this.playerState ? (this.playerState.dailyXpGained || 0) : 0;
    const isFatigued = Boolean(this.playerState && (this.playerState.isFatigued || gained >= cap));

    curXpEl.textContent = gained.toLocaleString();
    maxXpEl.textContent = cap.toLocaleString();

    const pct = cap > 0 ? Math.min(Math.round((gained / cap) * 100), 100) : 0;
    pctTextEl.textContent = `${pct}%`;
    fillBarEl.style.width = `${pct}%`;

    if (isFatigued) {
      badgeEl.className = 'fatigue-badge fatigued';
      badgeEl.textContent = 'Cansado (Trava Ativa)';
      fillBarEl.classList.add('capped');
    } else {
      badgeEl.className = 'fatigue-badge available';
      badgeEl.textContent = 'Disponível';
      fillBarEl.classList.remove('capped');
    }
  }

  renderAttributes() {
    const poolEl = document.getElementById('points-pool-val');
    const btnSave = document.getElementById('btn-confirm-attributes');
    const valHealth = document.getElementById('val-alloc-health');
    const valMagicka = document.getElementById('val-alloc-magicka');
    const valStamina = document.getElementById('val-alloc-stamina');
    const curHealthEl = document.getElementById('cur-health-val');
    const curMagickaEl = document.getElementById('cur-magicka-val');
    const curStaminaEl = document.getElementById('cur-stamina-val');

    if (this.isInspecting) {
      if (poolEl) poolEl.textContent = '+15 / Nível';
      if (valHealth) valHealth.textContent = '0';
      if (valMagicka) valMagicka.textContent = '0';
      if (valStamina) valStamina.textContent = '0';
      if (curHealthEl) curHealthEl.textContent = '(Passos de 5 em 5)';
      if (curMagickaEl) curMagickaEl.textContent = '(Passos de 5 em 5)';
      if (curStaminaEl) curStaminaEl.textContent = '(Passos de 5 em 5)';
      if (btnSave) {
        btnSave.disabled = true;
        btnSave.textContent = 'CONFIRME A CLASSE PARA ALOCAR';
      }
      return;
    }

    if (btnSave) {
      btnSave.textContent = 'CONFIRMAR ATRIBUTOS';
    }

    const currentSpent = this.pendingAttributes.health + this.pendingAttributes.magicka + this.pendingAttributes.stamina;
    const available = this.playerState ? this.playerState.unspentAttributePoints : 0;
    const currentPool = available - currentSpent;

    if (poolEl) poolEl.textContent = Math.max(currentPool, 0);

    if (valHealth) valHealth.textContent = this.pendingAttributes.health;
    if (valMagicka) valMagicka.textContent = this.pendingAttributes.magicka;
    if (valStamina) valStamina.textContent = this.pendingAttributes.stamina;

    const base = (this.playerState && this.playerState.baseAttributes)
      ? this.playerState.baseAttributes
      : { health: 100, magicka: 100, stamina: 100 };

    const totalHealth = base.health + (this.playerState ? this.playerState.allocatedHealth || 0 : 0);
    const totalMagicka = base.magicka + (this.playerState ? this.playerState.allocatedMagicka || 0 : 0);
    const totalStamina = base.stamina + (this.playerState ? this.playerState.allocatedStamina || 0 : 0);

    if (curHealthEl) curHealthEl.textContent = `${totalHealth} (+${this.playerState ? this.playerState.allocatedHealth || 0 : 0} alocados)`;
    if (curMagickaEl) curMagickaEl.textContent = `${totalMagicka} (+${this.playerState ? this.playerState.allocatedMagicka || 0 : 0} alocados)`;
    if (curStaminaEl) curStaminaEl.textContent = `${totalStamina} (+${this.playerState ? this.playerState.allocatedStamina || 0 : 0} alocados)`;

    if (btnSave) btnSave.disabled = currentSpent <= 0;
  }

  modifyAttribute(attr, delta) {
    if (this.isInspecting) return;

    const currentSpent = this.pendingAttributes.health + this.pendingAttributes.magicka + this.pendingAttributes.stamina;
    const available = this.playerState ? this.playerState.unspentAttributePoints : 0;

    // Alocação exclusivamente de 5 em 5
    if (delta > 0 && (currentSpent + delta) > available) return;
    if (delta < 0 && (this.pendingAttributes[attr] + delta) < 0) return;

    this.pendingAttributes[attr] += delta;
    this.renderAttributes();
  }

  confirmAttributes() {
    if (this.isInspecting) return;

    const currentSpent = this.pendingAttributes.health + this.pendingAttributes.magicka + this.pendingAttributes.stamina;
    if (currentSpent <= 0) return;

    window.bridge.send('allocateAttributes', {
      health: this.pendingAttributes.health,
      magicka: this.pendingAttributes.magicka,
      stamina: this.pendingAttributes.stamina
    });
  }

  renderResetCard() {
    const badgeEl = document.getElementById('reset-badge-status');
    const descEl = document.getElementById('reset-desc-text');
    const btnEl = document.getElementById('btn-reset-class');
    const btnBuyTicket = document.getElementById('btn-buy-ticket');

    const curLvl = this.playerState ? this.playerState.level : 1;

    // Regra: O botão de compra do ticket de troca de classe não deve aparecer até que o jogador atinja o LVL 15
    if (btnBuyTicket) {
      btnBuyTicket.style.display = (!this.isInspecting && curLvl >= 15) ? 'block' : 'none';
    }

    if (this.isInspecting) {
      if (badgeEl) {
        badgeEl.className = 'reset-badge free';
        badgeEl.textContent = 'Gratuito (Nv. 1-15)';
      }
      if (descEl) {
        descEl.textContent = 'Você poderá redefinir livremente sua classe até o nível 15. A partir do nível 16, a redefinição exige um Ticket de Troca de Classe.';
      }
      if (btnEl) {
        btnEl.disabled = true;
        btnEl.textContent = 'Modo Inspeção';
      }
      return;
    }

    const isFree = curLvl <= 15;

    if (badgeEl) {
      badgeEl.className = `reset-badge ${isFree ? 'free' : 'ticket'}`;
      badgeEl.textContent = isFree ? 'Reset Gratuito (Nv. 1-15)' : 'Exige Ticket de Troca (Nv. 16+)';
    }

    if (descEl) {
      descEl.textContent = isFree
        ? 'Seu personagem está no nível 15 ou inferior. Você pode redefinir sua classe e redistribuir todo o seu progresso a qualquer momento.'
        : 'Como seu personagem ultrapassou o nível 15, a troca exige um Ticket de Troca de Classe atribuído no servidor.';
    }

    if (btnEl) {
      btnEl.disabled = false;
      btnEl.textContent = isFree ? 'Resetar Classe (Gratuito)' : 'Resetar Classe com Ticket';
    }
  }

  triggerReset() {
    if (this.isInspecting) return;

    const isFree = this.playerState ? this.playerState.level <= 15 : true;
    const msg = isFree
      ? 'Tem certeza que deseja resetar sua classe? Seu nível de classe e pontos de atributos serão redefinidos para o nível 1.'
      : 'Tem certeza que deseja resetar sua classe? Será consumido um Ticket de Troca de Classe do seu inventário.';

    if (confirm(msg)) {
      window.bridge.send('resetClass');
    }
  }

  renderAuthorizedSpells(classDef) {
    const container = document.getElementById('spells-tiers-container');
    const badgeEl = document.getElementById('spells-count-badge');
    if (!container || !classDef) return;

    container.innerHTML = '';
    const spellsByTier = classDef.authorizedSpells || {};
    const allSpellsDict = window.AETHERIUS_SPELLS || {};

    const tiers = ['Novato', 'Aprendiz', 'Adepto', 'Especialista', 'Mestre'];
    let totalSpells = 0;

    tiers.forEach(tier => {
      const list = spellsByTier[tier];
      if (list && list.length > 0) {
        totalSpells += list.length;
        const block = document.createElement('div');
        block.className = 'spells-tier-block';

        const cardsHtml = list.map(spellId => {
          const spellInfo = allSpellsDict[spellId] || allSpellsDict[spellId.toLowerCase()] || {
            namePt: spellId,
            descriptionPt: 'Feitiço autorizado da classe.'
          };
          const escape = window.escapeAetheriusHtml;
          const displayName = escape(spellInfo.namePt || spellId);
          const description = escape(spellInfo.descriptionPt || 'Feitiço de combate autorizado para esta classe.');

          return `
            <div class="spell-card" title="${description}">
              <div class="spell-header-row">
                <span class="spell-name">${displayName}</span>
                <span class="spell-tier-pill">${tier}</span>
              </div>
              <div class="spell-desc">${description}</div>
            </div>
          `;
        }).join('');

        block.innerHTML = `
          <div class="spells-tier-title">Tier ${tier}</div>
          <div class="spells-cards-grid">
            ${cardsHtml}
          </div>
        `;
        container.appendChild(block);
      }
    });

    const rpBanner = document.getElementById('rp-notice-banner');
    if (rpBanner) {
      rpBanner.style.display = totalSpells > 0 ? 'flex' : 'none';
    }

    if (badgeEl) {
      badgeEl.textContent = totalSpells > 0 ? `${totalSpells} Feitiços Autorizados` : 'Sem Feitiços (Classe Marcial)';
    }

    if (totalSpells === 0) {
      container.innerHTML = `
        <div class="martial-note">
          Esta classe foca exclusivamente em perícias marciais, combate físico e maestria com armaduras/armas, sem grimórios de feitiços arcanos.
        </div>
      `;
    }
  }

  renderStagesAndPerks(classDef, effectiveLevel) {
    const container = document.getElementById('perks-grid-list');
    if (!container || !classDef) return;

    container.innerHTML = '';
    const allPerksDesc = window.AETHERIUS_PERKS || {};

    classDef.stages.forEach(stage => {
      const isStageUnlocked = this.isInspecting ? true : (effectiveLevel >= stage.level);

      stage.perks.forEach(perkName => {
        const perkInfo = allPerksDesc[perkName] || {
          name: perkName,
          namePt: perkName,
          descriptionPt: 'Habilidade de combate da classe.'
        };

        const card = document.createElement('div');
        card.className = `perk-card ${isStageUnlocked ? 'unlocked' : 'locked'}`;
        const escape = window.escapeAetheriusHtml;
        card.innerHTML = `
          <div class="perk-card-header">
            <div class="perk-card-title">${escape(perkInfo.namePt || perkInfo.name)}</div>
            <div class="perk-card-stage">Estágio ${escape(stage.stageNumber)} • Nv. ${escape(stage.level)}</div>
          </div>
          <div class="perk-card-desc">${escape(perkInfo.descriptionPt)}</div>
        `;
        container.appendChild(card);
      });
    });
  }
}

window.panelController = new PanelController();
