import path from 'path';
import fs from 'fs';
import * as ts from 'typescript';
import { Project, ProjectNames, Projects } from './api/utils';

const workspaceRoot = path.resolve(__dirname, '../../');

interface CreateProgramOptions {
  name: ProjectNames;
  rootPath: string;
  /**
   * Config to use to build this package.
   * The path must be relative to the root path.
   */
  tsConfigPath: string;
  /**
   * File used as root of the package.
   * The path must be relative to the root path.
   */
  entryPointPath: string;
  /**
   * Folder containing all the components of this package.
   * The path must be relative to the root path.
   */
  componentsFolder?: string;
  /**
   * Additional files containing components outside the component's folder.
   * The path must be relative to the root path.
   */
  otherComponentFiles?: string[];
}

const createProject = (options: CreateProgramOptions): Project => {
  const { name, tsConfigPath, rootPath, entryPointPath, componentsFolder, otherComponentFiles } =
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
    name,
    exports,
    program,
    checker,
    workspaceRoot,
    componentsFolder: componentsFolder ? path.join(rootPath, componentsFolder) : undefined,
    otherComponentFiles: otherComponentFiles?.map((file) => path.join(rootPath, file)),
    prettierConfigPath: path.join(workspaceRoot, 'prettier.config.js'),
  };
};

export const getTypeScriptProjects = () => {
  const projects: Projects = new Map();

  projects.set(
    'x-data-grid-pro',
    createProject({
      name: 'x-data-grid-pro',
      rootPath: path.join(workspaceRoot, 'packages/grid/x-data-grid-pro'),
      tsConfigPath: 'tsconfig.json',
      entryPointPath: 'src/index.ts',
      componentsFolder: 'src/components',
      otherComponentFiles: ['src/DataGridPro/DataGridPro.tsx'],
    }),
  );

  projects.set(
    'x-data-grid',
    createProject({
      name: 'x-data-grid',
      rootPath: path.join(workspaceRoot, 'packages/grid/x-data-grid'),
      tsConfigPath: 'tsconfig.json',
      entryPointPath: 'src/index.ts',
      componentsFolder: 'src/components',
      otherComponentFiles: ['src/DataGrid/DataGrid.tsx'],
    }),
  );

  return projects;
};
