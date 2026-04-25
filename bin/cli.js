#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const PKG_ROOT = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(PKG_ROOT, 'template');

// Itens copiados do template-mãe para a pasta da instância (CWD).
// Generated artifacts (criados pelo Edax no Setup) ficam ao lado mas com nomes diferentes.
const TEMPLATE_ITEMS = [
  { src: 'CLAUDE.md',                              dest: 'CLAUDE.md' },
  { src: '.claude/agents/critic.md',               dest: '.claude/agents/critic.md' },
  { src: '.claude/skills/intake',                  dest: '.claude/skills/intake', dir: true },
  { src: '.claude/skills/design-solution',         dest: '.claude/skills/design-solution', dir: true },
  { src: '.claude/skills/scaffold',                dest: '.claude/skills/scaffold', dir: true },
  { src: '.claude/skills/new-run',                 dest: '.claude/skills/new-run', dir: true },
  { src: '.claude/commands/edax-setup.md',         dest: '.claude/commands/edax-setup.md' },
  { src: '.claude/commands/edax-run.md',           dest: '.claude/commands/edax-run.md' },
  { src: '.claude/commands/edax-review.md',        dest: '.claude/commands/edax-review.md' },
];

const EMPTY_DIRS = ['config', 'runs'];

const args = process.argv.slice(2);
const cmd = args[0];
const flags = new Set(args.slice(1));
let force = flags.has('--force') || flags.has('-f');

function log(msg)  { process.stdout.write(msg + '\n'); }
function warn(msg) { process.stderr.write('warn: ' + msg + '\n'); }
function die(msg)  { process.stderr.write('error: ' + msg + '\n'); process.exit(1); }

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyItem(srcAbs, destAbs, isDir) {
  ensureDir(path.dirname(destAbs));
  if (isDir) {
    fs.cpSync(srcAbs, destAbs, { recursive: true, force: true });
  } else {
    fs.copyFileSync(srcAbs, destAbs);
  }
}

function installToCwd() {
  const cwd = process.cwd();
  log(`agentic-method → instalando template em ${cwd}`);

  for (const item of TEMPLATE_ITEMS) {
    const srcAbs  = path.join(TEMPLATE_DIR, item.src);
    const destAbs = path.join(cwd, item.dest);

    if (!fs.existsSync(srcAbs)) {
      die(`arquivo de template ausente no pacote: ${item.src}`);
    }

    if (fs.existsSync(destAbs) && !force) {
      log(`  [skip] ${item.dest}  (já existe — use --force ou \`update\` para sobrescrever)`);
      continue;
    }

    copyItem(srcAbs, destAbs, !!item.dir);
    log(`  [ok]   ${item.dest}`);
  }

  for (const d of EMPTY_DIRS) {
    const p = path.join(cwd, d);
    if (!fs.existsSync(p)) {
      ensureDir(p);
      log(`  [ok]   ${d}/`);
    } else {
      log(`  [skip] ${d}/  (já existe)`);
    }
  }

  log('');
  log('Pronto. Abra o Claude Code nesta pasta e diga "Edax, vamos começar" (ou rode `/edax-setup`).');
  log('Se já havia uma sessão aberta aqui, reinicie-a — agentes/skills só são lidos na inicialização.');
}

function help() {
  log(`@edaxtech/agentic-method — template para assistentes especialistas no Claude Code

Uso:
  npx github:EdaxTech/agentic-method install [--force]
      Instala o template-mãe (Edax, critic, skills do Setup, slash commands)
      DENTRO da pasta atual. Faça uma vez por caso de uso. Use --force se já
      houver instalação anterior aqui que você queira sobrescrever.

  npx github:EdaxTech/agentic-method update
      Alias de \`install --force\`. Atualiza os arquivos do template-mãe
      desta pasta para a versão mais recente do repo. Não toca em config/,
      runs/, ou nos arquivos gerados pelo Edax no Setup.

  npx github:EdaxTech/agentic-method help
      Mostra esta ajuda.

Fluxo típico:
  mkdir meu-caso && cd meu-caso
  npx github:EdaxTech/agentic-method install
  claude        # abra o Claude Code aqui e diga "Edax, vamos começar"

Cada caso de uso é uma pasta independente — não há instalação user-level
nem state global. Para iniciar outro caso de uso, repita em outra pasta.
`);
}

switch (cmd) {
  case 'install':
    installToCwd();
    break;
  case 'update':
    force = true;
    installToCwd();
    break;
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    help();
    break;
  default:
    warn(`comando desconhecido: ${cmd}`);
    help();
    process.exit(1);
}
