---
name: write-manual
description: Gera (ou regenera) `MANUAL.md` na raiz da instância — documentação operacional da solução, escrita para o usuário final/operador, no idioma de artefatos. Use no CP9.5 do Setup (depois do scaffold aprovado) e SEMPRE que qualquer arquivo em `config/` for alterado depois do Setup ter terminado.
---

# write-manual — manual da solução desta instância

Você usa esta skill para produzir o `MANUAL.md` que vive na **raiz** desta instância — o cara que qualquer pessoa abre primeiro ao receber a pasta.

## Quem é o leitor (regra de ouro)

O leitor é **o operador da solução**, não você. Pode ser:

- O próprio usuário, dois meses depois, esquecido dos detalhes.
- Um colega que recebeu a pasta zipada.
- Alguém de outra equipe que vai assumir a tarefa recorrente.

Linguagem **clara, sem jargão do template-mãe** (sem "checkpoint", "scaffold", "subagente", "skill"). Prosa amigável. Exemplos concretos.

> **Idioma.** Use o **idioma de artefatos** registrado em `config/language.md`. Se o operador tem perfil técnico baixo, prefira frases curtas e analogias.

## Quando regenerar

| Situação | O que fazer |
|---|---|
| CP9.5 do Setup (primeira geração) | Pergunte ao usuário: *"Gerar agora o `MANUAL.md` desta solução? (recomendado)"* — se sim, gere. |
| Usuário pediu ajuste em qualquer arquivo de `config/` depois do Setup | Regenere automaticamente ao final do ajuste e avise: *"Atualizei também o `MANUAL.md` para refletir essa mudança."* |
| Slash command `/edax-manual` | Sempre regenere, sem perguntar. |
| Ajuste em arquivo gerado de `.claude/agents/<gerado>/` ou `.claude/skills/<gerado>/` | Regenere apenas se a mudança afetar o que está documentado (workflow, etapas, comportamento operacional). |

## Inputs que você lê

Sempre, em ordem:

1. `config/language.md` — para escolher o idioma e o tom.
2. `config/sipoc.md` — síntese do problema + tabela SIPOC.
3. `config/inputs-spec.md` — o que o operador precisa entregar.
4. `config/deliverables-spec.md` — o que o operador vai receber.
5. `config/workflow.md` — etapas do processamento.
6. `config/critic-criteria.md` — regras de qualidade do domínio.
7. `config/generated-manifest.md` — lista das skills/subagentes gerados (para a seção "Como o assistente processa", se útil).

Se algum estiver ausente, pare: o Setup não foi concluído, não há solução para documentar.

## Estrutura do `MANUAL.md` a gerar

Use exatamente esta estrutura. Adapte os títulos para o idioma de artefatos.

