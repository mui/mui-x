#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import yargs, { ArgumentsCamelCase, CommandModule } from 'yargs';
import { run as jscodeshiftRun } from 'jscodeshift/src/Runner';

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

  // Parse additional jscodeshift options from flags
  const additionalOptions: Record<string, unknown> = {};
  codemodFlags.forEach((flag) => {
    const match = flag.match(/^--([^=]+)(?:=(.*))?$/);
    if (match) {
      const [, key, value] = match;
      additionalOptions[key] = value ?? true;
    }
  });

  const options = {
    extensions: 'js,ts,jsx,tsx',
    parser: flags.parser || 'tsx',
    ignorePattern: ['**/node_modules/**'],
    verbose: 2,
    ...additionalOptions,
  };

  // eslint-disable-next-line no-console -- debug information
  console.log(`Running jscodeshift with transform: ${transformerPath}`);
  console.warn(`
====================================
IMPORTANT NOTICE ABOUT CODEMOD USAGE
====================================
Not all use cases are covered by codemods. In some scenarios, like props spreading, cross-file dependencies and etc., the changes are not properly identified and therefore must be handled manually.

For example, if a codemod tries to rename a prop, but this prop is hidden with the spread operator, it won't be transformed as expected.
<DatePicker {...pickerProps} />

After running the codemods, make sure to test your application and that you don't have any formatting or console errors.
`);

  const result = await jscodeshiftRun(transformerPath, files, options);

  if (result.error > 0) {
    process.exit(1);
  }
}

interface HandlerArgv extends Flags {
  codemod: string;
  paths: string[];
}

function run(argv: ArgumentsCamelCase<HandlerArgv>) {
  const { codemod, paths, _: other, jscodeshift, parser } = argv;

  return runTransform(
    codemod,
    paths.map((filePath) => path.resolve(filePath)),
    { jscodeshift, parser },
    (other as string[]) || [],
  );
}

yargs(process.argv.slice(2))
  .command({
    command: '$0 <codemod> <paths...>',
    describe: 'Applies a `@mui/x-codemod` to the specified paths',
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
  } as CommandModule<{}, HandlerArgv>)
  .scriptName('npx @mui/x-codemod')
  .example('$0 v6.0.0/preset-safe src', 'Run "preset-safe" codemod on "src" path')
  .example(
    '$0 v6.0.0/component-rename-prop src -- --component=DataGrid --from=prop --to=newProp',
    'Run "component-rename-prop" codemod in "src" path on "DataGrid" component with custom "from" and "to" arguments',
  )
  .help()
  .parse();
