/**
 * Controlador da Tela de Seleção de Classes (fiel a INTERFACE DE CLASSES.jfif)
 * O jogador clica na classe e é direcionado diretamente ao painel da classe com CONFIRMAR CLASSE e VOLTAR.
 */

class SelectionController {
  constructor() {
    this.selectedClassId = null;
    this.playerState = null;
    this.init();
  }

  init() {
    this.bindEvents();
    window.bridge.on('syncPlayerState', (data) => {
      this.playerState = data.player;
      this.render();
    });

    window.bridge.on('classSelectedResponse', (res) => {
      if (res.success) {
        if (window.router) {
          window.router.navigateTo('panel');
        }
      } else {
        alert(res.message || 'Erro ao selecionar classe.');
      }
    });

    this.render();
  }

  bindEvents() {
    // A tela inicial não possui botões soltos: a navegação ocorre pelo clique direto no card da classe
  }

  render() {
    const classes = window.AETHERIUS_CLASSES;
    if (!classes) return;

    const colConjuradores = document.getElementById('list-conjuradores');
    const colGuerreiros = document.getElementById('list-guerreiros');
    const colEspecialistas = document.getElementById('list-especialistas');

    if (!colConjuradores || !colGuerreiros || !colEspecialistas) return;

    colConjuradores.innerHTML = '';
    colGuerreiros.innerHTML = '';
    colEspecialistas.innerHTML = '';

    for (const [id, cls] of Object.entries(classes)) {
      const card = this.createClassCard(id, cls);

      if (cls.archetype === 'CONJURADORES') {
        colConjuradores.appendChild(card);
      } else if (cls.archetype === 'GUERREIROS') {
        colGuerreiros.appendChild(card);
      } else {
        colEspecialistas.appendChild(card);
      }
    }
  }

  createClassCard(id, cls) {
    const card = document.createElement('div');
    card.className = 'class-card';
    if (this.selectedClassId === id) {
      card.classList.add('selected');
    }

    // Valida exigência de Winterhold
    const isLocked = cls.requiresWinterholdStudent && this.playerState && !this.playerState.hasWinterholdKeyword;
    if (isLocked) {
      card.classList.add('locked');
    }

    const iconLeftSrc = `assets/icons/${id}.svg`;
    const iconRightSrc = `assets/icons/accents/${id}.svg`;

    card.innerHTML = `
      <div class="class-icon-left">
        <img src="${iconLeftSrc}" alt="${cls.name}" onerror="this.style.display='none'">
      </div>
      <div class="class-info">
        <div class="class-name">${cls.name}</div>
        <div class="class-desc">${cls.description}</div>
      </div>
      <div class="class-icon-right">
        <img src="${iconRightSrc}" alt="${cls.name}" onerror="this.style.display='none'">
      </div>
      ${isLocked ? '<div class="lock-badge">WINTERHOLD</div>' : ''}
    `;

    // Clique direto direciona imediatamente para o painel de detalhes da classe
    card.addEventListener('click', () => {
      if (isLocked) {
        alert(`A classe ${cls.name} exige autorização e vínculo com o Colégio de Winterhold (AlunoColegioWinterhold).`);
        return;
      }
      this.selectedClassId = id;
      if (window.panelController) {
        window.panelController.inspectClass(id);
      }
      if (window.router) {
        window.router.navigateTo('panel');
      }
    });

    return card;
  }
}

window.selectionController = new SelectionController();
