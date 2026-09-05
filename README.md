# AETHERIUS - Sistema de Classes, Leveling, Grupos e Raids

Sistema completo desenvolvido para **Skyrim SE/AE** na base **SkyMP**, integrando **Skyrim Platform** e **PRISMA UI** (SKSE / Chromium Embedded Framework).

---

## 1. Visão Geral da Arquitetura

O sistema é dividido em camadas modulares e desacopladas:

```
sistema-classes/
├── config/                      # Configurações JSON externas (editáveis por designers/staff)
│   ├── classes-config.json      # 18 classes com 8 estágios, atributos e feitiços autorizados
│   ├── perk-mappings.json       # Resolução técnica de FormIDs (localId, plugins candidatos, aliases)
│   ├── perks-descriptions.json  # Nomes amigáveis e explicações de efeitos em Português do Brasil (PT-BR)
│   └── spells-descriptions.json # 112 feitiços com nomes em PT-BR e descrições customizáveis externamente
├── shared/                      # Regras compartilhadas entre Cliente e Servidor
│   ├── types.ts                 # Contratos TypeScript de estados, pacotes e entidades
│   ├── levelingMath.ts          # Fórmulas oficiais de XP (1-40), Delta, Party (2-8) e Raids (8-20)
│   ├── perkResolver.ts          # Esteira dinâmica de resolução de perks (tolerante a load order)
│   ├── classesData.ts           # Repositório central de classes, perks e feitiços resolvidos
│   └── bestiaryData.ts          # Tabela de XP base para 50+ criaturas e chefes
├── server/                      # Lógica do Servidor SkyMP
│   ├── classSystem.ts           # Validação de seleção, palavra-chave de Winterhold, passos de 5 de atributos e resets
│   ├── levelingSystem.ts        # Processamento de abates, distribuição de XP e level-up (+15 pts)
│   ├── partySystem.ts           # Grupos normais (2 a 8 membros) e verificação de proximidade (5000 u)
│   ├── raidSystem.ts            # Conversão para Raid (8 a 20 membros) e 4 subgrupos (máx 5 cada)
│   ├── storage/playerRepository.ts # Persistência via mp.get/mp.set com fallback em memória
│   └── index.ts                 # Ponto de entrada do servidor e roteador de pacotes
├── client/                      # Script do Cliente (Skyrim Platform)
│   ├── index.ts                 # Ponto de entrada, listener da tecla [K] e [ESC]
│   ├── prismaController.ts      # Gerenciador da view Prisma UI, foco de cursor e navegação
│   ├── clientPerkApplier.ts     # Aplicação nativa de perks no jogador via Game.getFormFromFile
│   ├── combatEvents.ts          # Monitoramento de abates, detecção de dragões e sacerdotes
│   └── partyHud.ts              # Widget e cálculo de distância de aliados em tempo real
├── ui/                          # Interface Gráfica PRISMA UI (HTML5 / CSS3 / ES6)
│   ├── selection.html           # Tela de Seleção de Classes (botão único de seleção + pré-visualização)
│   ├── panel.html               # Painel da Classe com Nível 1-40, XP, Atributos (passos de 5), Perks e Loja
│   ├── index.html               # SPA unificado com roteamento entre Seleção, Painel e Pré-Visualização
│   ├── css/                     # Estilos visuais nórdicos, responsivos e otimizados para CEF
│   ├── js/                      # Controladores (selection-controller, panel-controller, prisma-bridge)
│   └── assets/                  # 18 ícones de classe à esquerda e 18 brasões estilizados à direita
├── prisma-plugin/               # Plugin C++ SKSE opcional para carregamento nativo via IVPrismaUI1
│   ├── CMakeLists.txt
│   └── src/ (main.cpp, PCH.h, PrismaUI_API.h)
└── tests/                       # Testes automatizados Jest (28 testes unitários cobrindo todo o sistema)
```

---

