#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const PKG_ROOT = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(PKG_ROOT, 'template');

const TEMPLATE_ITEMS = [
  { src: '.claude/agents/edax.md',                  dest: '.claude/agents/edax.md' },
  { src: '.claude/agents/critic.md',                dest: '.claude/agents/critic.md' },
  { src: '.claude/skills/intake',                   dest: '.claude/skills/intake', dir: true },
  { src: '.claude/skills/design-solution',          dest: '.claude/skills/design-solution', dir: true },
  { src: '.claude/skills/scaffold',                 dest: '.claude/skills/scaffold', dir: true },
  { src: '.claude/skills/new-run',                  dest: '.claude/skills/new-run', dir: true },
  { src: '.claude/commands/edax-setup.md',          dest: '.claude/commands/edax-setup.md' },
  { src: '.claude/commands/edax-run.md',            dest: '.claude/commands/edax-run.md' },
  { src: '.claude/commands/edax-review.md',         dest: '.claude/commands/edax-review.md' },
];

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

function installToUser() {
  const userClaude = path.join(os.homedir(), '.claude');
  ensureDir(userClaude);

  log(`agentic-method → instalando template-mãe em ${userClaude}`);

  for (const item of TEMPLATE_ITEMS) {
    const srcAbs  = path.join(TEMPLATE_DIR, item.src);
    const destAbs = path.join(userClaude, item.dest.replace(/^\.claude\//, ''));

    if (!fs.existsSync(srcAbs)) {
      die(`arquivo de template ausente no pacote: ${item.src}`);
    }

    if (fs.existsSync(destAbs) && !force) {
      log(`  [skip] ${item.dest}  (já existe — use --force para sobrescrever)`);
      continue;
    }

    copyItem(srcAbs, destAbs, !!item.dir);
    log(`  [ok]   ${item.dest}`);
  }

  log('');
  log('Pronto. Em qualquer pasta nova, rode `npx github:EdaxTech/agentic-method init` e depois `/edax-setup`.');
}

function initInCwd() {
  const cwd = process.cwd();
  log(`agentic-method → preparando instância em ${cwd}`);

  // CLAUDE.md
  const claudeSrc  = path.join(TEMPLATE_DIR, 'CLAUDE.md');
  const claudeDest = path.join(cwd, 'CLAUDE.md');
  if (fs.existsSync(claudeDest) && !force) {
    log('  [skip] CLAUDE.md  (já existe — use --force para sobrescrever)');
  } else {
    fs.copyFileSync(claudeSrc, claudeDest);
    log('  [ok]   CLAUDE.md');
  }

  // empty dirs for the instance
  for (const d of ['config', 'runs', '.claude/agents', '.claude/skills']) {
    const p = path.join(cwd, d);
    if (!fs.existsSync(p)) {
      ensureDir(p);
      log(`  [ok]   ${d}/`);
    } else {
      log(`  [skip] ${d}/  (já existe)`);
    }
  }

  log('');
  log('Pronto. Abra o Claude Code aqui e rode `/edax-setup` (ou diga "Edax, vamos começar").');
}

function help() {
  log(`@edaxtech/agentic-method — template para assistentes especialistas no Claude Code

Uso:
  npx github:EdaxTech/agentic-method install [--force]
      Instala o template-mãe (Edax, critic, skills do Setup, slash commands) em ~/.claude/.
      Faça uma vez por máquina. Use --force para sobrescrever versões anteriores.

  npx github:EdaxTech/agentic-method update [--force]
      Alias de \`install --force\`. Atualiza a instalação user-level para a versão atual.

  npx github:EdaxTech/agentic-method init [--force]
      Prepara a pasta atual como uma nova instância (caso de uso). Cria CLAUDE.md
      e a estrutura mínima de pastas (config/, runs/, .claude/agents/, .claude/skills/).

  npx github:EdaxTech/agentic-method help
      Mostra esta ajuda.

Fluxo típico:
  1. Uma vez:  npx github:EdaxTech/agentic-method install
  2. Por caso: mkdir meu-caso && cd meu-caso && npx github:EdaxTech/agentic-method init
  3. Abra o Claude Code na pasta do caso e diga "Edax, vamos começar".
`);
}

switch (cmd) {
  case 'install':
    installToUser();
    break;
  case 'update':
    force = true;
    installToUser();
    break;
  case 'init':
    initInCwd();
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
