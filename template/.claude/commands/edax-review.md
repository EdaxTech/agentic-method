---
description: Reinvoca o subagente `critic` sobre uma run específica (ou a mais recente) para uma nova passada de revisão.
argument-hint: "[nome da run, ex.: 2026-04 — vazio = run mais recente]"
---

Invoque o subagente **critic** (`.claude/agents/critic.md`) diretamente.

Alvo da revisão:
- Se `$ARGUMENTS` for fornecido: `runs/$ARGUMENTS/`
- Se vazio: identifique a run mais recente em `runs/` (ordem alfabética decrescente — o padrão de nomeação `YYYY-MM[-vN]` ordena cronologicamente).

Instrução ao critic: *"Revise os artefatos desta run. Se já existir uma `verdict.md`/`findings.md` anterior, mova para `20-avaliacao-critica/passada-N/` antes de sobrescrever, conforme as regras da sua skill. Foque a revisão de acordo com o que existir: se há draft em `30-entregaveis/`, faça revisão pós-render; senão, revisão pré-entregável das `10-analises/`."*