## 2. Resolução Dinâmica de Perks (`PerkResolver`)

As perks **não dependem de ordem fixa de carregamento (load order)** nem de índices rígidos. O `PerkResolver` implementa uma esteira de tolerância a falhas (*Fallback Chain*):

1. **Cache Local em Memória**: Acelera consultas repetidas.
2. **Estratégia 1 (Local ID + Plugins Candidatos)**:
   - Utiliza `Game.getFormFromFile(localId, plugin)`.
   - Testa uma lista prioritária de plugins (`Vokrii - Minimalistic Perks of Skyrim.esp`, `Vokrii.esp`, `Vokrii.esl`, `Skyrim.esm`). Se a load order mudar ou o mod for renomeado, a perk continua sendo resolvida.
3. **Estratégia 2 (Editor ID & Aliases)**:
   - Se o plugin mudar de nome ou o FormID local variar entre versões, pesquisa por aliases de Editor ID.
4. **Estratégia 3 (Varredura Semântica)**:
   - Busca pelo nome canônico em registros do tipo `PERK`.
5. **Estratégia 4 (Fallback Seguro / Mock Determinístico)**:
   - Garante que testes unitários e execuções em modo de desenvolvimento rodem sem travar a interface.

---

## 3. Duas Interfaces Distintas

O sistema conta com duas telas dedicadas:

### A. SELEÇÃO DE CLASSES (`selection.html`)
- **Fidelidade Visual**: Réplica fiel do design de referência (`INTERFACE DE CLASSES.jfif`).
- **18 Classes em 3 Arquétipos**:
  - **Conjuradores (0/6)**: Mago Puro, Bruxo, Feiticeiro, Necromante, Conjurador Bélico, Mago de Batalha.
  - **Guerreiros (0/6)**: Cavaleiro, Cruzado, Bárbaro, Guerreiro Nórdico, Paladino, Algoz.
  - **Especialistas (0/6)**: Assassino, Ladino, Ranger (Curta Distância), Monge, Arqueiro (Sniper), Viper (Veneno).
- **Emblemas Duplos**: Ícone de classe na lateral esquerda e brasão estilizado na lateral direita para cada classe.
- **Validação de Matrícula**: Classes conjuradoras exigem a palavra-chave de RP `AlunoColegioWinterhold`. Se ausente, a seleção é bloqueada com aviso pedagógico.
- **Botão Único de Seleção**: Rodapé com botão único de confirmação ("CONFIRMAR SELEÇÃO") sincronizado com o card selecionado.
- **Modo de Pré-Visualização**: Botão "PRÉ-VISUALIZAR CLASSE" permitindo que o jogador inspecione todos os 8 estágios, perks e feitiços de qualquer classe antes de decidir.

### B. PAINEL DA CLASSE (`panel.html`)
- **Ativação**: Pressione a tecla **[K]** durante o jogo.
- **Identidade**: Exibe o arquétipo, nome da classe, nível atual (1 a 40) e barra de progresso de EXP.
- **Distribuição de Atributos**:
  - Cada nível concede **+15 pontos** de atributos (totalizando **585 pontos** no nível 40).
  - Distribuidor interativo configurado para alocação estritamente em **passos de 5 em 5** para **Vida**, **Magia** e **Vigor**, com validação no servidor.
- **Roadmap de 8 Estágios**:
  - Estágio 1 (Nível 1), Estágio 2 (Nível 5), Estágio 3 (Nível 10), Estágio 4 (Nível 15), Estágio 5 (Nível 20), Estágio 6 (Nível 25), Estágio 7 (Nível 30), Estágio 8 (Nível 35).
  - Cada estágio exibe as perks desbloqueadas, com nome e descrição explicativa em PT-BR.
