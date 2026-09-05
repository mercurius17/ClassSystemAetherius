# AETHERIUS - Sistema de Classes, Leveling, Grupos e Raids (SkyMP)

Sistema completo desenvolvido para **Skyrim SE/AE** na base **SkyMP**, integrando **Skyrim Platform** e **PRISMA UI** (SKSE / Chromium Embedded Framework). O sistema implementa 18 classes divididas em 3 arquétipos, progressão em 8 estágios, resolução dinâmica de perks, distribuição de atributos, regras raciais do mod **Aetherius**, sistema de cansaço diário, grupos e raids.

---

## 1. Visão Geral da Arquitetura

O sistema é dividido em camadas modulares e desacopladas:

```
sistema-classes/
├── config/                      # Configurações JSON externas (editáveis por designers/staff)
│   ├── classes-config.json      # 18 classes com 8 estágios, atributos, skills e feitiços autorizados
│   ├── perk-mappings.json       # Resolução técnica de FormIDs (localId, plugins candidatos, aliases)
│   ├── perks-descriptions.json  # Nomes amigáveis e explicações de efeitos em Português do Brasil (PT-BR)
│   └── spells-descriptions.json # 149 feitiços com nomes em PT-BR e descrições customizáveis externamente
├── shared/                      # Regras compartilhadas entre Cliente e Servidor
│   ├── types.ts                 # Contratos TypeScript de estados, pacotes e entidades
│   ├── raceData.ts              # Atributos base de Nível 1 do mod Aetherius (exceções raciais e padrão)
│   ├── skillResolver.ts         # Mapeamento e cálculo de habilidades mínimas exigidas por estágio
│   ├── levelingMath.ts          # Fórmulas oficiais de XP (1-40), Delta, Party (2-8), Raids (8-20) e Cansaço
│   ├── perkResolver.ts          # Esteira dinâmica de resolução de perks (tolerante a load order)
│   ├── classesData.ts           # Repositório central de classes, perks e feitiços resolvidos
│   └── bestiaryData.ts          # Tabela de XP base para 50+ criaturas e chefes
├── server/                      # Lógica do Servidor SkyMP
│   ├── classSystem.ts           # Seleção, permissão Winterhold, passos de 5 em atributos e reset racial
│   ├── levelingSystem.ts        # Abates, distribuição de XP, trava de cansaço e concessão de skills/perks
│   ├── partySystem.ts           # Grupos normais (2 a 8 membros) e verificação de proximidade (5000 u)
│   ├── raidSystem.ts            # Conversão para Raid (8 a 20 membros) e 4 subgrupos (máx 5 cada)
│   ├── storage/playerRepository.ts # Persistência via mp.get/mp.set com fallback em memória
│   └── index.ts                 # Ponto de entrada do servidor e roteador de pacotes de rede
├── client/                      # Script do Cliente (Skyrim Platform)
│   ├── index.ts                 # Ponto de entrada, listener da tecla [K] e [ESC]
│   ├── prismaController.ts      # Gerenciador da view Prisma UI, foco de cursor e sincronização de estado
│   ├── clientPerkApplier.ts     # Aplicação nativa de perks, habilidades e atributos no ator Skyrim
│   ├── combatEvents.ts          # Monitoramento de abates, detecção de dragões e sacerdotes do dragão
│   ├── partyHud.ts              # Widget e cálculo de distância de aliados em tempo real
│   └── skyrimPlatform.d.ts      # Declarações de tipos do ambiente Skyrim Platform
├── ui/                          # Interface Gráfica PRISMA UI (HTML5 / CSS3 / ES6)
│   ├── index.html               # SPA unificado com navegação entre Seleção e Painel
│   ├── selection.html           # Tela de Seleção de Classes (18 classes, 3 arquétipos)
│   ├── panel.html               # Painel da Classe (Nível, XP, Atributos, Perks, Feitiços e Loja)
│   ├── css/                     # Estilos nórdicos otimizados para Ultralight / CEF
│   ├── js/                      # Controladores (selection-controller, panel-controller, prisma-bridge)
│   └── assets/                  # 18 ícones temáticos e brasões customizados
├── prisma-plugin/               # Plugin C++ SKSE opcional para carregamento nativo via IVPrismaUI1
│   ├── CMakeLists.txt
│   └── src/ (main.cpp, PCH.h, PrismaUI_API.h)
└── tests/                       # Testes automatizados Jest (41 testes cobrindo 100% do sistema)
```

---

## 2. Catálogo Oficial das 18 Classes

