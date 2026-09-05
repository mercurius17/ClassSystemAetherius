# Auditoria Técnica — Aetherius Class System

Data: 2026-09-05

## Escopo

Revisão estática e dinâmica do núcleo TypeScript, interface web, plugin Prisma UI, contratos do SkyrimPlatform e documentação do SkyMP presentes no workspace. A suíte automatizada e a compilação TypeScript foram executadas após as correções.

## Correções aplicadas

- Validação estrita de pacotes antes de acessar payloads, IDs ou números.
- Bloqueio de alocação negativa, fracionária, infinita ou `NaN` de atributos.
- Reinicialização completa do ciclo de cansaço ao selecionar ou resetar classe.
- Processamento de XP por nível, impedindo que um prêmio grande no nível 14 contorne o limite diário a partir do nível 15.
- Rejeição de XP inválida e normalização do nível de inimigos.
- XP base e classificação de dragão/sacerdote determinadas pelo bestiário do servidor, não pelos campos reportados pelo cliente.
- Identidade obrigatória da vítima e deduplicação de abates por jogador durante dez minutos.
- Convites de party com IDs sem colisão, revalidação na aceitação e autorização na recusa.
- Expulsão limitada a membros reais e atualização de stats protegida contra valores inválidos.
- Conversão para raid somente com oito membros e acesso público seguro à party por ID.
- Eventos corrigidos para os contratos reais do SkyrimPlatform: `buttonEvent` e `deathStart`.
- Escape de conteúdo dinâmico nos cards de classes, perks, magias e membros da party, reduzindo risco de injeção de HTML.
- Licença do pacote alinhada ao arquivo `LICENSE` (GPL-3.0-only).

## Riscos remanescentes

### Crítico — transporte SkyMP inexistente

O cliente usa `mp.events.callRemote`/`mp.events.add`, APIs ausentes na referência do SkyMP incluída no workspace. O contrato documentado é `mp.makeEventSource` + `ctx.sendEvent`. O roteador `SkyMPClassServer.handleClientPacket` não é registrado em nenhum event source e, isoladamente, não recebe pacotes reais.

### Crítico — bridge Prisma UI incompleto

O plugin C++ abre a view e apenas registra em log as ações `onClassAction`. O `PrismaUIBridge` presumido pelo TypeScript não é exposto automaticamente pelo Prisma UI. Assim, UI, servidor e aplicação de perks não formam hoje um fluxo de ponta a ponta.

### Alto — autoridade do abate ainda depende do cliente

A deduplicação e o catálogo autoritativo reduzem fraude simples, mas nome, nível e ID da vítima ainda chegam do cliente. Em produção, o servidor deve derivar o abate de eventos/estado autoritativos do SkyMP e usar o ID do ator do servidor.

### Alto — estado de party é somente memória

Parties, raids e convites desaparecem ao reiniciar o processo. Isso pode ser desejável para sessões, mas precisa ser explicitamente decidido e acompanhado por handlers de conexão/desconexão para atualizar `isOnline` e dissolver grupos órfãos.

### Médio — aplicação de perks após recarga

O cliente acompanha apenas as perks aplicadas na instância atual. Após reiniciar o plugin, perks antigas podem não ser removidas por um reset porque o mapa local perdeu a autoria. A solução deve persistir os IDs gerenciados ou reconciliar um conjunto completo de perks de classe sem remover perks obtidas por outros sistemas.

### Médio — sincronização de atributos

`setActorValue` em Health/Magicka/Stamina precisa de teste dentro do Skyrim para garantir que sincronizações repetidas não restaurem recursos atuais ou sobrescrevam modificadores de outros mods. Prefira reconciliar o valor base/modificador gerenciado, preservando dano e efeitos temporários.

## Próxima etapa recomendada

Escolher um único caminho de implantação:

1. Prisma UI nativo: bridge C++ ↔ eventos SkyMP, retorno de estado e aplicação nativa de perks/atributos.
2. Browser do SkyrimPlatform: remover o plugin Prisma redundante e implementar `makeEventSource`/`ctx.sendEvent` com propriedades de resposta.

Depois, criar um teste de integração dentro do jogo cobrindo seleção, reconexão, abate, level-up, reset, party e raid. Os testes Jest validam o domínio, mas não substituem esse teste de runtime.