- **Feitiços Autorizados**:
  - **Os feitiços NÃO são concedidos automaticamente pelo sistema de classes.**
  - São listados estritamente como *Feitiços Autorizados*, acompanhados pelo banner **ROLEPLAY OBRIGATÓRIO** informando que o personagem deve aprendê-los organicamente no mundo (através do Colégio de Winterhold, comerciantes de grimórios ou mentores).
  - Os nomes e descrições dos feitiços são editáveis através do arquivo `config/spells-descriptions.json`.
- **Reset de Classe e Loja de Tickets**:
  - **Nível 1 a 15**: Reset gratuito e irrestrito.
  - **Nível 16 a 40**: Exige posse do item/ticket `Ticket de Troca de Classe` (`hasResetTicket`).
  - Botão dedicado **"Comprar Ticket de Troca de Classe"** que redireciona diretamente para `https://aetherius.net.br/`.

---

## 4. Como Editar as Descrições e Nomes em Português (PT-BR)

As explicações dos efeitos das perks, dos feitiços e as classes foram isoladas nos arquivos de configuração:
- 📂 `sistema-classes/config/classes-config.json` (Classes, arquétipos, estágios e feitiços autorizados)
- 📂 `sistema-classes/config/perks-descriptions.json` (Perks e habilidades em PT-BR)
- 📂 `sistema-classes/config/spells-descriptions.json` (Feitiços e grimórios em PT-BR)
- 📂 `sistema-classes/config/perk-mappings.json` (Mapeamentos de FormIDs e plugins de runtime)

Qualquer membro da equipe ou designer pode alterar os textos diretamente em `config/`:

```json
{
  "Flames": {
    "name": "Flames",
    "namePt": "Chamas",
    "tier": "Novato",
    "descriptionPt": "Dispara uma rajada de fogo que causa 8 de dano por segundo. Alvos em chamas sofrem dano adicional ao longo do tempo."
  }
}
```

### Como a Interface Consome e Atualiza os JSONs:
1. **Ambiente CEF / Skyrim Platform (`file:///`)**:
   - Para evitar restrições de CORS e requisições bloqueadas pelo Chromium do jogo, os dados são compilados de forma segura em `ui/js/embedded-data.js`.
2. **Ambiente Web / Preview (`http://` ou `https://`)**:
   - O componente `ui/js/data-loader.js` detecta o ambiente web e realiza `fetch` assíncrono em tempo real de `ui/data/*.json`, aplicando alterações imediatamente sem necessidade de reiniciar.
3. **Sincronização Automática**:
   - Ao rodar `npm run build`, `npm test` ou `npm run preview`, o script `npm run sync-data` é executado automaticamente (`prebuild` e `pretest`), garantindo que:
     - `config/*.json` é validado estruturalmente e relacionalmente (0 links quebrados).
     - As cópias em `dist/config/` e `ui/data/` são atualizadas.
     - O arquivo `ui/js/embedded-data.js` é regenerado instantaneamente.
   - Para sincronizar manualmente a qualquer momento, execute: `npm run sync-data`.

---

## 5. Fórmulas de Leveling e XP de Combate

Implementação estrita das regras da planilha `AETHERIUS - Classes, efeitos, encantamentos.xlsx`:

### Curva de XP (Níveis 1 a 40)
- Nível 1 → 2: 200 XP (Rápida)
- Nível 5 → 6: 1.000 XP (Média)
- Nível 10 → 11: 4.100 XP (Lenta)
- Nível 20 → 21: 23.000 XP (Muito Lenta)
- Nível 30 → 31: 77.000 XP (Extremamente Lenta)
- Nível 39 → 40: 198.500 XP (Total acumulado: 1.848.000 XP)

### XP por Abate
- **Inimigos Regulares (Nível 1 a 20)**:
  $$\text{XP} = \text{Base} \times (1 + (\text{Nível} - 1) \times 0.20) \times \text{Mod}_{\Delta} \times \text{Mod}_{\text{Party}}$$
