---
name: intake
description: Conduzir a entrevista de descoberta e levantamento de requisitos com o usuário no Modo Setup. Cobre os checkpoints 1–4 — enquadramento do problema, SIPOC, spec de insumos, spec de entregáveis. Use técnicas de elicitação ativa (reformulação, exemplos concretos, casos de borda) — não é um formulário.
---

# intake — entrevista de descoberta (checkpoints 1–4)

Você usa esta skill durante o Modo Setup para conduzir os primeiros quatro checkpoints com o usuário: enquadrar o problema, mapear o SIPOC, e detalhar os specs de insumos e entregáveis.

> **Nota sobre idioma.** Os exemplos de fala abaixo estão em PT-BR. Adapte para o idioma definido em `config/language.md`. Os arquivos gerados (`config/*.md`) seguem o **idioma de artefatos** registrado lá.

## Princípio orientador

**Não é formulário, é entrevista.** Um formulário não consegue resolver problemas reais. Sua tarefa aqui é construir, junto com o usuário, um entendimento profundo o suficiente para que o resto do sistema (workflow, scaffolds, crítico) seja realmente útil — não um wrapper genérico sobre prompts vagos.

Use estas técnicas em todos os checkpoints:

- **Reformulação ativa.** *"Deixe-me devolver o que entendi: ___ — é isso?"* — antes de avançar.
- **Exemplos concretos.** Sempre que possível, peça ao usuário para colar/anexar um exemplo real, em vez de descrever em abstrato.
- **Casos de borda.** *"O que acontece quando ___?"* — vazio, ausente, atípico, muito grande, errado.
- **Linha de base atual.** *"Como você faz isso hoje? Onde mais dói?"* — alinha o futuro com a dor real.
- **Stakeholders.** *"Quem mais depende disso? Quem precisa aprovar?"*

Nunca dispare mais de uma pergunta de cada vez. Espere a resposta, reformule, e só então a próxima.

---

## Checkpoint 1 — Enquadramento do problema

**Objetivo.** Sair com uma síntese curta (2–3 frases) do problema, aprovada pelo usuário. Esta síntese vai como introdução do `config/sipoc.md` no checkpoint 2.

Conduza nesta ordem, adaptando:

1. Pergunta aberta: *"Conta para mim, com suas palavras, o problema ou tarefa que você quer transformar em assistente recorrente."*
2. Escute. Reformule. Não conclua de cara.
3. Probe (escolha as relevantes para o caso):
   - O que dispara a necessidade? (mensal? evento? demanda?)
   - Como você faz isso hoje? Há um processo manual?
   - O que é mais doloroso ou demorado no jeito atual?
   - Há sub-problemas ou variações que valem ser tratados separadamente?
   - É um sintoma de algo maior, ou já é a causa raiz?
4. Devolva a síntese: *"Então o que vamos automatizar é: ___. Está fiel?"*
5. **Checkpoint:** *"Posso seguir para o SIPOC, ou quer ajustar essa formulação?"*

---

## Checkpoint 2 — SIPOC

**Objetivo.** Produzir `config/sipoc.md` — visão de uma página: quem fornece, o que entra, o processo macro, o que sai, quem consome.

Construa a tabela junto com o usuário, **uma coluna de cada vez**:

| Coluna | Pergunta-âncora | Detalhe a buscar |
|--------|-----------------|------------------|
| **S — Suppliers** | "De onde vêm os insumos? Quem ou que sistema produz?" | Pessoa, sistema, pasta, API, o próprio usuário em conversa. |
| **I — Inputs** | "O que exatamente chega? Em que formato?" | Alto nível aqui — detalhes vão no checkpoint 3. |
| **P — Process** | "Em 3 a 7 etapas, o que precisa acontecer com os insumos para virar entregável?" | Macro-passos. Sem código. |
| **O — Outputs** | "O que sai no fim? Em que forma?" | Alto nível — detalhes no checkpoint 4. |
| **C — Customers** | "Quem usa o que sai? Para tomar que decisão?" | O próprio usuário, equipe, cliente externo. |

Grave em `config/sipoc.md` neste template:

