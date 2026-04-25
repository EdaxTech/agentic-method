---
name: design-solution
description: Desenhar a arquitetura da solução com o usuário no Modo Setup, depois que o intake terminou. Cobre os checkpoints 5–6 — desenho do workflow (etapas, executores, fluxo de dados) e critérios do crítico específicos do domínio. A saída desta skill é a entrada do checkpoint 7 (scaffold).
---

# design-solution — desenho da arquitetura (checkpoints 5–6)

Você usa esta skill durante o Modo Setup, depois que `intake` aprovou os checkpoints 1–4. Os arquivos `config/sipoc.md`, `config/inputs-spec.md` e `config/deliverables-spec.md` já existem — leia-os antes de começar.

> **Idioma.** Adapte os exemplos de fala para o que estiver em `config/language.md`. Os arquivos gerados seguem o idioma de artefatos.

## Princípio orientador

Esta skill traduz o "**P**" do SIPOC (alto nível) em uma arquitetura concreta de etapas com executores nomeados — e produz o catálogo do que o checkpoint 7 (`scaffold`) vai gerar.

**Resista a duas tentações:**

1. **Excesso de granularidade.** Uma skill por linha de código não ajuda ninguém. Combine etapas que pertencem juntas conceitualmente.
2. **Reuso falso.** Se uma etapa cabe num executor genérico ("processar arquivo"), provavelmente você ainda não entendeu a etapa. Volte e detalhe — o valor desta pasta vem de executores realmente sob medida.

---

## Checkpoint 5 — Desenho do workflow

**Objetivo.** Produzir `config/workflow.md` com a sequência de etapas que transformam insumos em entregável, e o catálogo de skills/subagentes a gerar.

### Como conduzir

1. **Releia o contexto.** Carregue `config/sipoc.md`, `config/inputs-spec.md`, `config/deliverables-spec.md`. Mantenha o "P" do SIPOC à mão.
2. **Proponha um esboço primeiro.** Não pergunte ao usuário "quais etapas você quer?" — proponha um desenho de 3 a 7 etapas com base no SIPOC e nos specs, e devolva pedindo crítica:
   *"Olhando os insumos e o entregável, eu desenharia o fluxo assim: [etapa 1] → [etapa 2] → ... O que mudaria?"*
3. **Decida executor por etapa** usando a heurística abaixo.
4. **Itere com o usuário** até aprovação. Mostre o `workflow.md` final antes do "posso seguir".

### Heurística: skill ou subagente?

Para cada etapa, pergunte-se:

| Use **subagente** quando... | Use **skill** quando... |
|---|---|
| A etapa precisa de contexto isolado (não poluir o chat principal). | A etapa é um procedimento/transformação claro, com inputs e outputs definidos. |
| Envolve julgamento aberto (analisar, sintetizar, redigir). | É determinística ou quase (validar schema, calcular variações, formatar saída). |
| Lê e produz vários arquivos, com idas-e-vindas. | Roda em um pulso, devolve um artefato. |
| Pode rodar em paralelo com outras etapas. | É linear no fluxo. |

Quando estiver em dúvida: **skill é mais barato**. Subagentes têm custo de contexto e devem ser justificados.

**Combine** quando faz sentido — não crie uma skill `validate-inputs` e outra `clean-inputs` se elas sempre rodam juntas; faça `prepare-inputs` e ponto.

### Convenção de nomes

- Skills: verbo no infinitivo, kebab-case curto. Ex.: `prepare-inputs`, `compute-indicators`, `render-report`.
- Subagentes: substantivo de papel, kebab-case curto. Ex.: `analyst`, `editor`, `reviewer`.
- Pastas de saída intermediária: `runs/<run>/10-analises/<nome-da-etapa>/`.

### Template do `config/workflow.md`

