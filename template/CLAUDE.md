# agentic-method — instância

Esta pasta é uma **instância** do template `agentic-method`. O template-mãe (orquestrador **Edax Maximus Andres I**, subagente `critic`, skills do Setup e slash commands) está instalado em `~/.claude/` via `npx @edaxtech/agentic-method install` — não precisa estar aqui.

Esta pasta contém apenas o que é específico deste caso de uso: as configs do Setup (`config/`), as execuções (`runs/`), e — depois do Setup — as skills/subagentes que Edax gerar para o seu problema (`.claude/agents/`, `.claude/skills/`).

## Como usar

Invoque o subagente **edax** (carregado automaticamente da instalação user-level). Ele detecta em qual modo operar:

- **Setup** — quando `config/sipoc.md` ainda não existe. Edax conduz uma entrevista SIPOC passo-a-passo, com sua aprovação a cada etapa, e gera ao fim os agentes/skills/configs específicos do seu problema.
- **Runtime** — quando o Setup já foi concluído. Edax cria nova sub-pasta em `runs/`, processa os insumos pelo workflow definido, chama o subagente `critic` para revisão e entrega o resultado em `30-entregaveis/`.

## Estrutura desta instância

```
config/            — preenchido no Setup (SIPOC, specs, workflow, critic-criteria, manifest)
runs/              — uma sub-pasta por execução (YYYY-MM, YYYY-MM-v2 se reprocessada)
.claude/agents/    — subagentes que Edax gerar para este caso de uso
.claude/skills/    — skills que Edax gerar para este caso de uso
```

## Para começar

Em uma nova conversa, peça: *"Edax, vamos começar."* — ou rode `/edax-setup`.

## Atualizar o template-mãe

```
npx @edaxtech/agentic-method update
```

Reinstala edax/critic/skills/commands em `~/.claude/`. Não toca em nada desta pasta de instância.
