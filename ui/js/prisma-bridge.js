/**
 * PrismaBridge - Camada agnóstica de comunicação entre a Interface Web e o Skyrim/SkyMP.
 * Compatível com:
 * 1. PRISMA UI Nativo (SKSE C++ via RegisterJSListener e InteropCall)
 * 2. Skyrim Platform (CEF via window.skyrimPlatform.sendMessage e browserMessage)
 * 3. Navegador Web Convencional (Modo Dev / Simulação interativa com persistência local)
 */

window.escapeAetheriusHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
}[char]));

class PrismaBridge {
  constructor() {
    this.listeners = new Map();
    this.isDevMode = false;
    this.mockState = null;

    this.init();
  }

  init() {
    // Detecta se está rodando no Skyrim Platform CEF
    if (window.skyrimPlatform && typeof window.skyrimPlatform.sendMessage === 'function') {
      console.log('[PrismaBridge] Conectado ao Skyrim Platform CEF.');
      // O SP pode chamar funções globais via browser.executeJavaScript
      window.receiveGamePacket = (packet) => {
        this.emit(packet.type, packet.data);
      };
      return;
    }

    // Detecta se está rodando no Prisma UI SKSE
    if (typeof window.onPlayerAction === 'function' || typeof window.onClassAction === 'function') {
      console.log('[PrismaBridge] Conectado ao Prisma UI SKSE.');
      window.receivePrismaPacket = (jsonStr) => {
        try {
          const packet = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
          this.emit(packet.type, packet.data);
        } catch (e) {
          console.error('[PrismaBridge] Erro ao processar pacote Prisma:', e);
        }
      };
      return;
    }

    // Modo Dev / Navegador Local
    console.log('[PrismaBridge] Modo Desenvolvimento/Navegador ativado. Simulando backend SkyMP.');
    this.isDevMode = true;
    this.initDevMock();
  }

  initDevMock() {
    const saved = localStorage.getItem('AETHERIUS_DEV_PLAYER');
    if (saved) {
      try {
        this.mockState = JSON.parse(saved);
      } catch (e) {}
    }

    if (!this.mockState) {
      this.mockState = {
        playerId: 1,
        playerName: 'Dovahkiin',
        classId: null,
        className: null,
        level: 1,
        currentXp: 0,
        nextLevelXp: 200,
        totalXpAccumulated: 0,
        unspentAttributePoints: 0,
        allocatedHealth: 0,
        allocatedMagicka: 0,
        allocatedStamina: 0,
        unlockedPerks: [],
        hasWinterholdKeyword: true, // Habilitado para testes
        hasResetTicket: false,
        partyId: null,
        isRaid: false,
        dailyCycleKey: this.getDailyCycleKey(),
        dailyXpGained: 0,
        dailyXpCap: null, // Sem cansaço até o nível 15
        isFatigued: false,
        playerRace: 'Nord',
        baseAttributes: { health: 100, magicka: 100, stamina: 100 },
        unlockedSkills: {}
      };
    } else {
      if (!this.mockState.baseAttributes) {
        this.mockState.baseAttributes = this.getBaseAttributesForRace(this.mockState.playerRace);
      }
      this.refreshDailyCycle(this.mockState);
    }
  }

  getBaseAttributesForRace(race = 'Nord') {
    const r = (race || '').toLowerCase().replace(/race|\s+|_|-/g, '');
    if (r.includes('highelf') || r.includes('altmer')) {
      return { health: 100, magicka: 150, stamina: 100 };
    }
    if (r.includes('imperial')) {
      return { health: 125, magicka: 125, stamina: 125 };
    }
    if (r.includes('orc') || r.includes('orsimer')) {
      return { health: 150, magicka: 100, stamina: 100 };
    }
    if (r.includes('redguard')) {
      return { health: 100, magicka: 100, stamina: 150 };
    }
    return { health: 100, magicka: 100, stamina: 100 };
  }

