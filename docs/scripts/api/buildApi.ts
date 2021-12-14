import * as yargs from 'yargs';
import * as fse from 'fs-extra';
import path from 'path';
import * as ts from 'typescript';
import buildComponentsDocumentation from './buildComponentsDocumentation';
import buildInterfacesDocumentation from './buildInterfacesDocumentation';
import buildExportsDocumentation from './buildExportsDocumentation';
import buildEventsDocumentation from './buildEventsDocumentation';
import { Project } from './utils';

const workspaceRoot = path.resolve(__dirname, '../../../');

interface CreateProgramOptions {
  rootPath: string;
  tsConfigPath: string;
  entryPointPath: string;
}

const createProject = (options: CreateProgramOptions): Project => {
  const { tsConfigPath, rootPath, entryPointPath } = options;

  const compilerOptions = ts.parseJsonConfigFileContent(
    ts.readConfigFile(tsConfigPath, ts.sys.readFile).config,
    ts.sys,
    rootPath,
  );

  const program = ts.createProgram({
    rootNames: [entryPointPath],
    options: compilerOptions.options,
  });

  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(entryPointPath);

  const exports = Object.fromEntries(
    checker.getExportsOfModule(checker.getSymbolAtLocation(sourceFile!)!).map((symbol) => {
      return [symbol.name, symbol];
    }),
  );

  return {
    exports,
    program,
    checker,
    workspaceRoot,
    prettierConfigPath: path.join(workspaceRoot, 'prettier.config.js'),
  };
};

async function run(argv: { outputDirectory?: string }) {
  const outputDirectory = path.resolve(argv.outputDirectory!);
  fse.mkdirSync(outputDirectory, { mode: 0o777, recursive: true });

  const dataGridProject = createProject({
    rootPath: path.join(workspaceRoot, 'packages/grid/x-data-grid'),
    tsConfigPath: path.join(workspaceRoot, 'packages/grid/x-data-grid/tsconfig.json'),
    entryPointPath: path.join(workspaceRoot, 'packages/grid/x-data-grid/src/index.ts'),
  });

  const dataGridProProject = createProject({
    rootPath: path.join(workspaceRoot, 'packages/grid/x-data-grid-pro'),
    tsConfigPath: path.join(workspaceRoot, 'packages/grid/x-data-grid-pro/tsconfig.json'),
    entryPointPath: path.join(workspaceRoot, 'packages/grid/x-data-grid-pro/src/index.ts'),
  });

  const documentedInterfaces = buildInterfacesDocumentation({
    project: dataGridProject,
    outputDirectory,
  });

  await buildComponentsDocumentation({
    outputDirectory,
    documentedInterfaces,
    dataGridProject,
    dataGridProProject,
  });

  buildEventsDocumentation({
    project: dataGridProject,
    documentedInterfaces,
  });

  buildExportsDocumentation({
    project: dataGridProject,
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
