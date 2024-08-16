import path from 'path';
import { LANGUAGES } from 'docs/config';
import { ProjectSettings, ComponentReactApi, HookReactApi } from '@mui-internal/api-docs-builder';
import findApiPages from '@mui-internal/api-docs-builder/utils/findApiPages';
import generateUtilityClass, { isGlobalState } from '@mui/utils/generateUtilityClass';
import { getComponentImports, getComponentInfo } from './getComponentInfo';

type PageType = { pathname: string; title: string; plan?: 'community' | 'pro' | 'premium' };

export const projectChartsSettings: ProjectSettings = {
  output: {
    apiManifestPath: path.join(process.cwd(), 'docs/data/charts-component-api-pages.ts'),
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
      name: 'charts',
      rootPath: path.join(process.cwd(), 'packages/x-charts'),
      entryPointPath: 'src/index.ts',
    },
    {
      name: 'charts-pro',
      rootPath: path.join(process.cwd(), 'packages/x-charts-pro'),
      entryPointPath: 'src/index.ts',
    },
  ],
  getApiPages: () => findApiPages('docs/pages/x/api/charts'),
  getComponentInfo,
  translationLanguages: LANGUAGES,
  skipComponent(filename) {
    if (filename.includes('/context/')) {
      return true;
    }
    return [
      'x-charts/src/Gauge/GaugeReferenceArc.tsx',
      'x-charts/src/Gauge/GaugeValueArc.tsx',
      'x-charts/src/Gauge/GaugeValueText.tsx',
      'x-charts/src/ChartsReferenceLine/ChartsXReferenceLine.tsx',
      'x-charts/src/ChartsReferenceLine/ChartsYReferenceLine.tsx',
      'x-charts/src/ChartsOverlay/ChartsOverlay.tsx',
      'x-charts/src/ChartsOverlay/ChartsNoDataOverlay.tsx',
      'x-charts/src/ChartsOverlay/ChartsLoadingOverlay.tsx',
      'x-charts/src/ChartsLegend/LegendPerItem.tsx',
    ].some((invalidPath) => filename.endsWith(invalidPath));
  },
  skipAnnotatingComponentDefinition: true,
  translationPagesDirectory: 'docs/translations/api-docs/charts',
  importTranslationPagesDirectory: 'docsx/translations/api-docs/charts',
  getComponentImports,
  propsSettings: {
    // propsWithoutDefaultVerification: [],
  },
  sortingStrategies: {
    slotsSort: (a, b) => a.name.localeCompare(b.name),
  },
  generateClassName: generateUtilityClass,
  isGlobalClassName: isGlobalState,
};