```markdown
# SIPOC — <título do caso de uso>

> <síntese aprovada no checkpoint 1>

| S — Suppliers | I — Inputs | P — Process | O — Outputs | C — Customers |
|---|---|---|---|---|
| ... | ... | 1. ...<br>2. ...<br>3. ... | ... | ... |

_Aprovado em: <data ISO>_
```

**Checkpoint:** *"Esse SIPOC representa bem o caso de uso? Posso aprofundar nos insumos?"*

---

## Checkpoint 3 — Spec de insumos

**Objetivo.** Produzir `config/inputs-spec.md` com tudo que você precisa saber para receber e validar os insumos em Runtime.

Cubra estes pontos **em conversa, não como questionário**:

- **Formato.** CSV? Planilha (.xlsx)? PDF? Texto/Markdown? Conversa? Múltiplos formatos coexistem?
- **Origem.** Onde os insumos estarão? Pasta local (`runs/.../00-insumos/`?), upload na conversa, link externo, sistema?
- **Estrutura/schema.** Para dados estruturados: nomes de colunas/campos, tipos, exemplo de linha. Para texto: estrutura esperada (seções, marcadores).
- **Volume e frequência.** Quantos arquivos por execução? Quantos registros típicos? Pode passar de GB?
- **Pré-condições.** Já vem limpo? Precisa de normalização manual antes? Há um passo humano antes de chegar?
- **Casos de borda.** Dados faltando, formatos diferentes ao longo do tempo, valores inesperados — como tratar?
- **Exemplo concreto.** Peça: *"Você consegue colar/anexar agora um exemplo real (do mês passado, p.ex.) para eu validar o que entendi?"*

Grave em `config/inputs-spec.md` com seções:

```markdown
# Spec de insumos

## 1. Formato e origem
...

## 2. Estrutura / schema
...

### Exemplo
...

## 3. Volume e frequência
...

## 4. Pré-condições
...

## 5. Tratamento de casos de borda
...

_Aprovado em: <data ISO>_
```

**Checkpoint:** *"Esse spec de insumos está fiel? Posso seguir para os entregáveis?"*

---

## Checkpoint 4 — Spec de entregáveis

**Objetivo.** Produzir `config/deliverables-spec.md`. **Default de formato = Markdown** se o usuário não disser outra coisa.

Cubra:

- **Formato de saída.** MD (default), planilha, PDF, JSON, mais de um?
- **Estrutura.** Seções, tabelas, gráficos, anexos. Peça um esqueleto: *"Imagine o entregável pronto: que seções ele tem, na ordem?"*
- **Audiência.** Quem vai ler? Afeta tom (técnico vs. executivo) e nível de detalhe.
- **Periodicidade da entrega.** Mensal? Sob demanda? Casa com a frequência dos insumos?
- **Critérios de pronto.** *"Como você sabe que o entregável saiu bom? O que faria você rejeitar e pedir refazer?"* — guarde essa resposta, ela alimenta o `critic-criteria.md` no checkpoint 6.
- **Baseline atual.** Se já existe versão feita à mão, peça para colar/anexar — vira referência para o scaffold.

Grave em `config/deliverables-spec.md`:

```markdown
# Spec de entregáveis

## 1. Formato e periodicidade
- Formato: <MD por default | outro>
- Periodicidade: ...

## 2. Estrutura (esqueleto)
1. Seção ...
2. Seção ...
...

## 3. Audiência e tom
...

## 4. Critérios de pronto
- ...
- ...

## 5. Baseline atual
<colado / anexado / "não há">

_Aprovado em: <data ISO>_
```

**Checkpoint:** *"Spec de entregáveis aprovado. Posso passar a bola para a skill `design-solution` desenhar o workflow e os critérios do crítico?"*

---

## Ao terminar

Você cobriu os checkpoints 1–4. Os arquivos `config/sipoc.md`, `config/inputs-spec.md` e `config/deliverables-spec.md` devem estar gravados e aprovados. Prossiga para a skill `design-solution` (checkpoints 5–6).

## Quando o usuário pede para voltar

Se em qualquer ponto o usuário disser *"espera, no anterior na verdade..."*, volte e edite o arquivo do checkpoint anterior. Anuncie sempre: *"vamos retornar ao checkpoint X"*; e ao reaprovar, *"voltamos ao checkpoint Y"*. Mantenha a `_Aprovado em:_` atualizada quando reeditar.
