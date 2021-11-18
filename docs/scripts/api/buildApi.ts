import * as yargs from 'yargs';
import * as fse from 'fs-extra';
import path from 'path';
import { findPagesMarkdown } from 'docs/src/modules/utils/find';
import * as ttp from '@material-ui/monorepo/packages/typescript-to-proptypes/src';
import { getHeaders } from '@material-ui/monorepo/docs/packages/markdown';
import * as TypeDoc from 'typedoc';
import buildComponentDocumentation from './buildComponentDocumentation';
import buildInterfacesDocumentation from './buildInterfacesDocumentation';
import buildExportsDocumentation from './buildExportsDocumentation';

const workspaceRoot = path.resolve(__dirname, '../../../');
const prettierConfigPath = path.join(workspaceRoot, 'prettier.config.js');

async function run(argv: { outputDirectory?: string }) {
  const app = new TypeDoc.Application();
  app.options.addReader(new TypeDoc.TSConfigReader());
  app.options.addReader(new TypeDoc.TypeDocReader());
  app.bootstrap({
    entryPoints: ['packages/grid/x-data-grid/src/index.ts'],
    exclude: ['**/*.test.ts'],
    tsconfig: 'packages/grid/x-data-grid/tsconfig.json',
  });
  const project = app.convert()!;

  const outputDirectory = path.resolve(argv.outputDirectory!);
  fse.mkdirSync(outputDirectory, { mode: 0o777, recursive: true });

  const pagesMarkdown = findPagesMarkdown()
    .map((markdown) => {
      const markdownSource = fse.readFileSync(markdown.filename, 'utf8');
      return {
        ...markdown,
        components: getHeaders(markdownSource).components,
      };
    })
    .filter((markdown) => markdown.components.length > 0);

  const tsconfig = ttp.loadConfig(path.resolve(__dirname, '../../../tsconfig.json'));

  const componentsToGenerateDocs = [
    path.resolve(__dirname, '../../../packages/grid/x-data-grid/src/DataGrid.tsx'),
    path.resolve(__dirname, '../../../packages/grid/x-data-grid-pro/src/DataGridPro.tsx'),
  ];

  const indexPath = path.resolve(__dirname, '../../packages/grid/_modules_/index.ts');
  const program = ttp.createTSProgram([...componentsToGenerateDocs, indexPath], tsconfig);

  const documentedInterfaces = buildInterfacesDocumentation({
    project,
    prettierConfigPath,
    workspaceRoot,
    outputDirectory,
  });

  // Uncomment below to generate documentation for all exported components
  // const checker = program.getTypeChecker();
  // const indexFile = program.getSourceFile(indexPath)!;
  // const symbol = checker.getSymbolAtLocation(indexFile);
  // const exports = checker.getExportsOfModule(symbol!);
  // const componentsFolder = path.resolve(__dirname, '../../packages/grid/_modules_/grid/components');
  // const components = findComponents(componentsFolder);
  // components.forEach((component) => {
  //   const componentName = path.basename(component.filename).replace('.tsx', '');
  //   const isExported = exports.find((e) => e.name === componentName);
  //   if (isExported) {
  //     componentsToGenerateDocs.push(component.filename);
  //   }
  // })!;

  const componentBuilds = componentsToGenerateDocs.map(async (filename) => {
    try {
      return await buildComponentDocumentation({
        filename,
        program,
        outputDirectory,
        prettierConfigPath,
        workspaceRoot,
        pagesMarkdown,
        documentedInterfaces,
      });
    } catch (error: any) {
      error.message = `${path.relative(process.cwd(), filename)}: ${error.message}`;
      throw error;
    }
  });

  const builds = await Promise.allSettled(componentBuilds);

  const fails = builds.filter(
    (promise): promise is PromiseRejectedResult => promise.status === 'rejected',
  );

  fails.forEach((build) => {
    console.error(build.reason);
  });
  if (fails.length > 0) {
    process.exit(1);
  }

  buildExportsDocumentation({
    reflections: project.children ?? [],
    workspaceRoot,
    prettierConfigPath,
  });
}

yargs
  .command({
    command: '$0 <outputDirectory>',
    describe: 'generates API docs',
    builder: (command) => {
      return command.positional('outputDirectory', {
        description: 'directory where the markdown is written to',
        type: 'string',
      });
    },
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
