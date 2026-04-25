---
name: scaffold
description: Gerar os arquivos `.md` de skills e subagentes específicos do caso de uso, no checkpoint 7 do Setup do Edax. Lê a tabela "Artefatos a gerar" de `config/workflow.md` e cria, com aprovação por arquivo, cada skill e cada subagente. Atualiza `config/generated-manifest.md`. Não toca em arquivos do template-mãe.
---

# scaffold — geração dos artefatos do caso de uso (checkpoint 7)

Você usa esta skill no Modo Setup, depois que `design-solution` aprovou os checkpoints 5–6. Aqui você materializa, em arquivos `.md`, o que foi planejado.

> **Idioma.** Os arquivos gerados seguem o **idioma de artefatos** registrado em `config/language.md` — pode diferir do idioma da conversa.

## Princípio orientador

Você está escrevendo **código que vai existir e operar**. Cada arquivo gerado aqui vai ser carregado em sessões reais, eventualmente por outros profissionais. Qualidade conta:
- **Descrições do frontmatter dizem QUANDO invocar**, não o que o artefato faz.
- **Instruções são concretas**, citam caminhos reais (`runs/<run>/10-analises/<n>-<nome>/`), e referenciam os configs (`config/inputs-spec.md` etc.) quando relevante.
- **Sem TODOs sobrando, sem "..." de placeholder.** Se você não tem informação para preencher uma seção, pergunte ao usuário antes de gerar.

---

## Pré-requisitos (verifique antes de começar)

Devem existir e estar aprovados:
- `config/sipoc.md`
- `config/inputs-spec.md`
- `config/deliverables-spec.md`
- `config/workflow.md` — a tabela **"Artefatos a gerar"** é sua entrada principal
- `config/critic-criteria.md`
- `config/language.md`

Se faltar algum, **pare e devolva o controle ao Edax**: o checkpoint anterior não foi cumprido.

---

## Pipeline do scaffold

### Etapa A — confirmação do manifesto

1. Releia a tabela "Artefatos a gerar" do `workflow.md`.
2. Apresente ao usuário a lista consolidada com tipo, nome, caminho onde será criado, e propósito em 1 linha.
3. Cheque conflitos: nenhum nome pode colidir com os arquivos do template-mãe (ver "Não tocar" abaixo).
4. **Checkpoint:** *"Vou gerar esses N arquivos, nesta ordem. Posso começar?"*

### Etapa B — geração arquivo a arquivo

Para cada artefato, na ordem da lista:

1. **Anuncie:** *"Vou gerar agora a skill/subagente `<nome>` em `<caminho>`. Propósito: <propósito>."*
2. **Construa o conteúdo** usando o template apropriado (abaixo) e os configs como fonte de verdade. Especialmente:
   - Cite caminhos reais de input/output baseados na etapa correspondente do `workflow.md`.
   - Referencie `config/*.md` quando o artefato precisa consultar specs em runtime.
3. **Crie o arquivo.**
4. **Mostre o conteúdo gerado** ao usuário.
5. **Checkpoint por arquivo:** *"Esse `<nome>` ficou bom? Posso seguir para o próximo, ou quer ajustar?"*
6. Se houver ajuste, edite e mostre novamente. Só siga após "ok".
7. **Atualize `config/generated-manifest.md`** (template abaixo).

### Etapa C — revisão final

Quando todos estiverem criados:
1. Liste todos os arquivos gerados.
2. *"Scaffold completo. Quer revisar algum arquivo antes de encerrar o Setup?"*
3. Se o usuário pedir ajustes finais, edite e atualize a data de modificação no manifest.
4. Devolva o controle ao Edax para o checkpoint 8 (dry-run, se aplicável) ou 9 (encerramento).

---

## Templates

### Template para skill gerada — `.claude/skills/<nome>/SKILL.md`

```markdown
---
name: <kebab-case-curto>
description: <Quando invocar esta skill, em 1–2 frases. Concreto ao caso de uso. Inclua o gatilho típico (ex.: "Use ao iniciar uma execução do workflow X, depois de receber os insumos do mês em runs/<run>/00-insumos/").>
---

# <nome> — <papel curto>

<1 parágrafo: como esta skill se encaixa no workflow geral, referenciando `config/workflow.md`.>

## Inputs
- `<caminho concreto>` — <descrição>
- (referências de spec: `config/inputs-spec.md`)

## Outputs
- `<caminho concreto>` — <descrição>

## Procedimento
1. <passo concreto>
2. <passo concreto>
3. ...

## Critérios de qualidade desta etapa
- <critério checável>
- <critério checável>

## Quando algo der errado
- <caso conhecido + tratamento>
```

