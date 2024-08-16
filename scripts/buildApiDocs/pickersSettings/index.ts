import path from 'path';
import { LANGUAGES } from 'docs/config';
import { ProjectSettings, ComponentReactApi, HookReactApi } from '@mui-internal/api-docs-builder';
import findApiPages from '@mui-internal/api-docs-builder/utils/findApiPages';
import generateUtilityClass, { isGlobalState } from '@mui/utils/generateUtilityClass';
import { getComponentImports, getComponentInfo } from './getComponentInfo';

type PageType = { pathname: string; title: string; plan?: 'community' | 'pro' | 'premium' };

export const projectPickersSettings: ProjectSettings = {
  output: {
    apiManifestPath: path.join(process.cwd(), 'docs/data/date-pickers-component-api-pages.ts'),
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
      name: 'date-pickers',
      rootPath: path.join(process.cwd(), 'packages/x-date-pickers'),
      entryPointPath: 'src/index.ts',
    },
    {
      name: 'date-pickers-pro',
      rootPath: path.join(process.cwd(), 'packages/x-date-pickers-pro'),
      entryPointPath: 'src/index.ts',
    },
  ],
  getApiPages: () => findApiPages('docs/pages/x/api/date-pickers'),
  getComponentInfo,
  translationLanguages: LANGUAGES,
  skipComponent() {
    return false;
  },
  skipAnnotatingComponentDefinition: true,
  translationPagesDirectory: 'docs/translations/api-docs/date-pickers',
  importTranslationPagesDirectory: 'docsx/translations/api-docs/date-pickers',
  getComponentImports,
  propsSettings: {
    propsWithoutDefaultVerification: [
      'dateIcon',
      'hidden',
      'timeIcon',
      'toolbarPlaceholder',
      'ampm',
      'format',
      'changeImportance',
      'desktopModeMediaQuery',
    ],
  },
  sortingStrategies: {
    slotsSort: (a, b) => a.name.localeCompare(b.name),
  },
  generateClassName: generateUtilityClass,
  isGlobalClassName: isGlobalState,
};
