import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const cli = path.join(path.dirname(require.resolve('eslint/package.json')), 'bin/eslint.js');
const args = process.argv.slice(2);
const queryOnly = args.some((arg) =>
  ['--help', '-h', '--version', '-v', '--print-config', '--inspect-config'].includes(arg),
);
const phases = queryOnly
  ? [[]]
  : [['.', '--ignore-pattern', 'docs/**/*.{js,jsx}'], ['docs/**/*.{js,jsx}']];

// Separate processes release the TypeScript project before loading the JavaScript project.
for (const files of phases) {
  if (!queryOnly) {
    process.stdout.write(
      `Linting ${files.length === 1 ? 'documentation JavaScript' : 'source files'}\n`,
    );
  }
  const result = spawnSync(
    process.execPath,
    [cli, ...files, '--report-unused-disable-directives', '--max-warnings', '0', ...args],
    { stdio: 'inherit' },
  );
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
