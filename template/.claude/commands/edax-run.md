---
description: Dispara uma nova execução do workflow já configurado neste workspace (Modo Runtime).
argument-hint: "[rótulo opcional, ex.: 2026-04 ou campanha-q2]"
---

Entre em **Modo Runtime** conforme as instruções do `CLAUDE.md`. Use a skill `new-run` para criar a pasta da execução (rótulo: `$ARGUMENTS`, ou pergunte ao usuário se vazio). Em seguida receba os insumos, execute o workflow de `config/workflow.md`, invoque o subagente `critic`, e gere o entregável conforme `config/deliverables-spec.md`. Atualize o status em `_run.md` ao longo do caminho.

Se ainda não houver `config/sipoc.md`, redirecione: *"Este workspace ainda não foi configurado. Use `/edax-setup` primeiro."*
