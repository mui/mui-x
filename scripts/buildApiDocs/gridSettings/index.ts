import path from 'path';
import fs from 'fs';
import { LANGUAGES } from 'docs/config';
import { ProjectSettings, ComponentReactApi, HookReactApi } from '@mui-internal/api-docs-builder';
import findApiPages from '@mui-internal/api-docs-builder/utils/findApiPages';
import generateUtilityClass, { isGlobalState } from '@mui/utils/generateUtilityClass';
import { getComponentImports, getComponentInfo } from './getComponentInfo';

type PageType = { pathname: string; title: string; plan?: 'community' | 'pro' | 'premium' };

function getNonComponentFolders(): string[] {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), 'docs/data/data-grid'), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && dirent.name !== 'components')
      .map((dirent) => `data-grid/${dirent.name}`)
      .sort();
  } catch (error) {
    // Fallback to empty array if directory doesn't exist
    console.warn('Could not read the directories:', error);
    return [];
  }
}

const COMPONENT_API_PAGES = [
  'src/DataGridPremium/DataGridPremium.tsx',
  'src/DataGridPro/DataGridPro.tsx',
  'src/DataGrid/DataGrid.tsx',

  'src/components/panel/filterPanel/GridFilterForm.tsx',
  'src/components/panel/filterPanel/GridFilterPanel.tsx',
  'src/components/toolbar/GridToolbarQuickFilter.tsx',

  'src/components/toolbarV8/Toolbar.tsx',
  'src/components/toolbarV8/ToolbarButton.tsx',
  'src/components/export/ExportPrint.tsx',
  'src/components/export/ExportCsv.tsx',
  'src/components/export/ExportExcel.tsx',
  'src/components/quickFilter/QuickFilter.tsx',
  'src/components/quickFilter/QuickFilterControl.tsx',
  'src/components/quickFilter/QuickFilterClear.tsx',
  'src/components/quickFilter/QuickFilterTrigger.tsx',
  'src/components/filterPanel/FilterPanelTrigger.tsx',
  'src/components/columnsPanel/ColumnsPanelTrigger.tsx',
  'src/components/pivotPanel/PivotPanelTrigger.tsx',
  'src/components/chartsPanel/GridChartsPanel.tsx',
  'src/components/chartsPanel/ChartsPanelTrigger.tsx',
  'src/components/aiAssistantPanel/AiAssistantPanelTrigger.tsx',
  'src/components/promptField/PromptField.tsx',
  'src/components/promptField/PromptFieldRecord.tsx',
  'src/components/promptField/PromptFieldControl.tsx',
  'src/components/promptField/PromptFieldSend.tsx',

  'src/context/GridChartsRendererProxy.tsx',
];

export const projectGridSettings: ProjectSettings = {
  output: {
    apiManifestPath: path.join(process.cwd(), 'docs/data/dataGridApiPages.ts'),
  },
  onWritingManifestFile: (
    builds: PromiseSettledResult<ComponentReactApi | HookReactApi | null | never[]>[],
  ) => {
    const pages = builds
      .map((build) => {
        if (build.status === 'rejected' || !build.value || Array.isArray(build.value)) {
          return null;
        }
        const {
          value: { name, apiPathname, filename },
        } = build;

        const plan =
          (filename.includes('-pro') && 'pro') || (filename.includes('-premium') && 'premium');

        return { pathname: apiPathname, title: name, ...(plan ? { plan } : {}) };
      })
      .filter((page): page is PageType => page !== null)
      .sort((a: PageType, b: PageType) => a.title.localeCompare(b.title));

    return `import type { MuiPage } from 'docs/src/MuiPage';

const dataGridApiPages: MuiPage[] = ${JSON.stringify(pages, null, 2)};
export default dataGridApiPages;
`;
  },
  typeScriptProjects: [
    {
      name: 'data-grid',
      rootPath: path.join(process.cwd(), 'packages/x-data-grid'),
      entryPointPath: 'src/index.ts',
    },
    {
      name: 'data-grid-pro',
      rootPath: path.join(process.cwd(), 'packages/x-data-grid-pro'),
      entryPointPath: 'src/index.ts',
    },
    {
      name: 'data-grid-premium',
      rootPath: path.join(process.cwd(), 'packages/x-data-grid-premium'),
      entryPointPath: 'src/index.ts',
    },
  ],
  getApiPages: () => findApiPages('docs/pages/x/api/data-grid'),
  getComponentInfo,
  translationLanguages: LANGUAGES,
  skipComponent: (filename) =>
    COMPONENT_API_PAGES.every((validPath) => !filename.endsWith(validPath)),
  skipAnnotatingComponentDefinition: true,
  translationPagesDirectory: 'docs/translations/api-docs/data-grid',
  importTranslationPagesDirectory: 'docsx/translations/api-docs/data-grid',
  getComponentImports,
  propsSettings: {
    propsWithoutDefaultVerification: ['debounceMs', 'quickFilterParser'],
  },
  generateClassName: generateUtilityClass,
  isGlobalClassName: isGlobalState,
  nonComponentFolders: [
    ...getNonComponentFolders(),
    'data-grid/components/usage.md',
    'migration/migration-data-grid-v8',
    'migration/migration-data-grid-v7',
    'migration/migration-data-grid-v6',
    'migration/migration-data-grid-v5',
    'migration/migration-data-grid-v4',
  ],
};
