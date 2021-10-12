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
  const proptypes = ttp.parseFromProgram(sourceFile, program, {
    checkDeclarations: true,
    shouldResolveObject: ({ name }) => {
      const propsToNotResolve = [
        'classes',
        'components',
        'componentsProps',
        'columns',
        'currentColumn',
        'colDef',
        'renderedColumns',
        'scrollBarState',
        'renderState',
        'cellFocus',
        'cellTabIndex',
        'groupingColDef',
      ];
      if (propsToNotResolve.includes(name)) {
        return false;
      }
      return undefined;
    },
  });

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
      const ignoreGenerated =
        previous !== undefined &&
        previous.startsWith('PropTypes /* @typescript-to-proptypes-ignore */');
      return usedCustomValidator || ignoreGenerated ? previous! : generated;
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

function findComponents(folderPath) {
  const files = fse.readdirSync(folderPath, { withFileTypes: true });
  return files.reduce((acc, file) => {
    if (file.isDirectory()) {
      const filesInFolder = findComponents(path.join(folderPath, file.name));
      return [...acc, ...filesInFolder];
    }
    if (/[A-Z]+.*\.tsx/.test(file.name)) {
      return [...acc, path.join(folderPath, file.name)];
    }
    return acc;
  }, []);
}

async function run() {
  const componentsToAddPropTypes = [
    path.resolve(__dirname, '../../packages/grid/data-grid/src/DataGrid.tsx'),
    path.resolve(__dirname, '../../packages/grid/x-grid/src/DataGridPro.tsx'),
  ];

  const indexPath = path.resolve(__dirname, '../../packages/grid/_modules_/index.ts');
  const program = ttp.createTSProgram([...componentsToAddPropTypes, indexPath], tsconfig);
  const checker = program.getTypeChecker();
  const indexFile = program.getSourceFile(indexPath)!;
  const symbol = checker.getSymbolAtLocation(indexFile);
  const exports = checker.getExportsOfModule(symbol!);

  const componentsFolder = path.resolve(__dirname, '../../packages/grid/_modules_/grid/components');
  const components = findComponents(componentsFolder);
  components.forEach((component) => {
    const componentName = path.basename(component).replace('.tsx', '');
    const isExported = exports.find((e) => e.name === componentName);
    if (isExported) {
      componentsToAddPropTypes.push(component);
    }
  });

  const promises = componentsToAddPropTypes.map<Promise<void>>(async (file) => {
    try {
      await generateProptypes(program, file);
    } catch (error: any) {
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