```markdown
# Workflow — <título do caso de uso>

## Visão geral
<1–2 parágrafos descrevendo o fluxo end-to-end, em prosa>

## Etapas

### 1. <nome da etapa>
- **Executor:** skill `<nome>` _(a gerar)_ | subagente `<nome>` _(a gerar)_
- **Consome:** `runs/<run>/00-insumos/...` ou saída da etapa anterior
- **Produz:** `runs/<run>/10-analises/<n>-<nome>/<arquivo>`
- **Descrição:** <o que essa etapa faz, em 2–4 frases — concreto, não genérico>

### 2. ...

## Fluxo entre etapas
<descreva dependências, paralelismos, e qualquer condicional>

## Artefatos a gerar (entrada do checkpoint 7)

| Tipo | Nome | Propósito (1 frase) |
|------|------|---------------------|
| skill | <nome> | ... |
| subagente | <nome> | ... |

_Aprovado em: <data ISO>_
```

**Checkpoint:** *"Esse workflow representa o fluxo que você quer? Posso passar para os critérios do crítico?"*

---

## Checkpoint 6 — Critérios do crítico

**Objetivo.** Produzir `config/critic-criteria.md` com critérios de revisão **específicos do domínio**.

### Divisão de responsabilidade

O subagente `critic` (parte do template-mãe) já vem com **critérios universais** embutidos:
- As conclusões seguem dos dados apresentados?
- Premissas e limitações estão explícitas?
- Os números batem entre si (totais, percentuais, comparações)?
- Há gaps entre o que foi pedido em `deliverables-spec.md` e o que foi entregue?

`config/critic-criteria.md` complementa esses universais com regras **deste caso de uso**, que o `critic` deve aplicar **adicionalmente** em todo Runtime.

### Como conduzir

1. **Resgate os "critérios de pronto"** que o usuário deu no checkpoint 4 (`deliverables-spec.md`, seção 4) — eles são candidatos diretos a critérios do crítico, mas reformule-os para ficarem checáveis (ex.: "está bom" → "todo indicador apresentado tem variação MoM e YoY ao lado").
2. **Pergunte por regras de domínio.** *"Há regras específicas do seu domínio que toda execução deve obedecer? Coisas que, se faltarem, automaticamente reprovam o entregável."* Probe:
   - Métricas obrigatórias?
   - Comparações que sempre devem aparecer (período anterior, ano anterior, meta)?
   - Tratamentos para dados faltantes (silenciar é aceitável? deve ser sinalizado?)?
   - Formatações fixas (ordem de seções, casas decimais, unidades)?
3. **Reescreva como critérios checáveis.** Cada critério deve ser uma frase que o `critic` consiga verificar olhando o entregável. Evite "ser claro", prefira "cada seção começa com TL;DR de 1 frase".

### Template do `config/critic-criteria.md`

```markdown
# Critérios do crítico — específicos do domínio

> Estes critérios complementam os universais embutidos no subagente `critic`. O `critic` aplica os dois conjuntos em todo Runtime.

## Origem
- Critérios de pronto declarados no checkpoint 4.
- Regras de domínio levantadas no checkpoint 6.

## Critérios

1. <critério checável, em uma frase>
2. ...

## Tratamento de violação
- <"Reprovar e devolver para nova rodada" | "Sinalizar no entregável e seguir" | regra mista>

_Aprovado em: <data ISO>_
```

**Checkpoint:** *"Critérios aprovados. Posso passar para a skill `scaffold` gerar os arquivos?"*

---

## Ao terminar

Você cobriu os checkpoints 5–6. Devem existir e estar aprovados:
- `config/workflow.md` (com a tabela "Artefatos a gerar")
- `config/critic-criteria.md`

Prossiga para a skill `scaffold` (checkpoint 7), usando a tabela de artefatos como entrada principal.

## Quando o usuário pede para voltar

Mesmo padrão da `intake`: se o usuário pedir ajuste em um checkpoint anterior, anuncie a volta, edite o arquivo correspondente, atualize a data de aprovação, e siga.