- **Inimigos com Soft Cap (Nível 21 a 40)**:
  $$\text{XP} = \text{Base} \times (4.80 + (\text{Nível} - 20) \times 0.05) \times \text{Mod}_{\Delta} \times \text{Mod}_{\text{Party}}$$
- **Chefes Épicos (Recompensa Fixa)**:
  - **Dragão (todas as variantes)**: 1.000 XP fixos $\times \text{Mod}_{\text{Party}}$.
  - **Dragon Priest (Sacerdote do Dragão)**: 500 XP fixos $\times \text{Mod}_{\text{Party}}$.
  - Chefes épicos ignoram o nível do monstro e o Delta de nível.

### Modificador de Party e Raid
- **Solo**: 100% (1.00).
- **Party Normal (2 a 8 membros)**: Redução de 5% por membro (2 membros = 0.90, 8 membros = 0.60).
- **Raid (8 a 20 membros)**: Escala decrescente de 60% (8 membros) até 40% (20 membros).
- **Raio de Compartilhamento**: 5.000 unidades de distância euclidiana e obrigatoriedade de estar na **mesma célula/mundo**.

### Sistema de Cansaço Diário (Apenas Níveis 15 a 40)
- **Níveis 1 a 14**: O sistema de cansaço **NÃO existe** para nenhuma classe. O ganho de XP é livre e irrestrito.
- **A partir do Nível 15**: O jogador só pode acumular no máximo **20% do valor total da experiência respectiva ao seu nível atual** por ciclo diário.
  - *Exemplo*: No nível 15 (requer 10.800 XP), o limite diário é de 2.160 XP.
  - *Exemplo*: No nível 26 (requer 50.000 XP), o limite diário é de 10.000 XP.
- **Reset Diário**: Ocorre pontualmente às **06:00 da manhã (Horário de Brasília, UTC-3 / 09:00 UTC)**, liberando a trava de cansaço e renovando a cota de 20% do nível.

---

## 6. Sistema de Grupos (Party) e Raids

- **Grupo Normal**: Suporta de 2 a 8 jogadores.
- **Conversão para Raid**: O líder pode converter um grupo de 8 em Raid para até 20 jogadores.
- **4 Subgrupos de Raid**: Capacidade máxima de 5 membros por subgrupo. O líder pode mover membros entre subgrupos 1, 2, 3 e 4.
- **HUD Integrado**: Monitora a vida, magia, vigor e sinaliza visualmente se o aliado está fora do raio de 5.000 unidades.

---

## 7. Instalação e Execução

### Pré-requisitos
- Node.js v18+
- Skyrim Special Edition / Anniversary Edition
- Skyrim Platform ou Prisma UI instalado

### 1. Compilar o Projeto
```bash
cd "c:\Code\Aetherius - SkyMP\sistema-classes"
npm install
npm run build
npm test
```

### 2. Instalação no Servidor SkyMP
1. Copie a pasta compilada `dist/server` e `dist/shared` para o diretório de scripts do seu servidor SkyMP (`server-data/scripts/`).
2. Copie a pasta `config/` para o diretório de dados do servidor.
3. No script de inicialização do SkyMP, importe `dist/server/index.js`.

### 3. Instalação no Cliente Skyrim Platform
1. Copie o arquivo gerado `dist/client/index.js` (ou empacotado) para:
   `Skyrim/Data/Platform/Plugins/AetheriusClassesClient.js`

### 4. Instalação da Interface PRISMA UI
Copie o conteúdo da pasta `sistema-classes/ui/` para:
`Skyrim/Data/PrismaUI/views/AetheriusClasses/`

Estrutura final no jogo:
```
Skyrim/Data/PrismaUI/views/AetheriusClasses/
├── index.html
├── selection.html
├── panel.html
├── css/
├── js/
└── assets/
```

### 5. Teclas de Atalho
- **[K]**: Abre o Painel de Classe (se tiver classe) ou Seleção de Classes (se não tiver).
- **[ESC]**: Fecha a interface e devolve o controle imediato ao jogo.
