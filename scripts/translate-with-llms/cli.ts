import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { pathToFileURL } from 'node:url';
import { checkbox, confirm } from '@inquirer/prompts';
import { applyTranslations } from './applyTranslations';
import { buildPrompt } from './getPrompt';
import { PACKAGE_CONFIGS } from './packageConfigs';

function runClipboardCommand(command: string, args: string[], input: string): boolean {
  const result = spawnSync(command, args, { input, encoding: 'utf8' });
  return !result.error && result.status === 0;
}

function copyToClipboard(text: string): boolean {
  if (process.platform === 'darwin') {
    return runClipboardCommand('pbcopy', [], text);
  }

  if (process.platform === 'win32') {
    return runClipboardCommand('clip', [], text);
  }

  return (
    runClipboardCommand('wl-copy', [], text) ||
    runClipboardCommand('xclip', ['-selection', 'clipboard'], text) ||
    runClipboardCommand('xsel', ['--clipboard', '--input'], text)
  );
}

function readFromClipboard(): string | null {
  const commands: Array<{ command: string; args: string[] }> =
    process.platform === 'darwin'
      ? [{ command: 'pbpaste', args: [] }]
      : process.platform === 'win32'
        ? [
            {
              command: 'powershell',
              args: ['-NoProfile', '-Command', 'Get-Clipboard -Raw'],
            },
          ]
        : [
            { command: 'wl-paste', args: [] },
            { command: 'xclip', args: ['-selection', 'clipboard', '-o'] },
            { command: 'xsel', args: ['--clipboard', '--output'] },
          ];

  for (const { command, args } of commands) {
    const result = spawnSync(command, args, { encoding: 'utf8' });
    if (!result.error && result.status === 0 && result.stdout.length > 0) {
      return result.stdout.trim();
    }
  }

  return null;
}

function readMultilineInputFromStdin(): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    stdin.setEncoding('utf8');

    if (!stdin.isTTY) {
      const chunks: string[] = [];

      stdin.on('data', (chunk) => {
        chunks.push(chunk);
      });
      stdin.on('end', () => {
        resolve(chunks.join('').trim());
      });
      stdin.resume();
      return;
    }

    const chunks: string[] = [];
    let isDone = false;

    const rl = createInterface({
      input: stdin,
      output: process.stdout,
      terminal: true,
    });

    function getInput() {
      return chunks.join('\n').trim();
    }

    function canAutoSubmit() {
      const rawInput = getInput();
      if (rawInput.length === 0) {
        return false;
      }

      try {
        const parsed = JSON.parse(rawInput);
        return typeof parsed === 'object' && parsed !== null;
      } catch {
        return false;
      }
    }

    function finish() {
      if (isDone) {
        return;
      }
      isDone = true;
      rl.close();
      resolve(getInput());
    }

    rl.on('line', (line) => {
      if (line.length === 0) {
        finish();
        return;
      }

      chunks.push(line);
      if (canAutoSubmit()) {
        finish();
      }
    });
    rl.on('close', () => {
      if (isDone) {
        return;
      }
      isDone = true;
      resolve(getInput());
    });
  });
}

function formatSummary(result: ReturnType<typeof applyTranslations>): string {
  return [
    `Mode: ${result.mode}`,
    `Files targeted: ${result.filesTargeted}`,
    `Files updated: ${result.filesUpdated}`,
    `Translations inserted: ${result.translationsInserted}`,
    `Commented-out fields uncommented in place: ${result.commentedOutFieldsUncommentedInPlace}`,
    `Translations skipped (already present): ${result.translationsSkippedAlreadyPresent}`,
    `Warnings: ${result.warnings.length}`,
  ].join('\n');
}

async function main() {
  const dryRun = process.argv.slice(2).includes('--dry-run');
  const packageNames = Object.keys(PACKAGE_CONFIGS).sort();

  const selectedPackages = await checkbox({
    message: 'Select package(s) to translate',
    choices: packageNames.map((name) => ({ name, value: name, checked: true })),
    validate: (value) => (value.length > 0 ? true : 'Select at least one package.'),
  });

  const prompt = buildPrompt(selectedPackages);
  const copied = copyToClipboard(prompt);

  process.stdout.write('\n');
  process.stdout.write(`Prompt generated for ${selectedPackages.length} package(s).\n`);
  process.stdout.write(copied ? 'Prompt copied to clipboard.\n' : 'Clipboard copy failed.\n');
  process.stdout.write('Paste the prompt into your preferred LLM, then copy only the JSON response.\nUse Gemini, ChatGPT or similar. Avoid coding agents like Claude Code for this task, they\'ll try to scan file system and overcomplicate things.\n');

  if (!copied) {
    process.stdout.write('\n----- PROMPT START -----\n');
    process.stdout.write(prompt);
    process.stdout.write('\n----- PROMPT END -----\n\n');
  }

  const proceed = await confirm({
    message: 'Ready to paste the LLM response into this CLI now?',
    default: true,
  });

  if (!proceed) {
    process.stdout.write('Cancelled.\n');
    return;
  }

  let rawResponse = '';
  const clipboardResponse = readFromClipboard();

  if (clipboardResponse) {
    const useClipboard = await confirm({
      message: 'Use current clipboard content as the LLM JSON response? (faster)',
      default: true,
    });
    if (useClipboard) {
      rawResponse = clipboardResponse;
    }
  }

  if (rawResponse.length === 0) {
    process.stdout.write(
      '\nPaste the LLM JSON response, then press Enter to submit. Ctrl+D (macOS/Linux) and Ctrl+Z (Windows) also submit.\n\n',
    );
    rawResponse = await readMultilineInputFromStdin();
  }

  if (rawResponse.length === 0) {
    throw new Error('No response was provided.');
  }

  const result = applyTranslations(rawResponse, { dryRun });
  result.warnings.forEach((warning) => process.stderr.write(`Warning: ${warning}\n`));
  process.stdout.write('\n');
  process.stdout.write(formatSummary(result));
  process.stdout.write('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
