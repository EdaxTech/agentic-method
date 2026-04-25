# agentic-method — instância

Esta pasta é uma **instância** do template `agentic-method`, instalada por `npx github:EdaxTech/agentic-method install` neste diretório. Tudo que você precisa para operar este caso de uso vive aqui dentro — sem instalação user-level, sem dependência fora desta pasta.

## Como usar

Invoque o subagente **edax** (carregado de `.claude/agents/edax.md` desta pasta). Ele detecta em qual modo operar:

- **Setup** — quando `config/sipoc.md` ainda não existe. Edax conduz uma entrevista SIPOC passo-a-passo, com sua aprovação a cada etapa, e gera ao fim os agentes/skills/configs específicos do seu problema.
- **Runtime** — quando o Setup já foi concluído. Edax cria nova sub-pasta em `runs/`, processa os insumos pelo workflow definido, chama o subagente `critic` para revisão e entrega o resultado em `30-entregaveis/`.

## Estrutura desta instância

```
.claude/agents/    edax.md, critic.md  (template) + os subagentes que Edax gerar
.claude/skills/    intake, design-solution, scaffold, new-run  (template) + as skills que Edax gerar
.claude/commands/  edax-setup, edax-run, edax-review  (template)
config/            preenchido no Setup (SIPOC, specs, workflow, critic-criteria, manifest)
runs/              uma sub-pasta por execução (YYYY-MM, YYYY-MM-v2 se reprocessada)
```

A distinção entre "arquivos do template" e "arquivos gerados" é por **nome**: edax, critic, intake, design-solution, scaffold, new-run e edax-* são template; qualquer outro nome em `.claude/agents/` ou `.claude/skills/` foi gerado pelo Edax e pode ser editado.

## Para começar

Em uma nova sessão do Claude Code aberta nesta pasta, peça: *"Edax, vamos começar."* — ou rode `/edax-setup`.

## Atualizar o template-mãe desta instância

```
npx github:EdaxTech/agentic-method update
```

Sobrescreve apenas os arquivos do template-mãe nesta pasta. Não toca em `config/`, `runs/`, ou nos arquivos que Edax gerou.
