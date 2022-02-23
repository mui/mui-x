import path from 'path';
import fs from 'fs';
import * as ts from 'typescript';
import { Project, Projects } from './api/utils';
import { getComponentFilesInFolder } from './utils'

const workspaceRoot = path.resolve(__dirname, '../../');

interface CreateProgramOptions extends Pick<Project, 'name' | 'rootPath' | 'documentationFolderName' | 'getComponentsWithPropTypes' | 'getComponentsWithApiDoc'> {
  /**
   * Config to use to build this package.
   * The path must be relative to the root path.
   * @default 'tsconfig.json`
   */
  tsConfigPath?: string;
  /**
   * File used as root of the package.
   * The path must be relative to the root path.
   * @default 'src/index.ts'
   */
  entryPointPath?: string;
}

const createProject = (options: CreateProgramOptions): Project => {
  const { rootPath, tsConfigPath = 'tsconfig.json', entryPointPath = 'src/index.ts', ...rest } =
    options;

  const tsConfigFile = ts.readConfigFile(tsConfigPath, (filePath) =>
    fs.readFileSync(filePath).toString(),
  );

  if (tsConfigFile.error) {
    throw tsConfigFile.error;
  }

  const tsConfigFileContent = ts.parseJsonConfigFileContent(
    tsConfigFile.config,
    ts.sys,
    path.dirname(tsConfigPath),
  );

  if (tsConfigFileContent.errors.length > 0) {
    throw tsConfigFileContent.errors[0];
  }

  const fullEntryPointPath = path.join(rootPath, entryPointPath);

  const program = ts.createProgram({
    rootNames: [fullEntryPointPath],
    options: tsConfigFileContent.options,
  });

  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(fullEntryPointPath);

  const exports = Object.fromEntries(
    checker.getExportsOfModule(checker.getSymbolAtLocation(sourceFile!)!).map((symbol) => {
      return [symbol.name, symbol];
    }),
  );

  return {
      ...rest,
      rootPath,
    exports,
    program,
    checker,
    workspaceRoot,
    prettierConfigPath: path.join(workspaceRoot, 'prettier.config.js'),
  };
};

const getComponentPaths = ({ folders = [], files = [] }: { folders?: string[], files?: string[] }) => (project: Project) => {
    const paths: string[] = []

    files.forEach(file => {
        const componentName = path.basename(file).replace('.tsx', '');
        const isExported = !!project.exports[componentName];
        if (isExported) {
            paths.push(path.join(project.rootPath, file))
        }
    })

    folders.forEach(folder => {
        const componentFiles = getComponentFilesInFolder(path.join(project.rootPath, folder))
        componentFiles.forEach(file => {
            const componentName = path.basename(file).replace('.tsx', '');
            const isExported = !!project.exports[componentName];
            if (isExported) {
                paths.push(file);
            }
        })
    })

    return paths
}

export const getTypeScriptProjects = () => {
  const projects: Projects = new Map();

  projects.set(
    'x-data-grid-pro',
    createProject({
      name: 'x-data-grid-pro',
      rootPath: path.join(workspaceRoot, 'packages/grid/x-data-grid-pro'),
      documentationFolderName: 'data-grid',
      getComponentsWithPropTypes: getComponentPaths({
          folders: ['src/internals/components'],
          files: ['src/internals/DataGridPro.tsx']
      }),
      getComponentsWithApiDoc: getComponentPaths({
          files: ['src/internals/DataGridPro.tsx']
      }),
    }),
  );

  projects.set(
    'x-data-grid',
    createProject({
      name: 'x-data-grid',
      rootPath: path.join(workspaceRoot, 'packages/grid/x-data-grid'),
      documentationFolderName: 'data-grid',
        getComponentsWithPropTypes: getComponentPaths({
            folders: ['src/internals/components'],
            files: ['src/internals/DataGrid.tsx']
        }),
        getComponentsWithApiDoc: getComponentPaths({
            files: ['src/internals/DataGrid.tsx']
        }),
    }),
  );

    projects.set('x-pickers-pro', createProject({
        name: 'x-pickers-pro',
        rootPath: path.join(workspaceRoot, 'packages/x-pickers-pro'),
        documentationFolderName: 'pickers',
        getComponentsWithPropTypes: getComponentPaths({
            folders: ['src'],
        }),
        getComponentsWithApiDoc: getComponentPaths({
            folders: ['src']
        }),
    }))

  projects.set('x-pickers', createProject({
      name: 'x-pickers',
      rootPath: path.join(workspaceRoot, 'packages/x-pickers'),
    documentationFolderName: 'pickers',
      getComponentsWithPropTypes: getComponentPaths({
          folders: ['src'],
      }),
      getComponentsWithApiDoc: getComponentPaths({
          folders: ['src']
      }),
  }))

  return projects;
};
