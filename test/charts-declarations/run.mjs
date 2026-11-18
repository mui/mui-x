/* eslint-disable no-await-in-loop -- Stage dependencies and check consumers sequentially in one isolated directory. */
import { spawn, spawnSync } from 'node:child_process';
import {
  cp,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  realpath,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const testDirectory = dirname(fileURLToPath(import.meta.url));
const root = join(testDirectory, '../..');
const full = process.argv.includes('--full');
const chartPackages = ['@mui/x-charts', '@mui/x-charts-pro', '@mui/x-charts-premium'];
// Bundler resolution accepts the declarations that NodeNext accepts, so the strict Node modes cover
// it in CI. Node16 also rejects CommonJS declarations that import ESM-only packages.
const modes = [
  { name: 'ESM bundler', type: 'module', module: 'ESNext', moduleResolution: 'bundler' },
  {
    name: 'ESM NodeNext',
    type: 'module',
    module: 'NodeNext',
    moduleResolution: 'NodeNext',
    strict: true,
  },
  {
    name: 'CommonJS Node16',
    type: 'commonjs',
    module: 'Node16',
    moduleResolution: 'Node16',
    strict: true,
  },
];
// Keep access to the installed React types, but give consumers their own package resolution.
const consumer = await mkdtemp(join(root, 'node_modules/.charts-declarations-'));
const staged = new Set();

async function stagePackage(name) {
  if (staged.has(name)) {
    return;
  }
  staged.add(name);
  const source = join(root, 'packages', name.replace('@mui/', ''));
  const manifest = JSON.parse(await readFile(join(source, 'package.json'), 'utf8'));
  const destination = join(consumer, 'node_modules', name);
  // Copy rather than link: transitive imports must resolve built packages, never workspace src/.
  await cp(join(source, 'build'), destination, { recursive: true });
  for (const [dependency, version] of Object.entries({
    ...manifest.peerDependencies,
    ...manifest.optionalDependencies,
    ...manifest.dependencies,
  })) {
    if (version.startsWith('workspace:')) {
      await stagePackage(dependency);
    } else {
      const installed = await realpath(join(source, 'node_modules', dependency)).catch((error) => {
        if (error.code === 'ENOENT') {
          return null;
        }
        throw error;
      });
      if (installed) {
        const link = join(destination, 'node_modules', dependency);
        await mkdir(dirname(link), { recursive: true });
        await symlink(installed, link, 'junction');
      }
    }
  }
}

async function getCompiler(name) {
  const manifestPath = require.resolve(`${name}/package.json`);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const executable = join(dirname(manifestPath), manifest.bin.tsc ?? manifest.bin.tsc6);
  const version = spawnSync(process.execPath, [executable, '--version'], {
    encoding: 'utf8',
  }).stdout.trim();
  return { name, executable, version };
}

function runCompiler(compiler, directory, args) {
  return new Promise((onExit, onError) => {
    const child = spawn(process.execPath, [compiler.executable, ...args, '--pretty', 'false'], {
      cwd: directory,
    });
    let output = '';
    child.stdout.on('data', (chunk) => {
      output += chunk;
    });
    child.stderr.on('data', (chunk) => {
      output += chunk;
    });
    child.on('error', onError);
    child.on('close', (status) => onExit({ status, output }));
  });
}

function writeConfig(mode, directory, name, files) {
  return writeFile(
    join(directory, name),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        module: mode.module,
        moduleResolution: mode.moduleResolution,
        jsx: 'react-jsx',
        strict: true,
        noEmit: true,
        skipLibCheck: false,
        types: ['react', 'react-dom'],
      },
      files,
    }),
  );
}

async function setUpMode(mode, index, entries) {
  const directory = join(consumer, `mode-${index}`);
  // Keep the repository layout so fixtures can import the shared test type utilities.
  await cp(join(testDirectory, 'fixtures'), join(directory, 'charts-declarations/fixtures'), {
    recursive: true,
  });
  await cp(join(root, 'test/utils/typeUtils.ts'), join(directory, 'utils/typeUtils.ts'));
  await mkdir(join(directory, 'entries'));
  await writeFile(
    join(directory, 'package.json'),
    JSON.stringify({ private: true, type: mode.type }),
  );
  const fixtures = (await readdir(join(testDirectory, 'fixtures')))
    .filter((file) => file.endsWith('.spec.tsx'))
    .map((file) => `charts-declarations/fixtures/${file}`);
  for (const entry of entries) {
    await writeFile(
      join(directory, entry.file),
      `export type * as entry from '${entry.specifier}';\n`,
    );
  }
  return { directory, consumers: [...fixtures, ...entries.map((entry) => entry.file)] };
}

