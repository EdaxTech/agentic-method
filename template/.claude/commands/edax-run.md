---
description: Dispara uma nova execução do workflow já configurado neste workspace (Modo Runtime do Edax).
argument-hint: "[rótulo opcional, ex.: 2026-04 ou campanha-q2]"
---

Invoque o subagente **edax** (`~/.claude/agents/edax.md`, instalado via `npx github:EdaxTech/agentic-method install`).

Diga a ele: *"Entre em Modo Runtime. Use a skill `new-run` para criar a pasta da execução (rótulo: $ARGUMENTS, ou pergunte se vazio). Depois receba os insumos do usuário, execute o workflow definido em `config/workflow.md`, invoque o subagente `critic`, e gere o entregável conforme `config/deliverables-spec.md`. Atualize o status em `_run.md` ao longo do caminho."*

Se ainda não houver `config/sipoc.md`, redirecione: *"Este workspace ainda não foi configurado. Use `/edax-setup` primeiro."*
