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
      const usedCustomValidator = previous !== undefined && !previous.startsWith('PropTypes');
      return usedCustomValidator ? previous! : generated;
    },
    shouldInclude: ({ component, prop }) => {
      if (['children', 'state'].includes(prop.name) && component.name.startsWith('DataGrid')) {
        return false;
      }
      let shouldDocument = true;
      prop.filenames.forEach((filename) => {
        // Don't include props from external dependencies
        if (/node_modules/.test(filename)) {
          shouldDocument = false;
        }
      });
      return shouldDocument;
    },
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
    // TODO discover the components below based on if they use makeStyles()
    path.resolve(__dirname, '../../packages/grid/_modules_/grid/components/GridPagination.tsx'),
    path.resolve(__dirname, '../../packages/grid/_modules_/grid/components/menu/GridMenu.tsx'),
    path.resolve(
      __dirname,
      '../../packages/grid/_modules_/grid/components/panel/GridColumnsPanel.tsx',
    ),
    path.resolve(__dirname, '../../packages/grid/_modules_/grid/components/panel/GridPanel.tsx'),
    path.resolve(
      __dirname,
      '../../packages/grid/_modules_/grid/components/panel/GridPanelContent.tsx',
    ),
    path.resolve(
      __dirname,
      '../../packages/grid/_modules_/grid/components/panel/GridPanelFooter.tsx',
    ),
    path.resolve(
      __dirname,
      '../../packages/grid/_modules_/grid/components/panel/GridPanelHeader.tsx',
    ),
    path.resolve(
      __dirname,
      '../../packages/grid/_modules_/grid/components/panel/GridPanelWrapper.tsx',
    ),
    path.resolve(
      __dirname,
      '../../packages/grid/_modules_/grid/components/panel/filterPanel/GridFilterForm.tsx',
    ),
    path.resolve(
      __dirname,
      '../../packages/grid/_modules_/grid/components/toolbar/GridToolbarFilterButton.tsx',
    ),
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