  getDailyCycleKey(nowMs = Date.now()) {
    const shiftedMs = nowMs - (9 * 60 * 60 * 1000);
    const shiftedDate = new Date(shiftedMs);
    const year = shiftedDate.getUTCFullYear();
    const month = String(shiftedDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(shiftedDate.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  refreshDailyCycle(state) {
    if (!state) return;
    const currentCycle = this.getDailyCycleKey();
    if (state.dailyCycleKey !== currentCycle) {
      state.dailyCycleKey = currentCycle;
      state.dailyXpGained = 0;
      state.dailyXpCap = (state.level >= 15) ? Math.floor((state.nextLevelXp || 200) * 0.20) : null;
      state.isFatigued = false;
    } else if (state.level < 15) {
      state.dailyXpCap = null;
      state.isFatigued = false;
    } else if (state.dailyXpCap === undefined || state.dailyXpCap === null) {
      state.dailyXpCap = Math.floor((state.nextLevelXp || 200) * 0.20);
    }
  }

  saveDevMock() {
    if (this.isDevMode && this.mockState) {
      localStorage.setItem('AETHERIUS_DEV_PLAYER', JSON.stringify(this.mockState));
    }
  }

  send(type, payload = {}) {
    console.log(`[PrismaBridge] Enviando pacote: ${type}`, payload);

    // 1. Prisma UI SKSE
    if (typeof window.onClassAction === 'function') {
      window.onClassAction(JSON.stringify({ type, payload }));
      return;
    }

    // 2. Skyrim Platform CEF
    if (window.skyrimPlatform && typeof window.skyrimPlatform.sendMessage === 'function') {
      window.skyrimPlatform.sendMessage({ type, payload });
      return;
    }

    // 3. Simulação Dev Local
    if (this.isDevMode) {
      setTimeout(() => this.handleDevPacket(type, payload), 50);
    }
  }

  handleDevPacket(type, payload) {
    switch (type) {
      case 'requestInitialData': {
        this.emit('syncPlayerState', {
          player: this.mockState,
          party: null
        });
        break;
      }

      case 'selectClass': {
        const cls = window.AETHERIUS_CLASSES ? window.AETHERIUS_CLASSES[payload.classId] : null;
        if (!cls) {
          this.emit('classSelectedResponse', { success: false, message: 'Classe não encontrada.' });
          return;
        }

        if (cls.requiresWinterholdStudent && !this.mockState.hasWinterholdKeyword) {
          this.emit('classSelectedResponse', {
            success: false,
            message: `A classe ${cls.name} exige vínculo com o Colégio de Winterhold (AlunoColegioWinterhold).`
          });
          return;
        }

        this.mockState.classId = cls.id;
        this.mockState.className = cls.name;
        this.mockState.level = 1;
        this.mockState.currentXp = 0;
        this.mockState.nextLevelXp = 200;
        this.mockState.unspentAttributePoints = 15; // Bônus inicial de teste
        this.mockState.baseAttributes = this.getBaseAttributesForRace(this.mockState.playerRace);
        this.mockState.unlockedPerks = cls.stages && cls.stages[0] ? cls.stages[0].perks : [];
        this.mockState.dailyCycleKey = this.getDailyCycleKey();
        this.mockState.dailyXpGained = 0;
        this.mockState.dailyXpCap = null; // Sem cansaço até o nível 15
        this.mockState.isFatigued = false;

        this.saveDevMock();
        this.emit('classSelectedResponse', {
          success: true,
          state: this.mockState,
          message: `Classe ${cls.name} selecionada com sucesso!`
        });
        break;
      }

      case 'allocateAttributes': {
        const { health = 0, magicka = 0, stamina = 0 } = payload;
        const h = Number(health) || 0;
        const m = Number(magicka) || 0;
        const s = Number(stamina) || 0;
        const total = h + m + s;

        if (![h, m, s].every(Number.isSafeInteger) || h < 0 || m < 0 || s < 0 || total <= 0) {
          this.emit('attributesAllocatedResponse', {
            success: false,
            message: 'Os pontos devem ser números inteiros não negativos.'
          });
          return;
        }

        if (h % 5 !== 0 || m % 5 !== 0 || s % 5 !== 0) {
          this.emit('attributesAllocatedResponse', {
            success: false,
            message: 'Os pontos de atributos devem ser distribuídos apenas em múltiplos de 5.'
          });
          return;
        }

        if (total > this.mockState.unspentAttributePoints) {
          this.emit('attributesAllocatedResponse', { success: false, message: 'Pontos insuficientes.' });
          return;
        }

        this.mockState.allocatedHealth += h;
        this.mockState.allocatedMagicka += m;
        this.mockState.allocatedStamina += s;
        this.mockState.unspentAttributePoints -= total;

        this.saveDevMock();
        this.emit('attributesAllocatedResponse', {
          success: true,
          state: this.mockState,
          message: 'Atributos distribuídos com sucesso!'
        });
        break;
      }

      case 'resetClass': {
        if (this.mockState.level > 15 && !this.mockState.hasResetTicket) {
          this.emit('resetClassResponse', {
            success: false,
            message: 'Acima do nível 15, o reset exige Ticket de Troca de Classe.'
          });
          return;
        }

        this.mockState.classId = null;
        this.mockState.className = null;
        this.mockState.level = 1;
        this.mockState.currentXp = 0;
        this.mockState.totalXpAccumulated = 0;
        this.mockState.unspentAttributePoints = 0;
        this.mockState.allocatedHealth = 0;
        this.mockState.allocatedMagicka = 0;
        this.mockState.allocatedStamina = 0;
        this.mockState.baseAttributes = this.getBaseAttributesForRace(this.mockState.playerRace);
        this.mockState.unlockedPerks = [];
        this.mockState.unlockedSkills = {};
        this.mockState.dailyCycleKey = this.getDailyCycleKey();
        this.mockState.dailyXpGained = 0;
        this.mockState.dailyXpCap = null;
        this.mockState.isFatigued = false;

        this.saveDevMock();
        this.emit('resetClassResponse', {
          success: true,
          state: this.mockState,
          message: 'Classe resetada com sucesso!'
        });
        break;
      }

      case 'devAddXp': {
        this.refreshDailyCycle(this.mockState);
        const xp = payload.xp || 500;
        const isFatigueActive = this.mockState.level >= 15;

        if (isFatigueActive) {
          const cap = this.mockState.dailyXpCap || Math.floor((this.mockState.nextLevelXp || 200) * 0.20);
          const gained = this.mockState.dailyXpGained || 0;
          const remaining = Math.max(0, cap - gained);

          if (remaining > 0) {
            const actualXp = Math.min(xp, remaining);
            this.mockState.dailyXpGained = gained + actualXp;
            this.mockState.isFatigued = this.mockState.dailyXpGained >= cap;
            this.mockState.currentXp += actualXp;
            this.mockState.totalXpAccumulated += actualXp;

            while (this.mockState.currentXp >= this.mockState.nextLevelXp && this.mockState.level < 40) {
              this.mockState.currentXp -= this.mockState.nextLevelXp;
              this.mockState.level++;
              this.mockState.unspentAttributePoints += 15;
              this.mockState.nextLevelXp = Math.floor(this.mockState.nextLevelXp * 1.3);
              this.mockState.dailyXpCap = (this.mockState.level >= 15) ? Math.floor(this.mockState.nextLevelXp * 0.20) : null;
            }
          } else {
            this.mockState.isFatigued = true;
            alert('Cansaço Diário Atingido! Você já acumulou o limite de 20% deste nível hoje. A trava será resetada às 06:00 BRT.');
          }
        } else {
          // Níveis 1 a 14: Sem cansaço (ganho livre de XP)
          this.mockState.currentXp += xp;
          this.mockState.totalXpAccumulated += xp;
          this.mockState.isFatigued = false;
          this.mockState.dailyXpCap = null;

          while (this.mockState.currentXp >= this.mockState.nextLevelXp && this.mockState.level < 40) {
            this.mockState.currentXp -= this.mockState.nextLevelXp;
            this.mockState.level++;
            this.mockState.unspentAttributePoints += 15;
            this.mockState.nextLevelXp = Math.floor(this.mockState.nextLevelXp * 1.3);
            if (this.mockState.level >= 15) {
              this.mockState.dailyXpCap = Math.floor(this.mockState.nextLevelXp * 0.20);
              this.mockState.dailyXpGained = 0;
            }
          }
        }

        this.saveDevMock();
        this.emit('syncPlayerState', { player: this.mockState, party: null });
        break;
      }
    }
  }

  on(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(callback);
  }

  emit(type, data) {
    if (this.listeners.has(type)) {
      for (const cb of this.listeners.get(type)) {
        cb(data);
      }
    }
  }
}

window.bridge = new PrismaBridge();