### Template para subagente gerado — `.claude/agents/<nome>.md`

```markdown
---
name: <kebab-case-curto>
description: <Quando invocar este subagente, em 1–2 frases. Inclua o gatilho típico no workflow (ex.: "Use depois que `compute-indicators` terminar, para sintetizar a análise narrativa do mês a partir de runs/<run>/10-analises/").>
---

# <nome> — <papel>

<1 parágrafo: missão e papel deste subagente no workflow.>

## Sua missão
<2–3 frases concretas. Não use "ajudar a", "auxiliar com" — diga o que produz.>

## Inputs que você recebe
- `<caminho>` — <descrição>
- Specs de referência: `config/sipoc.md`, `config/deliverables-spec.md`

## O que você produz
- `<caminho>` — <descrição do artefato e formato>

## Como operar
1. <passo>
2. <passo>
3. ...

## Princípios
- <princípio específico do papel>
- <princípio específico do papel>
```

---

## Regras de qualidade dos artefatos gerados

Ao construir cada arquivo, garanta:

1. **Frontmatter parseável.** YAML válido, `name` em kebab-case, `description` em uma única linha (sem quebras).
2. **Description forte.** Diz **quando invocar** (gatilho + contexto), não apenas o que faz. Exemplo ruim: "Skill que processa dados". Exemplo bom: "Use ao iniciar a execução mensal, depois que os CSVs de vendas estão em `runs/<run>/00-insumos/`. Valida schema, normaliza datas e produz dataset limpo em `10-analises/01-prepared/`."
3. **Caminhos concretos.** Use os caminhos reais do workflow, não placeholders abstratos.
4. **Sem placeholders sobrando.** Nada de `<TODO>`, `...`, `aqui você completa`. Se faltar informação, pergunte ao usuário antes de gerar.
5. **Referências cruzadas.** Quando o artefato precisar consultar um spec em runtime, cite o caminho do spec (ex.: "consulte `config/inputs-spec.md` para o schema esperado").
6. **Tom imperativo, segunda pessoa** ("você faz X"), consistente com as outras skills do template.

Após gerar, **releia o arquivo uma vez** com essas regras em mente — corrija antes de mostrar ao usuário.

---

## Onde escrever, e onde nunca

Você escreve em `.claude/agents/<nome>.md` e `.claude/skills/<nome>/SKILL.md` desta pasta — **ao lado** dos arquivos do template-mãe que já estão lá. A distinção é por nome de arquivo.

**Nomes reservados ao template-mãe (não use):** `edax`, `critic`, `intake`, `design-solution`, `scaffold`, `new-run`. Os arquivos correspondentes em `.claude/agents/`, `.claude/skills/` e `.claude/commands/` (com prefixo `edax-`) são geridos pelo `npx github:EdaxTech/agentic-method update`, não por você.

Se algum nome proposto na tabela de artefatos colidir com um desses, **pare na etapa A** e peça ao usuário (via Edax) para renomear o artefato no `workflow.md` — sobrescrever um arquivo do template quebraria o próprio Edax.

---

## Template do `config/generated-manifest.md`

Crie o arquivo se ainda não existir, com esta estrutura. A cada arquivo gerado, adicione uma linha:

```markdown
# Manifest de artefatos gerados

> Tudo que o `scaffold` (ou edições subsequentes) criou neste workspace, fora os arquivos do template-mãe.

| Tipo | Nome | Caminho | Propósito | Criado em | Última edição |
|------|------|---------|-----------|-----------|---------------|
| skill | <nome> | `.claude/skills/<nome>/SKILL.md` | <1 frase> | <data ISO> | — |
| subagente | <nome> | `.claude/agents/<nome>.md` | <1 frase> | <data ISO> | — |
```

Ao editar um arquivo já gerado (ajuste pedido pelo usuário), atualize a coluna "Última edição".

---

## Quando o usuário pede ajuste depois da geração

Mesmo padrão das outras skills: anuncie a volta, edite o arquivo, atualize "Última edição" no manifest, mostre, peça aprovação, siga.
