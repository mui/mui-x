import path from 'path';
import fs from 'fs';
import * as ts from 'typescript';
import { Project, Projects } from './api/utils';
import { getComponentFilesInFolder } from './utils';

const workspaceRoot = path.resolve(__dirname, '../../');

interface CreateProgramOptions
  extends Pick<
    Project,
    | 'name'
    | 'rootPath'
    | 'documentationFolderName'
    | 'getComponentsWithPropTypes'
    | 'getComponentsWithApiDoc'
  > {
  /**
   * Config to use to build this package.
   * The path must be relative to the root path.
   * @default 'tsconfig.build.json`
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
  const {
    rootPath,
    tsConfigPath: inputTsConfigPath = 'tsconfig.build.json',
    entryPointPath: inputEntryPointPath = 'src/index.ts',
    ...rest
  } = options;

  const tsConfigPath = path.join(rootPath, inputTsConfigPath);
  const entryPointPath = path.join(rootPath, inputEntryPointPath);

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

  const program = ts.createProgram({
    rootNames: [entryPointPath],
    options: tsConfigFileContent.options,
  });

  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(entryPointPath);

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

/**
 * Transforms a list of folders and files into a list of file paths containing components.
 * The file must have the name of the component.
 * @param {string} folders The folders from which we want to extract components
 * @param {string} files The files from which we want to extract components
 */
const getComponentPaths =
  ({ folders = [], files = [] }: { folders?: string[]; files?: string[] }) =>
  (project: Project) => {
    const paths: string[] = [];

    files.forEach((file) => {
      const componentName = path.basename(file).replace('.tsx', '');
      const isExported = !!project.exports[componentName];
      if (isExported) {
        paths.push(path.join(project.rootPath, file));
      }
    });

    folders.forEach((folder) => {
      const componentFiles = getComponentFilesInFolder(path.join(project.rootPath, folder));
      componentFiles.forEach((file) => {
        const componentName = path.basename(file).replace('.tsx', '');
        const isExported = !!project.exports[componentName];
        if (isExported) {
          paths.push(file);
        }
      });
    });

    return paths;
  };

export const getTypeScriptProjects = () => {
  const projects: Projects = new Map();

  projects.set(
    'x-data-grid-pro',
    createProject({
      name: 'x-data-grid-pro',
      rootPath: path.join(workspaceRoot, 'packages/grid/x-data-grid-pro'),
      documentationFolderName: 'data-grid',
      getComponentsWithPropTypes: getComponentPaths({
        folders: ['src/components'],
        files: ['src/DataGridPro/DataGridPro.tsx'],
      }),
      getComponentsWithApiDoc: getComponentPaths({
        files: ['src/DataGridPro/DataGridPro.tsx'],
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
        folders: ['src/components'],
        files: ['src/DataGrid/DataGrid.tsx'],
      }),
      getComponentsWithApiDoc: getComponentPaths({
        files: ['src/DataGrid/DataGrid.tsx'],
      }),
    }),
  );

  // projects.set(
  //   'x-date-pickers-pro',
  //   createProject({
  //     name: 'x-date-pickers-pro',
  //     rootPath: path.join(workspaceRoot, 'packages/x-date-pickers-pro'),
  //     documentationFolderName: 'date-pickers',
  //     getComponentsWithPropTypes: getComponentPaths({
  //       folders: ['src'],
  //     }),
  //     getComponentsWithApiDoc: getComponentPaths({
  //       folders: ['src'],
  //     }),
  //   }),
  // );
  //
  // projects.set(
  //   'x-date-pickers',
  //   createProject({
  //     name: 'x-date-pickers',
  //     rootPath: path.join(workspaceRoot, 'packages/x-date-pickers'),
  //     documentationFolderName: 'date-pickers',
  //     getComponentsWithPropTypes: getComponentPaths({
  //       folders: ['src'],
  //     }),
  //     getComponentsWithApiDoc: getComponentPaths({
  //       folders: ['src'],
  //     }),
  //   }),
  // );

  return projects;
};