O sistema é rigorosamente balanceado em **3 grandes arquétipos**, cada um com exatamente **6 classes**:

### 🔮 Conjuradores (Mestres do Arcano)
Exigem vínculo de Roleplay com o Colégio de Winterhold (`requiresWinterholdStudent: true`).
1. **Elementalista**: Canalizador dos três elementos primordiais (Fogo, Gelo e Eletricidade).
2. **Criomante**: Especialista no gelo cortante, desaceleração e controle de multidões.
3. **Eletromante**: Conjurador da velocidade da tempestade, relâmpagos e desintegração mágica.
4. **Piromante**: Mestre do fogo devastador, explosões em área e incineramento.
5. **Invocador**: Artífice de criaturas dos planos de Oblivion e armamento conjurado.
6. **Curandeiro**: Especialista devoto em magias de Restauração, suporte e sustentação do grupo.

### ⚔️ Guerreiros (Força e Blindagem)
1. **Guardião**: Especialista absoluto em escudo (Bloqueio) e armadura pesada intransponível.
2. **Berserker**: Fúria nórdica de duas mãos com mobilidade ágil de armadura leve.
3. **Cavaleiro Negro**: Guerreiro blindado que mescla combate brutal de duas mãos com destruição arcana.
4. **Paladino**: Campeão sagrado que combina combate de uma mão, escudo e magias de restauração.
5. **Mestre Espadachim**: Duelista refinado de lâminas velozes de uma mão e reflexos evasivos.
6. **Druida**: Combatente híbrido em comunhão com a natureza, conjurações e cura.

### 🏹 Especialistas (Furtividade, Tiro e Astúcia)
1. **Arqueiro**: Mestre dos disparos precisos à distância e emboscadas com arcos longos *(Steady Aim removida por equilíbrio de rede)*.
2. **Ranger**: Caçador versátil que transita perfeitamente entre disparos rápidos de arco e combate de proximidade.
3. **Viper**: Especialista ágil em venenos letais, adagas envenenadas e evasão com armadura leve.
4. **Assassino**: Especialista em eliminação furtiva a curta distância, ataques críticos e ilusão.
5. **Anti-Mago**: Especialista treinado para caçar arcanistas, dissipar magias e drenar reservas mágicas.
6. **Trapaceiro**: Mestre dos truques de ilusão, furtividade engenhosa e manipulação de inimigos.

---

## 3. Regras de Negócio e Mecânicas

### 3.1 Atributos Raciais do Mod Aetherius no Reset (Nível 1)
Ao resetar a classe ou criar o personagem, os atributos retornam exatamente à linha de base de Nível 1 definida pelas passivas raciais do mod **Aetherius**:
- **High Elf (Altmer)** - *Highborn*: +50 Mágicka $\rightarrow$ **100 Vida, 150 Mágicka, 100 Vigor**.
- **Imperial** - *Red Diamond*: +25 em todos os atributos $\rightarrow$ **125 Vida, 125 Mágicka, 125 Vigor**.
- **Orc (Orsimer)** - *Orsinium's Heir*: +50 Vida $\rightarrow$ **150 Vida, 100 Mágicka, 100 Vigor**.
- **Redguard** - *Martial Training*: +50 Vigor $\rightarrow$ **100 Vida, 100 Mágicka, 150 Vigor**.
- **Demais Raças** (Nord, Breton, Dunmer, Bosmer, Khajiit, Argonian): Base padrão $\rightarrow$ **100 Vida, 100 Mágicka, 100 Vigor**.

### 3.2 Distribuição de Atributos
- A cada nível conquistado, o jogador recebe **+15 pontos** de atributos (total de 585 pontos no Nível 40).
- A distribuição é feita estritamente em **passos de 5 em 5 pontos** para Vida, Mágicka ou Vigor, validada tanto na interface quanto no servidor.

### 3.3 Concessão Automática de Nível de Habilidades (Skills) por Estágio
Cada classe possui marcos de estágio (Níveis 1, 5, 10, 15, 20, 25, 30, 40) que definem o patamar de habilidades correspondente:
- **Exemplo (Elementalista)**:
  - Nível 1: Habilidades em patamar inicial.
  - Nível 5: Todas as habilidades da classe atingem no mínimo **20**.
  - Nível 10: Destruição 30, Alteração 30, Restauração 30.
  - Nível 15: Destruição 40, Alteração 40, Restauração 40.
  - Nível 20: Destruição 50.
  - Nível 25: Destruição 60.
