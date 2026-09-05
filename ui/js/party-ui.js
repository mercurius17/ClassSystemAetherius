/**
 * Controlador de Interface de Grupos (Party 2-8) e Raid (8-20)
 */

class PartyUI {
  constructor() {
    this.partyState = null;
    this.init();
  }

  init() {
    this.bindEvents();

    window.bridge.on('syncPlayerState', (data) => {
      this.partyState = data.party;
      this.render();
    });

    window.bridge.on('partyCreated', (party) => {
      this.partyState = party;
      this.render();
    });

    window.bridge.on('partyLeft', () => {
      this.partyState = null;
      this.render();
    });

    window.bridge.on('raidConverted', (res) => {
      if (res.success) {
        this.partyState = res.party;
        this.render();
      }
    });
  }

  bindEvents() {
    const btnCreate = document.getElementById('btn-party-create');
    const btnInvite = document.getElementById('btn-party-invite');
    const btnLeave = document.getElementById('btn-party-leave');
    const btnRaid = document.getElementById('btn-party-to-raid');

    if (btnCreate) {
      btnCreate.addEventListener('click', () => {
        window.bridge.send('createParty');
      });
    }

    if (btnInvite) {
      btnInvite.addEventListener('click', () => {
        const targetId = prompt('Informe o ID do jogador para convidar:');
        if (targetId && !isNaN(Number(targetId))) {
          window.bridge.send('inviteParty', { targetId: Number(targetId) });
        }
      });
    }

    if (btnLeave) {
      btnLeave.addEventListener('click', () => {
        if (confirm('Deseja realmente sair do grupo?')) {
          window.bridge.send('leaveParty');
        }
      });
    }

    if (btnRaid) {
      btnRaid.addEventListener('click', () => {
        if (confirm('Converter este grupo em RAID PARTY (até 20 jogadores)?')) {
          window.bridge.send('convertToRaid');
        }
      });
    }
  }

  render() {
    const container = document.getElementById('party-members-display');
    const modeBadge = document.getElementById('party-mode-title');
    const btnCreate = document.getElementById('btn-party-create');
    const btnInvite = document.getElementById('btn-party-invite');
    const btnLeave = document.getElementById('btn-party-leave');
    const btnRaid = document.getElementById('btn-party-to-raid');

    if (!container) return;
    container.innerHTML = '';

    if (!this.partyState || this.partyState.members.length === 0) {
      if (modeBadge) modeBadge.textContent = 'VOCÊ NÃO ESTÁ EM UM GRUPO';
      if (btnCreate) btnCreate.style.display = 'inline-flex';
      if (btnInvite) btnInvite.style.display = 'none';
      if (btnLeave) btnLeave.style.display = 'none';
      if (btnRaid) btnRaid.style.display = 'none';

      container.innerHTML = `
        <div style="color: var(--text-subtitle); padding: 30px; text-align: center;">
          Crie um novo grupo para se aventurar em Skyrim e compartilhar XP com aliados.
        </div>
      `;
      return;
    }

    if (btnCreate) btnCreate.style.display = 'none';
    if (btnInvite) btnInvite.style.display = 'inline-flex';
    if (btnLeave) btnLeave.style.display = 'inline-flex';

    if (this.partyState.isRaid) {
      if (modeBadge) modeBadge.textContent = `RAID PARTY (${this.partyState.members.length}/20 JOGADORES)`;
      if (btnRaid) btnRaid.style.display = 'none';
      this.renderRaidGrid(container);
    } else {
      if (modeBadge) modeBadge.textContent = `GRUPO NORMAL (${this.partyState.members.length}/8 JOGADORES)`;
      if (btnRaid) btnRaid.style.display = 'inline-flex';
      this.renderPartyGrid(container);
    }
  }

  renderPartyGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'party-grid';

    this.partyState.members.forEach(member => {
      const card = this.createMemberCard(member);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  renderRaidGrid(container) {
    const raidGrid = document.createElement('div');
    raidGrid.className = 'raid-subgroups-grid';

    // 4 Subgrupos
    for (let g = 1; g <= 4; g++) {
      const col = document.createElement('div');
      col.className = 'raid-subgroup-column';
      col.innerHTML = `<div class="subgroup-title">Esquadrão ${g}</div>`;

      const subMembers = this.partyState.members.filter(m => (m.subgroupId || 1) === g);
      if (subMembers.length === 0) {
        col.innerHTML += `<div style="color: var(--text-muted); font-size: 0.8rem; text-align: center; padding: 10px;">Vazio</div>`;
      } else {
        subMembers.forEach(m => {
          col.appendChild(this.createMemberCard(m));
        });
      }

      raidGrid.appendChild(col);
    }

    container.appendChild(raidGrid);
  }

  createMemberCard(member) {
    const card = document.createElement('div');
    card.className = `member-card ${member.isLeader ? 'leader' : ''}`;

    const escape = window.escapeAetheriusHtml;
    const health = Number.isFinite(member.health) ? Math.max(0, member.health) : 0;
    const maxHealth = Number.isFinite(member.maxHealth) && member.maxHealth > 0 ? member.maxHealth : 1;
    const magicka = Number.isFinite(member.magicka) ? Math.max(0, member.magicka) : 0;
    const maxMagicka = Number.isFinite(member.maxMagicka) && member.maxMagicka > 0 ? member.maxMagicka : 1;
    const healthPct = Math.min(100, (health / maxHealth) * 100);
    const magickaPct = Math.min(100, (magicka / maxMagicka) * 100);

    card.innerHTML = `
      <div class="member-header">
        <div class="member-name-box">
          ${member.isLeader ? '<span class="leader-icon">👑</span>' : ''}
          <span class="member-name">${escape(member.name)}</span>
        </div>
        <span class="member-level">Nv. ${escape(member.level)}</span>
      </div>
      <div class="member-class">${escape(member.className || 'Sem Classe')}</div>
      <div class="member-bar health" title="Vida: ${health}/${maxHealth}">
        <div class="bar-fill" style="width: ${healthPct}%"></div>
      </div>
      <div class="member-bar magicka" title="Mágicka: ${magicka}/${maxMagicka}">
        <div class="bar-fill" style="width: ${magickaPct}%"></div>
      </div>
    `;

    return card;
  }
}

window.partyUI = new PartyUI();
