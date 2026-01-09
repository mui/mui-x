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
      .readdirSync(path.join(process.cwd(), 'docs/data/charts'), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && dirent.name !== 'components')
      .map((dirent) => `charts/${dirent.name}`)
      .sort();
  } catch (error) {
    // Fallback to empty array if directory doesn't exist
    console.warn('Could not read the directories:', error);
    return [];
  }
}

export const projectChartsSettings: ProjectSettings = {
  output: {
    apiManifestPath: path.join(process.cwd(), 'docs/data/chartsApiPages.ts'),
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

const chartsApiPages: MuiPage[] = ${JSON.stringify(pages, null, 2)};
export default chartsApiPages;
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
    {
      name: 'charts-premium',
      rootPath: path.join(process.cwd(), 'packages/x-charts-premium'),
      entryPointPath: 'src/index.ts',
    },
  ],
  getApiPages: () => findApiPages('docs/pages/x/api/charts'),
  getComponentInfo,
  translationLanguages: LANGUAGES,
  skipComponent(filename) {
    if (filename.includes('/context/')) {
      if (filename.endsWith('ChartDataProvider.tsx')) {
        return false;
      }
      return true;
    }
    return [
      'x-charts/src/Gauge/GaugeReferenceArc.tsx',
      'x-charts/src/Gauge/GaugeValueArc.tsx',
      'x-charts/src/Gauge/GaugeValueText.tsx',
      'x-charts/src/BarChart/FocusedBar.tsx',
      'x-charts/src/ScatterChart/FocusedScatterMark.tsx',
      'x-charts/src/ChartsReferenceLine/ChartsXReferenceLine.tsx',
      'x-charts/src/ChartsReferenceLine/ChartsYReferenceLine.tsx',
      'x-charts/src/ChartsOverlay/ChartsOverlay.tsx',
      'x-charts/src/ChartsOverlay/ChartsNoDataOverlay.tsx',
      'x-charts/src/ChartsOverlay/ChartsLoadingOverlay.tsx',
      'x-charts/src/LineChart/CircleMarkElement.tsx',
      'x-charts/src/ScatterChart/ScatterMarker.tsx',
      'x-charts/src/BarChart/AnimatedBarElement.tsx',
      'x-charts/src/BarChart/BatchBarPlot/BarGroup.tsx',
      'x-charts/src/BarChart/BatchBarPlot/BatchBarPlot.tsx',
      'x-charts/src/RadarChart/RadarDataProvider/RadarDataProvider.tsx',
      'x-charts/src/LineChart/FocusedLineMark.tsx',
      'x-charts/src/PieChart/FocusedPieArc.tsx',
      'x-charts/src/ScatterChart/BatchScatter.tsx',
      'x-charts/src/BarChart/BatchBarPlot.tsx',
      'x-charts/src/BarChart/IndividualBarPlot.tsx',
      'x-charts-premium/src/BarChartPremium/RangeBar/AnimatedRangeBarElement.tsx',
      'x-charts-premium/src/ChartsRenderer/ChartsRenderer.tsx',
      'x-charts-premium/src/ChartsRenderer/components/PaletteOption.tsx',
    ].some((invalidPath) => filename.endsWith(invalidPath));
  },
  skipAnnotatingComponentDefinition: true,
  translationPagesDirectory: 'docs/translations/api-docs/charts',
  importTranslationPagesDirectory: 'docsx/translations/api-docs/charts',
  getComponentImports,
  propsSettings: {
    propsWithoutDefaultVerification: ['stripeColor'],
  },
  sortingStrategies: {
    slotsSort: (a, b) => a.name.localeCompare(b.name),
  },
  generateClassName: generateUtilityClass,
  isGlobalClassName: isGlobalState,
  nonComponentFolders: [
    ...getNonComponentFolders(),
    'migration/migration-charts-v8',
    'migration/migration-charts-v7',
    'migration/migration-charts-v6',
  ],
};
