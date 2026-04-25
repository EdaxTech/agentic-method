---
name: new-run
description: Criar a estrutura de pastas para uma nova execução do workflow no Modo Runtime. Usa o padrão configurado em `config/workflow.md` (default `runs/YYYY-MM/`); se a pasta já existir, cria `YYYY-MM-v2/`, `v3/`, ... preservando a anterior. Também cria as sub-pastas `00-insumos/`, `10-analises/`, `20-avaliacao-critica/`, `30-entregaveis/` e um `_run.md` com metadados.
---

# new-run — criar nova execução (Runtime)

Você usa esta skill no início de toda execução em Modo Runtime, antes de receber os insumos.

> **Idioma.** Os arquivos gerados (notavelmente `_run.md`) seguem o idioma de artefatos em `config/language.md`.

## Procedimento

### 1. Determinar o nome da run

1. Leia `config/deliverables-spec.md` (seção "Periodicidade") e/ou `config/workflow.md` para descobrir o padrão.
2. Padrões aceitos:
   - **Mensal:** `YYYY-MM` (ex.: `2026-04`)
   - **Diário:** `YYYY-MM-DD`
   - **Sob demanda:** `YYYY-MM-DD-<slug-curto>` — peça o slug ao usuário (ex.: "campanha-q2")
3. Se o padrão não estiver claro, pergunte ao usuário em uma frase única: *"Que rótulo essa execução deve ter? (sugestão: `<padrão>`)"*

### 2. Verificar colisão e versionar

1. Se `runs/<nome>/` **não existe**, use o nome direto.
2. Se **existe**, NÃO sobrescreva. Crie `runs/<nome>-v2/`. Se essa também existir, `v3/`, `v4/`, ...
3. Anuncie ao usuário: *"Pasta `<nome>` já existia, criando `<nome>-vN/` para preservar a execução anterior."*

### 3. Criar a estrutura

Crie estas pastas vazias (use `mkdir -p`):

```
runs/<nome-final>/
├── 00-insumos/
├── 10-analises/
├── 20-avaliacao-critica/
└── 30-entregaveis/
```

### 4. Criar `_run.md` com metadados

Em `runs/<nome-final>/_run.md`:

```markdown
# Run — <nome-final>

- **Iniciada em:** <data ISO + hora>
- **Padrão de nomeação:** <mensal | diário | sob-demanda>
- **Versão:** <v1 | v2 | ...>
- **Workflow:** ver `config/workflow.md`
- **Status:** iniciada

## Histórico

- <data hora> — run criada por `new-run`.
```

A coluna **Status** será atualizada por outras etapas conforme a run avança (`insumos-recebidos`, `analises-em-andamento`, `revisao-critica`, `entregue`, `entregue-com-ressalvas`, `bloqueada`). Você é responsável por mantê-la atualizada.

### 5. Pedir os insumos ao usuário

Anuncie: *"Run `<nome-final>` criada. Estrutura pronta em `runs/<nome-final>/`. Pode me passar os insumos (anexar arquivos, colar conteúdo, ou apontar uma pasta) para colocar em `00-insumos/`."*

## Quando NÃO usar esta skill

- Quando o usuário quer **revisar uma run anterior** — use os arquivos existentes em `runs/<nome-anterior>/`.
- Quando o usuário quer **corrigir uma run em andamento** — não crie nova; ajuste os artefatos da run atual.
- Quando o usuário quer **reprocessar com insumos novos** — aí sim, nova run (provavelmente `-vN`).
