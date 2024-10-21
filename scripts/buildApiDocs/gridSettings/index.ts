import path from 'path';
import { LANGUAGES } from 'docs/config';
import { ProjectSettings, ComponentReactApi, HookReactApi } from '@mui-internal/api-docs-builder';
import findApiPages from '@mui-internal/api-docs-builder/utils/findApiPages';
import generateUtilityClass, { isGlobalState } from '@mui/utils/generateUtilityClass';
import { getComponentImports, getComponentInfo } from './getComponentInfo';

type PageType = { pathname: string; title: string; plan?: 'community' | 'pro' | 'premium' };

export const projectGridSettings: ProjectSettings = {
  output: {
    apiManifestPath: path.join(process.cwd(), 'docs/data/data-grid-component-api-pages.ts'),
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

const apiPages: MuiPage[] = ${JSON.stringify(pages, null, 2)};
export default apiPages;
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
  skipComponent(filename) {
    return [
      'src/DataGridPremium/DataGridPremium.tsx',
      'src/DataGridPro/DataGridPro.tsx',
      'src/DataGrid/DataGrid.tsx',
      'src/components/panel/filterPanel/GridFilterForm.tsx',
      'src/components/panel/filterPanel/GridFilterPanel.tsx',
      'src/components/toolbar/GridToolbarQuickFilter.tsx',
    ].every((validPath) => !filename.endsWith(validPath));
  },
  skipAnnotatingComponentDefinition: true,
  translationPagesDirectory: 'docs/translations/api-docs/data-grid',
  importTranslationPagesDirectory: 'docsx/translations/api-docs/data-grid',
  getComponentImports,
  propsSettings: {
    propsWithoutDefaultVerification: ['debounceMs', 'quickFilterParser'],
  },
  generateClassName: generateUtilityClass,
  isGlobalClassName: isGlobalState,
};