- O sistema calcula determinísticamente os patamares da classe (`resolveSkillsForClassAndLevel`) e aplica diretamente ao ator do Skyrim via `player.setActorValue()`, garantindo que o jogador receba suas competências sem penalizar habilidades já treinadas além da meta.

### 3.4 Sistema de Cansaço Diário (Daily Fatigue)
- **Níveis 1 a 14**: O sistema de cansaço **NÃO EXISTE**. O ganho de XP é 100% livre, irrestrito e a interface **não exibe nenhuma menção ou aviso de cansaço**.
- **A partir do Nível 15**: O jogador só pode acumular até **20% do valor total da experiência respectiva ao seu nível atual** por ciclo diário.
  - *Exemplo*: No nível 26 para 27 (requer 50.000 XP), o limite diário é de **10.000 XP**.
  - Ao atingir o limite, o jogador entra em estado cansado (`isFatigued: true`) e o ganho de XP de classe é travado até o próximo ciclo.
- **Virada de Ciclo**: Ocorre pontualmente todos os dias às **06:00 da manhã (Horário de Brasília, UTC-3 / 09:00 UTC)**, liberando a trava e renovando a cota diária.

### 3.5 Redefinição de Classe e Loja de Tickets
- **Níveis 1 ao 15**: O reset de classe é **100% gratuito e ilimitado**.
- **Níveis 16 ao 40**: A redefinição exige um **Ticket de Troca de Classe** (`hasResetTicket`).
- **Visibilidade do Botão de Compra**: O botão "Comprar Ticket de Troca de Classe" fica oculto até o Nível 15. A partir do **Nível 15**, ele se torna visível na interface, redirecionando o jogador para `https://aetherius.net.br/`.

### 3.6 Feitiços Autorizados e Roleplay Obrigatório
- **Os feitiços NÃO são concedidos automaticamente pelo sistema de classes.**
- Eles representam o *Grimório Autorizado* da classe. Nas classes arcanas que possuem feitiços, é exibido o aviso:
  > **ROLEPLAY OBRIGATÓRIO:** Os feitiços desta classe não são concedidos automaticamente pelo sistema. Devem ser aprendidos através de Roleplay junto aos professores do Colégio de Winterhold mediante realização de tarefas e compra de livros mágicos.
- Classes que não possuem feitiços não exibem esse aviso.

---

## 4. Resolução Dinâmica de Perks (`PerkResolver`)

As perks não dependem de ordem fixa de carregamento (load order) nem de índices fixos de plugins:
1. **Cache Local em Memória**: Garante altíssima performance para consultas repetidas.
2. **Estratégia Local ID + Plugins Candidatos**: Consulta `Game.getFormFromFile(localId, plugin)` testando arquivos candidatos (`Vokrii - Minimalistic Perks of Skyrim.esp`, `Vokrii.esp`, `Skyrim.esm`, etc.).
3. **Estratégia Editor ID & Aliases**: Busca por identificadores canônicos caso a load order mude.
4. **Fallback Seguro / Mock Determinístico**: Permite que os testes unitários e o ambiente web rodem com total estabilidade.

---

## 5. Sistema de Grupos (Party) e Raids

- **Grupo Normal**: Suporta de 2 a 8 membros.
- **Conversão para Raid**: O líder pode converter um grupo cheio em Raid para até 20 jogadores.
- **4 Subgrupos de Raid**: Capacidade de até 5 membros por subgrupo (1 a 4), permitindo organização tática por funções (tanques, curandeiros, DPS).
- **HUD Integrado**: Monitora a vida, magia, vigor e sinaliza visualmente a proximidade (raio de 5.000 unidades e mesma célula).

---

## 6. Como Executar e Testar

### Pré-requisitos
- Node.js v18+
- Skyrim Special Edition / Anniversary Edition
- Skyrim Platform ou Prisma UI instalado

### Comandos Principais
```bash
# 1. Instalar dependências
npm install

# 2. Sincronizar e validar arquivos JSON de configuração
npm run sync-data

# 3. Executar a suíte completa de testes automatizados (41 testes)
npm test

# 4. Compilar o projeto TypeScript para dist/
npm run build

# 5. Iniciar servidor de pré-visualização web da interface PRISMA UI
npm run preview
```

### Controles no Jogo
- **Tecla [K]**: Abre o Painel de Classe (se já possuir classe) ou a Seleção de Classes.
- **Tecla [ESC]**: Fecha imediatamente a interface PRISMA UI e devolve o controle ao jogo.
