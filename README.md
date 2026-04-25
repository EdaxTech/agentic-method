# agentic-method

Template para transformar tarefas profissionais recorrentes em **assistentes especialistas reutilizáveis** dentro do [Claude Code](https://claude.com/claude-code).

A ideia: você tem um trabalho que se repete (análise mensal de indicadores, revisão de contratos, fechamento de campanha, ...). Você cria uma pasta para o caso de uso, instala o template ali dentro, e conversa com o orquestrador **Edax Maximus Andres I** (intimamente, **Edax**) sobre o problema. Ao fim do diálogo, aquela pasta vira um assistente que executa esse trabalho para você sob demanda — com rastreabilidade, revisão crítica e estrutura de auditoria.

---

## Instalar e usar

```bash
mkdir indicadores-mensais
cd indicadores-mensais
npx github:EdaxTech/agentic-method install
claude          # abra o Claude Code aqui
```

E na conversa: *"Edax, vamos começar."* (ou rode `/edax-setup`).

> **Por que `github:` em vez de `@edaxtech/...`?** O pacote vive direto no GitHub, sem publicação no npm registry. O prefixo `github:` faz o `npx` baixar do repo. Se uma sessão do Claude Code já estava aberta nesta pasta, **reinicie-a** depois do install — agentes/skills só são lidos na inicialização.

A partir daí, Edax detecta automaticamente em qual modo operar:

- **Setup** — primeira vez. Conduz a entrevista, com aprovação a cada etapa, e gera os agentes/skills específicos do seu problema.
- **Runtime** — depois de configurado. Cria nova execução em `runs/`, processa insumos, chama o crítico, entrega o resultado.

Para iniciar **outro** caso de uso, repita o `install` em outra pasta. Cada caso de uso é uma instância **independente** — sem state global, sem contaminação de outros projetos no Claude Code.

### Atualizar uma instância para a versão mais recente

```bash
cd indicadores-mensais
npx github:EdaxTech/agentic-method update
```

Sobrescreve apenas os arquivos do template-mãe na pasta. Não toca em `config/`, `runs/`, ou nos arquivos que Edax gerou no Setup.

---

## Conceito em uma frase

Um workspace que opera em **dois modos**: no **Setup**, Edax te entrevista no padrão SIPOC e gera as skills/subagentes específicos do seu caso de uso. No **Runtime**, esse caso de uso já configurado é executado a cada nova rodada (mensal, sob demanda, etc.).

---

## O fluxo do Setup (9 checkpoints)

| # | Pergunta-âncora | Onde grava |
|---|-----------------|------------|
| 0 | Em que idioma vamos trabalhar? E os artefatos? | `config/language.md` |
| 1 | Qual problema você quer transformar em rotina? | (síntese aprovada) |
| 2 | Quem fornece, o que entra, processo macro, o que sai, quem consome? (SIPOC) | `config/sipoc.md` |
| 3 | Detalhes dos insumos: formato, origem, schema, frequência, casos de borda | `config/inputs-spec.md` |
| 4 | Detalhes dos entregáveis: formato (default Markdown), estrutura, audiência, critérios de pronto | `config/deliverables-spec.md` |
| 5 | Etapas do workflow e quem executa cada uma (skill ou subagente) | `config/workflow.md` |
| 6 | Que critérios o crítico deve aplicar especificamente neste domínio? | `config/critic-criteria.md` |
| 7 | Geração dos arquivos `.md` das skills/subagentes desenhados | `.claude/skills/<nome>/`, `.claude/agents/<nome>.md`, `config/generated-manifest.md` |
| 8 | (Opcional) Dry-run com um insumo de exemplo | `runs/setup-dryrun/` |
| 9 | Encerramento. A partir daqui, próximas chamadas entram em Runtime. | — |

Você pode voltar a qualquer checkpoint anterior a qualquer momento.

---

## O fluxo do Runtime

A cada execução, Edax:

1. Cria `runs/YYYY-MM/` (ou `YYYY-MM-v2/` se a anterior já existir — preserva auditoria).
2. Recebe os insumos e os arquiva em `00-insumos/`.
3. Executa as etapas do workflow, gravando saídas intermediárias em `10-analises/`.
4. Invoca o subagente **critic** com critérios universais + de domínio. Saída em `20-avaliacao-critica/` (`verdict.md` + `findings.md`).
5. Gera o entregável final em `30-entregaveis/` conforme spec, incorporando ressalvas do critic.
6. Apresenta o resultado e pergunta se há ajustes.

---

## Estrutura de uma instância

```
~/trabalhos/indicadores-mensais/
├── CLAUDE.md                         ← template — É a identidade do Edax (system prompt)
├── .claude/
│   ├── agents/
│   │   ├── critic.md                 ← template (subagente, invocado em Runtime)
│   │   └── <gerados>.md              ← criados pelo Edax no Setup
│   ├── skills/
│   │   ├── intake/                   ← template
│   │   ├── design-solution/          ← template
│   │   ├── scaffold/                 ← template
│   │   ├── new-run/                  ← template
│   │   └── <gerados>/                ← criados pelo Edax no Setup
│   └── commands/
│       ├── edax-setup.md             ← template
│       ├── edax-run.md               ← template
│       └── edax-review.md            ← template
├── config/                           ← preenchido no Setup
│   ├── language.md
│   ├── sipoc.md
│   ├── inputs-spec.md
│   ├── deliverables-spec.md
│   ├── workflow.md
│   ├── critic-criteria.md
│   └── generated-manifest.md
└── runs/
    └── YYYY-MM[-vN]/
        ├── _run.md
        ├── 00-insumos/
        ├── 10-analises/
        ├── 20-avaliacao-critica/
        └── 30-entregaveis/
```

**Onde mora o Edax:** o `CLAUDE.md` da pasta É o system prompt do Edax — não há subagente separado. Quando você abre o Claude Code aqui, o agente principal carrega essas instruções e passa a operar como Edax. Para conversa fluida e contínua (em vez do padrão de subagente "uma rodada e retorna").

A distinção entre **template** e **gerado** é por nome: `CLAUDE.md`, `critic`, `intake`, `design-solution`, `scaffold`, `new-run`, `edax-setup`, `edax-run`, `edax-review` são template (gerenciados pelo `update`); qualquer outro nome em `.claude/` foi criado pelo Edax e pode ser editado livremente.

---

## Slash commands (disponíveis dentro de uma instância)

| Comando | Quando usar |
|---------|-------------|
| `/edax-setup` | Configurar o workspace para um novo caso de uso (ou retomar Setup parcial). |
| `/edax-run [rótulo]` | Disparar nova execução. Rótulo opcional (ex.: `/edax-run 2026-04` ou `/edax-run campanha-q2`); se omitido, Edax pergunta. |
| `/edax-review [run]` | Reinvocar o critic sobre uma run específica (ou a mais recente). Útil após edição manual de análises. |

---

## Princípios do desenho

- **Customização real, não wrappers genéricos.** No checkpoint 7, Edax gera arquivos `.md` específicos do seu problema — não parametriza prompts vagos. Vale a complexidade extra para que a solução resolva de verdade.
- **Aprovação passo a passo.** Nenhum checkpoint avança sem você confirmar. Toda geração de arquivo passa por revisão antes do próximo.
- **Rastreabilidade.** Cada artefato gerado entra em `config/generated-manifest.md`. Cada execução preserva insumos, análises, revisão crítica e entregável em sua própria pasta. Reprocessamento cria `-v2/`, nunca sobrescreve.
- **Revisão crítica embutida.** O subagente `critic` aplica 8 critérios universais (fidelidade aos dados, consistência, premissas explícitas, cobertura vs. spec, tratamento de faltantes, reprodutibilidade, calibração, escopo) somados aos critérios do seu domínio.
- **Idioma escolhido pelo usuário.** O Setup pergunta dois idiomas (conversa e artefatos). Tudo respeita essa escolha — não é hard-coded em PT.
- **Instância isolada.** Sem state global em `~/.claude/`. Cada caso de uso é uma pasta autônoma — pode ser zipada e enviada a outra pessoa, versionada em git, ou apagada sem afetar outros projetos.

---

## O que este template **não** é

- **Não é um framework de orquestração genérico.** É opinativo sobre o ciclo SIPOC → workflow → revisão → entrega. Se sua tarefa não cabe nesse molde, considere outra abordagem.
- **Não roda fora do Claude Code.** Skills, subagentes e slash commands são primitivas do Claude Code. Para execução via API/SDK, seria preciso adaptar.
- **Não substitui julgamento humano.** Aprovações em Setup e revisão de entregáveis em Runtime são pontos onde você decide.

---

## Iterando o template

Para evoluir o template-mãe: clone este repo, mexa em `template/`, e abra um PR — ou faça fork e use `npx github:seu-fork/agentic-method install` nas suas instâncias.

Tudo que Edax gera nas instâncias fica isolado em cada pasta de caso de uso e não conflita com o template-mãe.

---

## Licença

[MIT](./LICENSE)
