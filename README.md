# agentic-method

Template para transformar tarefas profissionais recorrentes em **assistentes especialistas reutilizáveis** dentro do [Claude Code](https://claude.com/claude-code).

A ideia: você tem um trabalho que se repete (análise mensal de indicadores, revisão de contratos, fechamento de campanha, ...). Você cria uma pasta para o caso de uso, instala o template ali dentro, e conversa com o orquestrador **Edax Maximus Andres I** (intimamente, **Edax**) sobre o problema. Ao fim do diálogo, aquela pasta vira um assistente que executa esse trabalho para você sob demanda — com rastreabilidade, revisão crítica e estrutura de auditoria.

> 📖 **Manual completo do usuário**: [`docs/MANUAL.md`](docs/MANUAL.md) — passo a passo, fluxos com diagramas, walkthrough de exemplo, dicas e solução de problemas.

---

## Início rápido

```bash
mkdir indicadores-mensais
cd indicadores-mensais
npx github:EdaxTech/agentic-method install
claude          # abra o Claude Code aqui
```

E na conversa: *"Edax, vamos começar."* (ou rode `/edax-setup`).

> **Por que `github:` em vez de `@edaxtech/...`?** O pacote vive direto no GitHub, sem publicação no npm registry. O prefixo `github:` faz o `npx` baixar do repo. Se uma sessão do Claude Code já estava aberta nesta pasta, **reinicie-a** depois do install — instruções e skills só são lidas na inicialização.

A partir daí, Edax detecta automaticamente em qual modo operar:

- **Setup** — primeira vez. Conduz a entrevista (9 checkpoints com aprovação), e gera os agentes/skills específicos do seu problema.
- **Runtime** — depois de configurado. Cria nova execução em `runs/`, processa insumos, chama o crítico, entrega o resultado.

Para iniciar **outro** caso de uso, repita o `install` em outra pasta. Cada caso de uso é uma instância **independente** — sem state global, sem contaminação de outros projetos no Claude Code.

### Atualizar uma instância

```bash
cd indicadores-mensais
npx github:EdaxTech/agentic-method update
```

Sobrescreve apenas os arquivos do template-mãe na pasta. Não toca em `config/`, `runs/`, ou nos arquivos que Edax gerou no Setup.

---

## Como funciona, em uma frase

Um workspace que opera em **dois modos**: no **Setup**, Edax te entrevista no padrão SIPOC e gera as skills/subagentes específicos do seu caso de uso. No **Runtime**, esse caso de uso já configurado é executado a cada nova rodada (mensal, sob demanda, etc.).

Detalhes: [`docs/MANUAL.md`](docs/MANUAL.md).

---

## Princípios do desenho

- **Customização real, não wrappers genéricos.** No checkpoint 7 do Setup, Edax gera arquivos `.md` específicos do seu problema — não parametriza prompts vagos. Vale a complexidade extra para que a solução resolva de verdade.
- **Aprovação passo a passo.** Nenhum checkpoint avança sem você confirmar.
- **Rastreabilidade.** Cada artefato gerado entra em `config/generated-manifest.md`. Cada execução preserva insumos, análises, revisão crítica e entregável em sua própria pasta. Reprocessamento cria `-v2/`, nunca sobrescreve.
- **Revisão crítica embutida.** O subagente `critic` aplica 8 critérios universais (fidelidade aos dados, consistência, premissas explícitas, cobertura vs. spec, tratamento de faltantes, reprodutibilidade, calibração, escopo) somados aos critérios do seu domínio.
- **Idioma escolhido pelo usuário.** O Setup pergunta dois idiomas (conversa e artefatos). Tudo respeita essa escolha.
- **Instância isolada.** Sem state global em `~/.claude/`. Cada caso de uso é uma pasta autônoma — pode ser zipada e enviada a outra pessoa, versionada em git, ou apagada sem afetar outros projetos.

---

## O que este template **não** é

- **Não é um framework de orquestração genérico.** É opinativo sobre o ciclo SIPOC → workflow → revisão → entrega.
- **Não roda fora do Claude Code.** Skills, subagentes e slash commands são primitivas do Claude Code.
- **Não substitui julgamento humano.** Aprovações em Setup e revisão de entregáveis em Runtime são pontos onde você decide.

---

## Documentação

- [📖 **Manual completo do usuário**](docs/MANUAL.md) — referência detalhada
- [Releases](https://github.com/EdaxTech/agentic-method/releases) — novidades por versão
- [Issues](https://github.com/EdaxTech/agentic-method/issues) — reportar bug ou propor melhoria

---

## Iterando o template

Para evoluir o template-mãe: clone este repo, mexa em `template/` ou em `docs/MANUAL.md`, e abra um PR — ou faça fork e use `npx github:seu-fork/agentic-method install` nas suas instâncias.

Tudo que Edax gera nas instâncias fica isolado em cada pasta de caso de uso e não conflita com o template-mãe.

---

## Licença

[MIT](./LICENSE)