// Consumers that load the same module augmentations cannot mask each other's errors, so each such
// group shares one program. TypeScript's own file graph decides what each consumer loads.
async function groupByAugmentations(compiler, mode, directory, consumers) {
  await writeConfig(mode, directory, 'tsconfig.graph.json', consumers);
  const { status, output } = await runCompiler(compiler, directory, [
    '-p',
    'tsconfig.graph.json',
    '--listFilesOnly',
    '--explainFiles',
  ]);
  if (status !== 0) {
    throw new Error(`Could not list the consumer files (${mode.name}):\n${output}`);
  }
  const includes = new Map();
  let file;
  for (const line of output.split('\n')) {
    if (line.trim() && !line.startsWith(' ')) {
      file = resolve(directory, line.trim());
    }
    const importer = / from file '([^']+)'/.exec(line)?.[1];
    if (importer) {
      const key = resolve(directory, importer);
      includes.set(key, (includes.get(key) ?? new Set()).add(file));
    }
  }
  const augmentations = new Map();
  const groups = new Map();
  for (const consumerFile of consumers) {
    const start = resolve(directory, consumerFile);
    if (!includes.has(start)) {
      throw new Error(
        `No imports found for ${consumerFile}. Did the --explainFiles format change?`,
      );
    }
    const reached = new Set([start]);
    for (const current of reached) {
      includes.get(current)?.forEach((included) => reached.add(included));
    }
    const loaded = [];
    for (const reachedFile of reached) {
      if (!augmentations.has(reachedFile)) {
        const content = await readFile(reachedFile, 'utf8');
        augmentations.set(reachedFile, /^\s*declare (module|global)\b/m.test(content));
      }
      if (augmentations.get(reachedFile)) {
        loaded.push(reachedFile);
      }
    }
    const key = loaded.sort().join('\n');
    groups.set(key, [...(groups.get(key) ?? []), consumerFile]);
  }
  return [...groups.values()];
}

const failures = [];
let checks = 0;
try {
  for (const name of chartPackages) {
    await stagePackage(name);
  }
  const entries = [];
  for (const name of chartPackages) {
    const manifest = JSON.parse(
      await readFile(join(consumer, 'node_modules', name, 'package.json'), 'utf8'),
    );
    for (const subpath of Object.keys(manifest.exports)) {
      if (subpath !== './package.json') {
        const specifier = `${name}${subpath.slice(1)}`;
        const file = `entries/${specifier.replace('@mui/', '').replaceAll('/', '__')}.ts`;
        entries.push({ specifier, file });
      }
    }
  }
  const native = await getCompiler('@typescript/native');
  const setups = [];
  for (const [index, mode] of modes.entries()) {
    const { directory, consumers } = await setUpMode(mode, index, entries);
    const groups = await groupByAugmentations(native, mode, directory, consumers);
    setups.push({ mode, directory, groups });
  }
  for (const compiler of [native, await getCompiler('typescript')]) {
    for (const { mode, directory, groups } of setups) {
      // CI checks every group with the native compiler in the strict modes, plus one TS 6 bundler
      // check for compatibility. --full checks every group with both compilers in all modes.
      let programs = [];
      if (full || (compiler === native && mode.strict)) {
        programs = groups;
      } else if (compiler !== native && mode === modes[0]) {
        programs = [['charts-declarations/fixtures/community.spec.tsx']];
      }
      for (const [index, files] of programs.entries()) {
        const config = `tsconfig.${compiler === native ? 'native' : 'ts6'}.${index}.json`;
        await writeConfig(mode, directory, config, files);
        const names = files.map((file) =>
          file.startsWith('entries/')
            ? entries.find((entry) => entry.file === file).specifier
            : file.replace('charts-declarations/fixtures/', ''),
        );
        process.stdout.write(
          `${compiler.version}, ${mode.name}: ${names.slice(0, 3).join(', ')}` +
            `${names.length > 3 ? ` and ${names.length - 3} more` : ''}\n`,
        );
        const { status, output } = await runCompiler(compiler, directory, ['-p', config]);
        checks += 1;
        if (status !== 0) {
          process.stdout.write(output);
          failures.push(`${compiler.version}, ${mode.name}: ${names.join(', ')}`);
        }
      }
    }
  }
} finally {
  await rm(consumer, { recursive: true, force: true });
}
if (failures.length > 0) {
  throw new Error(
    `${failures.length} of ${checks} declaration checks failed:\n${failures.join('\n')}`,
  );
}
process.stdout.write(`${checks} declaration checks passed.\n`);
