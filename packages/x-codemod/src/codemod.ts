#!/usr/bin/env node

import childProcess from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import yargs from 'yargs';

const jscodeshiftPackage = require('jscodeshift/package.json');

const jscodeshiftDirectory = path.dirname(require.resolve('jscodeshift'));
const jscodeshiftExecutable = path.join(jscodeshiftDirectory, jscodeshiftPackage.bin.jscodeshift);

interface Flags {
  parser?: string;
  jscodeshift: string[];
}

async function runTransform(
  transform: string,
  files: string[],
  flags: Flags,
  codemodFlags: string[],
) {
  const transformerSrcPath = path.resolve(__dirname, './src', transform);
  const transformerBuildPath = path.resolve(__dirname, transform);
  let transformerPath: string;
  try {
    await fs.stat(transformerSrcPath);
    transformerPath = transformerSrcPath;
  } catch (srcPathError) {
    try {
      await fs.stat(transformerBuildPath);
      transformerPath = transformerBuildPath;
    } catch (buildPathError) {
      if ((buildPathError as any).code === 'ENOENT') {
        throw new Error(
          `Transform '${transform}' not found. Check out ${path.resolve(
            __dirname,
            './README.md for a list of available codemods.',
          )}`,
        );
      }
      throw buildPathError;
    }
  }

  const args = [
    // can't directly spawn `jscodeshiftExecutable` due to https://github.com/facebook/jscodeshift/issues/424
    jscodeshiftExecutable,
    '--transform',
    transformerPath,
    ...codemodFlags,
    '--extensions',
    'js,ts,jsx,tsx',
    '--parser',
    flags.parser || 'tsx',
    '--ignore-pattern',
    '**/node_modules/**',
    ...flags.jscodeshift,
  ];

  args.push(...files);

  // eslint-disable-next-line no-console -- debug information
  console.log(`Executing command: jscodeshift ${args.join(' ')}`);
  const jscodeshiftProcess = childProcess.spawnSync('node', args, { stdio: 'inherit' });

  if (jscodeshiftProcess.error) {
    throw jscodeshiftProcess.error;
  }
}

interface HandlerArgv extends Flags {
  codemod: string;
  paths: string[];
}

function run(argv: yargs.ArgumentsCamelCase<HandlerArgv>) {
  const { codemod, paths, _: other, jscodeshift, parser } = argv;

  return runTransform(
    codemod,
    paths.map((filePath) => path.resolve(filePath)),
    { jscodeshift, parser },
    (other as string[]) || [],
  );
}

yargs
  .command({
    command: '$0 <codemod> <paths...>',
    describe: 'Applies a `@mui/x-codemod` to the specified paths',
    // @ts-expect-error
    builder: (command) => {
      return command
        .positional('codemod', {
          description: 'The name of the codemod',
          type: 'string',
        })
        .positional('paths', {
          array: true,
          description: 'Paths forwarded to `jscodeshift`',
          type: 'string',
        })
        .option('parser', {
          description: 'which parser for jscodeshift to use',
          default: 'tsx',
          type: 'string',
        })
        .option('jscodeshift', {
          description: '(Advanced) Pass options directly to jscodeshift',
          default: [],
          type: 'array',
        });
    },
    handler: run,
  })
  .scriptName('npx @mui/x-codemod')
  .example(
    '$0 v6.0.0/localization-provider-rename-locale src',
    'Run "localization-provider-rename-locale" codemod on "src" path',
  )
  .example(
    '$0 v6.0.0/component-rename-prop src -- --component=DataGrid --from=prop --to=newProp',
    'Run "component-rename-prop" codemod in "src" path on "DataGrid" component with custom "from" and "to" arguments',
  )
  .help()
  .parse();
