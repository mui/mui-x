// TODO: Use the core file (need to change the way the babel config is loaded to load the X one instead of the core one)
import childProcess from 'child_process';
import path from 'path';
import { promisify } from 'util';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as fs from 'fs/promises';
import { cjsCopy } from '@mui/monorepo/scripts/copyFilesUtils.mjs';
import { getWorkspaceRoot } from './utils.mjs';

const exec = promisify(childProcess.exec);

const validBundles = [
  // modern build with a rolling target using ES6 modules
  'modern',
  // build for node using commonJS modules
  'node',
  // build with a hardcoded target using ES6 modules
  'stable',
];

async function run(argv) {
  const { bundle, largeFiles, outDir: outDirBase, verbose, ignore: providedIgnore } = argv;

  if (validBundles.indexOf(bundle) === -1) {
    throw new TypeError(
      `Unrecognized bundle '${bundle}'. Did you mean one of "${validBundles.join('", "')}"?`,
    );
  }

  const packageJsonPath = path.resolve('./package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, { encoding: 'utf8' }));

  const babelRuntimeVersion = packageJson.dependencies['@babel/runtime'];
  if (!babelRuntimeVersion) {
    throw new Error(
      'package.json needs to have a dependency on `@babel/runtime` when building with `@babel/plugin-transform-runtime`.',
    );
  }

  const babelConfigPath = path.resolve(getWorkspaceRoot(), 'babel.config.js');
  const srcDir = path.resolve('./src');
  const extensions = ['.js', '.ts', '.tsx'];
  const ignore = [
    '**/*.test.js',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.js',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.d.ts',
    '**/*.test/*.*',
    '**/test-cases/*.*',
    ...(providedIgnore || []),
  ];

  const outFileExtension = '.js';

  const relativeOutDir = {
    node: './',
    modern: './modern',
    stable: './esm',
  }[bundle];

  const outDir = path.resolve(outDirBase, relativeOutDir);

  const env = {
    NODE_ENV: 'production',
    BABEL_ENV: bundle,
    MUI_BUILD_VERBOSE: verbose,
    MUI_BABEL_RUNTIME_VERSION: babelRuntimeVersion,
    MUI_OUT_FILE_EXTENSION: outFileExtension,
  };

  const babelArgs = [
    '--config-file',
    babelConfigPath,
    '--extensions',
    `"${extensions.join(',')}"`,
    srcDir,
    '--out-dir',
    outDir,
    '--ignore',
    // Need to put these patterns in quotes otherwise they might be evaluated by the used terminal.
    `"${ignore.join('","')}"`,
  ];

  if (outFileExtension !== '.js') {
    babelArgs.push('--out-file-extension', outFileExtension);
  }

  if (largeFiles) {
    babelArgs.push('--compact false');
  }

  const command = ['pnpm babel', ...babelArgs].join(' ');

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log(`running '${command}' with ${JSON.stringify(env)}`);
  }

  const { stderr, stdout } = await exec(command, { env: { ...process.env, ...env } });
  if (stderr) {
    throw new Error(`'${command}' failed with \n${stderr}`);
  }

  // cjs for reexporting from commons only modules.
  // If we need to rely more on this we can think about setting up a separate commonjs => commonjs build for .cjs files to .cjs
  // `--extensions-.cjs --out-file-extension .cjs`
  await cjsCopy({ from: srcDir, to: outDir });

  const isEsm = bundle === 'modern' || bundle === 'stable';
  if (isEsm) {
    const rootBundlePackageJson = path.join(outDir, 'package.json');
    await fs.writeFile(
      rootBundlePackageJson,
      JSON.stringify({ type: 'module', sideEffects: false }),
    );
  }

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log(stdout);
  }
}

yargs(hideBin(process.argv))
  .command({
    command: '$0 <bundle>',
    description: 'build package',
    builder: (command) => {
      return command
        .positional('bundle', {
          description: `Valid bundles: "${validBundles.join('" | "')}"`,
          type: 'string',
        })
        .option('largeFiles', {
          type: 'boolean',
          default: false,
          describe: 'Set to `true` if you know you are transpiling large files.',
        })
        .option('out-dir', { default: './build', type: 'string' })
        .option('verbose', { type: 'boolean' })
        .option('ignore', { type: 'string', array: true });
    },
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
