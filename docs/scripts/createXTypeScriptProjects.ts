import path from 'path';
import {
  createTypeScriptProject,
  CreateTypeScriptProjectOptions,
  TypeScriptProject,
} from '@mui/internal-docs-utils';
import { getComponentFilesInFolder } from './utils';

const workspaceRoot = path.resolve(__dirname, '../../');

export interface XTypeScriptProject extends Omit<TypeScriptProject, 'name'> {
  name: XProjectNames;
  workspaceRoot: string;
  prettierConfigPath: string;
  /**
   * @param {Project} project The project to generate the prop-types from.
   * @returns {string[]} Path to the component files from which we want to generate the prop-types.
   */
  getComponentsWithPropTypes?: (project: XTypeScriptProject) => string[];
  /**
   * @param {Project} project The project to generate the components api from.
   * @returns {string[]} Path to the component files from which we want to generate the api doc.
   */
  getComponentsWithApiDoc?: (project: XTypeScriptProject) => string[];
  /**
   * Name of the folder inside the documentation.
   */
  documentationFolderName: string;
}

export type XProjectNames =
  | 'x-license'
  | 'x-data-grid'
  | 'x-data-grid-pro'
  | 'x-data-grid-premium'
  | 'x-data-grid-generator'
  | 'x-date-pickers'
  | 'x-date-pickers-pro'
  | 'x-charts'
  | 'x-charts-pro'
  | 'x-tree-view'
  | 'x-tree-view-pro';

export type XTypeScriptProjects = Map<XProjectNames, XTypeScriptProject>;

interface CreateXTypeScriptProjectOptions
  extends Omit<CreateTypeScriptProjectOptions, 'name'>,
    Pick<
      XTypeScriptProject,
      'name' | 'documentationFolderName' | 'getComponentsWithPropTypes' | 'getComponentsWithApiDoc'
    > {}

const createXTypeScriptProject = (options: CreateXTypeScriptProjectOptions): XTypeScriptProject => {
  const { name, rootPath, tsConfigPath, entryPointPath, files, ...other } = options;

  const baseProject = createTypeScriptProject({
    name,
    rootPath,
    tsConfigPath,
    entryPointPath,
    files,
  });

  return {
    ...baseProject,
    ...other,
    name,
    workspaceRoot,
    prettierConfigPath: path.join(workspaceRoot, 'prettier.config.js'),
  };
};

/**
 * Transforms a list of folders and files into a list of file paths containing components.
 * The file must have the name of the component.
 * @param {string[]} folders The folders from which we want to extract components
 * @param {string[]} files The files from which we want to extract components
 */
const getComponentPaths =
  ({
    folders = [],
    files = [],
    includeUnstableComponents = false,
  }: {
    folders?: string[];
    files?: string[];
    includeUnstableComponents?: boolean;
  }) =>
  (project: XTypeScriptProject) => {
    const paths: string[] = [];

    files.forEach((file) => {
      const componentName = path.basename(file).replace('.tsx', '');
      const isExported = !!project.exports[componentName];
      const isHook = path.basename(file).startsWith('use');
      if (isExported && !isHook) {
        paths.push(path.join(project.rootPath, file));
      }
    });

    folders.forEach((folder) => {
      const componentFiles = getComponentFilesInFolder(path.join(project.rootPath, folder));
      componentFiles.forEach((file) => {
        const componentName = path.basename(file).replace('.tsx', '');
        const isExported =
          !!project.exports[componentName] ||
          (includeUnstableComponents && !!project.exports[`Unstable_${componentName}`]);
        const isHook = path.basename(file).startsWith('use');
        if (isExported && !isHook) {
          paths.push(file);
        }
      });
    });

    return paths;
  };

type InterfacesToDocumentType = {
  folder: string;
  packages: XProjectNames[];
  documentedInterfaces: string[];
};

export const interfacesToDocument: InterfacesToDocumentType[] = [
  {
    folder: 'data-grid',
    packages: ['x-data-grid', 'x-data-grid-pro', 'x-data-grid-premium', 'x-data-grid-generator'],
    documentedInterfaces: [
      // apiRef
      'GridApi',

      // Params
      'GridCellParams',
      'GridRowParams',
      'GridRowClassNameParams',
      'GridRowSpacingParams',
      'GridExportStateParams',

      // Others
      'GridColDef',
      'GridSingleSelectColDef',
      'GridActionsColDef',
      'GridCsvExportOptions',
      'GridPrintExportOptions',
      'GridExcelExportOptions',

      // Filters
      'GridFilterModel',
      'GridFilterItem',
      'GridFilterOperator',

      // Aggregation
      'GridAggregationFunction',
    ],
  },
  {
    folder: 'charts',
    packages: ['x-charts'],
    documentedInterfaces: [
      'BarSeriesType',
      'LineSeriesType',
      'PieSeriesType',
      'ScatterSeriesType',
      'AxisConfig',
    ],
  },
];

export const datagridApiToDocument = [
  'GridCellSelectionApi',
  'GridColumnPinningApi',
  'GridColumnResizeApi',
  'GridCsvExportApi',
  'GridDetailPanelApi',
  'GridEditingApi',
  'GridExcelExportApi',
  'GridFilterApi',
  'GridPaginationApi',
  'GridPrintExportApi',
  'GridRowGroupingApi',
  'GridRowMultiSelectionApi',
  'GridRowSelectionApi',
  'GridScrollApi',
  'GridSortApi',
  'GridVirtualizationApi',
];

