import * as yargs from 'yargs';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as prettier from 'prettier';
import * as ttp from '@material-ui/monorepo/packages/typescript-to-proptypes/src';
import { fixBabelGeneratorIssues, fixLineEndings } from 'docs/scripts/helpers';

const tsconfig = ttp.loadConfig(path.resolve(__dirname, '../../tsconfig.json'));

const prettierConfig = prettier.resolveConfig.sync(process.cwd(), {
  config: path.join(__dirname, '../../prettier.config.js'),
});

async function generateProptypes(program: ttp.ts.Program, sourceFile: string) {
  const proptypes = ttp.parseFromProgram(sourceFile, program);

  if (proptypes.body.length === 0) {
    return;
  }

  const sourceContent = await fse.readFile(sourceFile, 'utf8');

  const result = ttp.inject(proptypes, sourceContent, {
    disablePropTypesTypeChecking: true,
    comment: [
      '----------------------------- Warning --------------------------------',
      '| These PropTypes are generated from the TypeScript type definitions |',
      '| To update them edit the TypeScript types and run "yarn proptypes"  |',
      '----------------------------------------------------------------------',
    ].join('\n'),
    reconcilePropTypes: (prop, previous, generated) => {
      const ignoreGenerated =
        typeof previous === 'string' && previous.includes('/* @typescript-to-proptypes-ignore */');
      return ignoreGenerated ? previous! : generated;
    },
    shouldInclude: ({ prop }) => !['state', 'children'].includes(prop.name),
  });

  if (!result) {
    throw new Error('Unable to produce inject propTypes into code.');
  }

  const prettified = prettier.format(result, { ...prettierConfig, filepath: sourceFile });
  const formatted = fixBabelGeneratorIssues(prettified);
  const correctedLineEndings = fixLineEndings(sourceContent, formatted);

  await fse.writeFile(sourceFile, correctedLineEndings);
}

async function run() {
  const files = [
    path.resolve(__dirname, '../../packages/grid/data-grid/src/DataGrid.tsx'),
    path.resolve(__dirname, '../../packages/grid/x-grid/src/DataGridPro.tsx'),
  ];

  const program = ttp.createTSProgram(files, tsconfig);

  const promises = files.map<Promise<void>>(async (file) => {
    try {
      await generateProptypes(program, file);
    } catch (error) {
      error.message = `${file}: ${error.message}`;
      throw error;
    }
  });

  const results = await Promise.allSettled(promises);

  const fails = results.filter((result): result is PromiseRejectedResult => {
    return result.status === 'rejected';
  });

  fails.forEach((result) => {
    console.error(result.reason);
  });
  if (fails.length > 0) {
    process.exit(1);
  }
}

yargs
  .command({
    command: '$0',
    describe: 'Generates Component.propTypes from TypeScript declarations',
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