```markdown
# Manual — <Nome curto do caso de uso>

> <Síntese do problema em 1–2 frases, retirada da abertura do `config/sipoc.md` e reformulada em prosa amigável.>

---

## O que este assistente faz

<2–4 parágrafos em prosa explicando, em alto nível, o que esta solução automatiza. Use a tabela SIPOC como base, mas NÃO cole a tabela aqui — narre. Mencione a periodicidade (mensal, sob demanda, etc.) extraída de `deliverables-spec.md`.>

---

## Como operar

Para disparar uma execução, abra o Claude Code nesta pasta e:

```
/edax-run <rótulo>
```

Onde `<rótulo>` é o identificador da rodada — para tarefas mensais, use `YYYY-MM` (ex.: `2026-04`); para casos pontuais, use algo como `campanha-q2`. Se omitir, Edax pergunta.

Você também pode dizer em linguagem natural: *"Edax, vamos rodar o fechamento de abril."*

---

## O que entregar (insumos)

<Reformulado de `inputs-spec.md` em linguagem operacional. Inclua:>
- **O que enviar** (formato e conteúdo, em prosa)
- **De onde tirar** (origem)
- **Quando** (frequência)
- **Como entregar** — três jeitos: anexar arquivo na conversa do Claude Code; colar conteúdo; apontar uma pasta local
- **Cuidados** — pré-condições e casos de borda extraídos do spec

<Se o spec tem exemplo de schema, inclua aqui em bloco de código.>

---

## O que você recebe (entregáveis)

<Reformulado de `deliverables-spec.md`. Inclua:>
- **Formato** do entregável final
- **Onde encontrar**: `runs/<rótulo>/30-entregaveis/`
- **Estrutura** (esqueleto das seções)
- **Audiência** prevista
- **Critérios de "pronto"** (quando considerar que o entregável saiu bem)

---

## Como o assistente processa

<Liste as etapas de `workflow.md` em prosa, sem jargão técnico. Para cada etapa: 1 frase do que ela faz e onde a saída intermediária aparece (`runs/<rótulo>/10-analises/...`). Não diga "skill X" ou "subagente Y" — diga "uma etapa que faz Z".>

Cada etapa salva sua saída em `runs/<rótulo>/10-analises/`, deixando trilha completa do que foi feito.

---

## Critérios de qualidade aplicados

Antes de entregar, um revisor automático checa o trabalho usando dois conjuntos de critérios:

**Universais** (sempre aplicados):
- Os números batem entre si (totais, percentuais, comparações)
- As conclusões seguem dos dados (sem invenção)
- Premissas estão explícitas (lacunas, normalizações, cortes)
- Tudo que foi pedido está no entregável (cobertura)
- Dados faltantes são sinalizados, nunca silenciados
- O raciocínio é reproduzível (dado → cálculo → conclusão)
- A linguagem é calibrada (forte só onde a evidência sustenta)
- Nada de fora do escopo

**Deste caso de uso específico:**

<Liste os critérios de `critic-criteria.md`, reformulados em frases checáveis e operacionais.>

A cada execução, o revisor produz um veredicto em `runs/<rótulo>/20-avaliacao-critica/verdict.md`:
- **APROVADO** — segue para entrega
- **APROVADO COM RESSALVAS** — segue, com observações incorporadas no entregável
- **BLOQUEADO** — corrigir antes de entregar

---

## Onde tudo fica

```
.
├── MANUAL.md                          ← este documento
├── CLAUDE.md                          ← instruções internas do Edax (não editar)
├── config/                            ← configurações desta solução (raramente mexer)
└── runs/
    └── <rótulo>/                      ← uma pasta por execução
        ├── _run.md                    ← metadados e status
        ├── 00-insumos/                ← os arquivos que você entregou
        ├── 10-analises/               ← processamento intermediário
        ├── 20-avaliacao-critica/      ← veredicto + achados do revisor
        └── 30-entregaveis/            ← entregável final ✨
```

Reprocessamento (mesmo rótulo, insumo corrigido) cria pasta `<rótulo>-v2/`, `-v3/`, ... A versão anterior fica preservada para auditoria.

---

## Problemas conhecidos / pontos de atenção

<Extraído da seção "casos de borda" de `inputs-spec.md` e reformulado em prosa. Cada caso vira um bullet com: o sintoma, e a ação esperada.>

---

## Como pedir mudança no assistente

Se a solução precisar evoluir (mudou o formato dos insumos, o entregável precisa de seção nova, etc.):

```
/edax-setup
```

Edax retoma a entrevista no checkpoint que precisa ajuste. Toda alteração em `config/` regenera este `MANUAL.md` automaticamente.

Para regenerar este manual sem mexer em config:

```
/edax-manual
```

---

## Quem mantém este assistente

Esta solução foi construída sobre o template `agentic-method` ([github.com/EdaxTech/agentic-method](https://github.com/EdaxTech/agentic-method)). Para atualizar o template-mãe nesta pasta:

```
npx github:EdaxTech/agentic-method update
```

Não toca em `config/`, em `runs/`, nem nos arquivos específicos desta solução.

---

_Manual gerado em <data ISO>. Última atualização: <data ISO>._
```

## Regras de qualidade

1. **Não copie configs literalmente.** Reformule. Tabela SIPOC vira parágrafo. Lista de bullets de spec vira prosa com exemplos.
2. **Sem jargão do template** ("checkpoint", "scaffold", "skill", "subagente", "intake", "design-solution") aparecendo no manual final. Substitua por equivalentes operacionais.
3. **Exemplos concretos** sempre que possível. Se inputs-spec tem schema, mostre. Se deliverables-spec tem baseline, referencie.
4. **Mantenha a data de geração** no rodapé. Quando regenerar (auto ou via comando), atualize "Última atualização".
5. **Releia antes de gravar.** Pergunta-teste: *"alguém que nunca mexeu nessa pasta consegue operar a partir só deste arquivo?"* Se não, melhore.

## Quando NÃO regenerar

- Quando o usuário só pediu para rodar uma execução nova (`/edax-run`) — o MANUAL não muda só porque rodou de novo.
- Quando o usuário editou um arquivo de `runs/<run>/...` (correção de uma análise específica) — é local da run, não muda a solução.
- Quando o usuário editou um arquivo gerado de `.claude/agents/` ou `.claude/skills/` mas a mudança é só de implementação interna, sem afetar o que está documentado no MANUAL.