export const createXTypeScriptProjects = () => {
  const projects: XTypeScriptProjects = new Map();

  projects.set(
    'x-license',
    createXTypeScriptProject({
      name: 'x-license',
      rootPath: path.join(workspaceRoot, 'packages/x-license'),
      entryPointPath: 'src/index.ts',
      documentationFolderName: 'license',
    }),
  );

  projects.set(
    'x-data-grid',
    createXTypeScriptProject({
      name: 'x-data-grid',
      rootPath: path.join(workspaceRoot, 'packages/x-data-grid'),
      entryPointPath: 'src/index.ts',
      documentationFolderName: 'data-grid',
      getComponentsWithPropTypes: getComponentPaths({
        folders: ['src/components'],
        files: ['src/DataGrid/DataGrid.tsx'],
      }),
      getComponentsWithApiDoc: getComponentPaths({
        files: [
          'src/DataGrid/DataGrid.tsx',
          'src/components/panel/filterPanel/GridFilterForm.tsx',
          'src/components/panel/filterPanel/GridFilterPanel.tsx',
          'src/components/toolbar/GridToolbarQuickFilter.tsx',
        ],
      }),
    }),
  );

  projects.set(
    'x-data-grid-pro',
    createXTypeScriptProject({
      name: 'x-data-grid-pro',
      rootPath: path.join(workspaceRoot, 'packages/x-data-grid-pro'),
      entryPointPath: 'src/index.ts',
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
    'x-data-grid-premium',
    createXTypeScriptProject({
      name: 'x-data-grid-premium',
      rootPath: path.join(workspaceRoot, 'packages/x-data-grid-premium'),
      entryPointPath: 'src/index.ts',
      documentationFolderName: 'data-grid',
      getComponentsWithPropTypes: getComponentPaths({
        folders: ['src/components'],
        files: ['src/DataGridPremium/DataGridPremium.tsx'],
      }),
      getComponentsWithApiDoc: getComponentPaths({
        files: ['src/DataGridPremium/DataGridPremium.tsx'],
      }),
    }),
  );

  projects.set(
    'x-data-grid-generator',
    createXTypeScriptProject({
      name: 'x-data-grid-generator',
      rootPath: path.join(workspaceRoot, 'packages/x-data-grid-generator'),
      entryPointPath: 'src/index.ts',
      documentationFolderName: 'data-grid',
    }),
  );

  projects.set(
    'x-date-pickers',
    createXTypeScriptProject({
      name: 'x-date-pickers',
      rootPath: path.join(workspaceRoot, 'packages/x-date-pickers'),
      entryPointPath: 'src/index.ts',
      documentationFolderName: 'date-pickers',
      getComponentsWithPropTypes: getComponentPaths({
        folders: ['src'],
        includeUnstableComponents: true,
      }),
      getComponentsWithApiDoc: getComponentPaths({
        folders: ['src'],
        includeUnstableComponents: true,
      }),
    }),
  );

  projects.set(
    'x-date-pickers-pro',
    createXTypeScriptProject({
      name: 'x-date-pickers-pro',
      rootPath: path.join(workspaceRoot, 'packages/x-date-pickers-pro'),
      entryPointPath: 'src/index.ts',
      documentationFolderName: 'date-pickers',
      getComponentsWithPropTypes: getComponentPaths({
        folders: ['src'],
        includeUnstableComponents: true,
      }),
      getComponentsWithApiDoc: getComponentPaths({
        folders: ['src'],
        includeUnstableComponents: true,
      }),
    }),
  );

  projects.set(
    'x-charts',
    createXTypeScriptProject({
      name: 'x-charts',
      rootPath: path.join(workspaceRoot, 'packages/x-charts'),
      entryPointPath: 'src/index.ts',
      documentationFolderName: 'charts',
      getComponentsWithPropTypes: getComponentPaths({
        folders: ['src'],
        includeUnstableComponents: true,
      }),
      getComponentsWithApiDoc: getComponentPaths({
        folders: ['src'],
        includeUnstableComponents: true,
      }),
    }),
  );

  projects.set(
    'x-charts-pro',
    createXTypeScriptProject({
      name: 'x-charts-pro',
      rootPath: path.join(workspaceRoot, 'packages/x-charts-pro'),
      entryPointPath: 'src/index.ts',
      documentationFolderName: 'charts',
      getComponentsWithPropTypes: getComponentPaths({
        folders: ['src'],
        includeUnstableComponents: true,
      }),
      getComponentsWithApiDoc: getComponentPaths({
        folders: ['src'],
        includeUnstableComponents: true,
      }),
    }),
  );

  projects.set(
    'x-tree-view',
    createXTypeScriptProject({
      name: 'x-tree-view',
      rootPath: path.join(workspaceRoot, 'packages/x-tree-view'),
      entryPointPath: 'src/index.ts',
      documentationFolderName: 'tree-view',
      getComponentsWithPropTypes: getComponentPaths({
        folders: ['src'],
        includeUnstableComponents: true,
      }),
      getComponentsWithApiDoc: getComponentPaths({
        folders: ['src'],
        includeUnstableComponents: true,
      }),
    }),
  );

  projects.set(
    'x-tree-view-pro',
    createXTypeScriptProject({
      name: 'x-tree-view-pro',
      rootPath: path.join(workspaceRoot, 'packages/x-tree-view-pro'),
      entryPointPath: 'src/index.ts',
      documentationFolderName: 'tree-view',
      getComponentsWithPropTypes: getComponentPaths({
        folders: ['src'],
        includeUnstableComponents: true,
      }),
      getComponentsWithApiDoc: getComponentPaths({
        folders: ['src'],
        includeUnstableComponents: true,
      }),
    }),
  );

  return projects;
};
