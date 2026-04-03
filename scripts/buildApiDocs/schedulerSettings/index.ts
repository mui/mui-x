import path from 'path';
import fs from 'fs';
import { LANGUAGES } from 'docsx/config';
import { ProjectSettings, ComponentReactApi, HookReactApi } from '@mui-internal/api-docs-builder';
import findApiPages from '@mui-internal/api-docs-builder/utils/findApiPages';
import generateUtilityClass, { isGlobalState } from '@mui/utils/generateUtilityClass';
import { getComponentImports, getComponentInfo } from './getComponentInfo';

type PageType = { pathname: string; title: string; plan?: 'community' | 'pro' | 'premium' };

function getNonComponentFolders(): string[] {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), 'docs/data/scheduler'), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && dirent.name !== 'components')
      .map((dirent) => `scheduler/${dirent.name}`)
      .sort();
  } catch (error) {
    console.warn('Could not read the directories:', error);
    return [];
  }
}

export const projectSchedulerSettings: ProjectSettings = {
  output: {
    apiManifestPath: path.join(process.cwd(), 'docs/data/schedulerApiPages.ts'),
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

        const plan = filename.includes('-premium') && 'premium';

        return { pathname: apiPathname, title: name, ...(plan ? { plan } : {}) };
      })
      .filter((page): page is PageType => page !== null)
      .sort((a: PageType, b: PageType) => a.title.localeCompare(b.title));

    return `import type { MuiPage } from '@mui/internal-core-docs/MuiPage';

const schedulerApiPages: MuiPage[] = ${JSON.stringify(pages, null, 2)};
export default schedulerApiPages;
`;
  },
  typeScriptProjects: [
    {
      name: 'scheduler',
      rootPath: path.join(process.cwd(), 'packages/x-scheduler'),
      entryPointPath: 'src/index.ts',
    },
    {
      name: 'scheduler-premium',
      rootPath: path.join(process.cwd(), 'packages/x-scheduler-premium'),
      entryPointPath: 'src/index.ts',
    },
  ],
  getApiPages: () => findApiPages('docs/pages/x/api/scheduler'),
  getComponentInfo,
  translationLanguages: LANGUAGES,
  skipComponent(filename) {
    if (
      filename.includes('/internals/') ||
      filename.includes('/locales/') ||
      filename.includes('/models/') ||
      filename.includes('/theme-augmentation/') ||
      filename.includes('/utils/')
    ) {
      return true;
    }
    return [
      // Internal views (used inside EventCalendar, users should use Standalone variants)
      'x-scheduler/src/agenda-view/AgendaView.tsx',
      'x-scheduler/src/day-view/DayView.tsx',
      'x-scheduler/src/month-view/MonthView.tsx',
      'x-scheduler/src/week-view/WeekView.tsx',
      // Internal sub-components of EventCalendar
      'x-scheduler/src/event-calendar/EventCalendarRoot.tsx',
      'x-scheduler/src/event-calendar/header-toolbar/HeaderToolbar.tsx',
      'x-scheduler/src/event-calendar/header-toolbar/preferences-menu/PreferencesMenu.tsx',
      'x-scheduler/src/event-calendar/header-toolbar/view-switcher/ViewSwitcher.tsx',
      'x-scheduler/src/event-calendar/mini-calendar/MiniCalendar.tsx',
      'x-scheduler/src/event-calendar/resources-legend/ResourcesLegend.tsx',
      // Internal sub-components of MonthView
      'x-scheduler/src/month-view/month-view-row/MonthViewCell.tsx',
      'x-scheduler/src/month-view/month-view-row/MonthViewWeekRow.tsx',
      // Internal sub-components of EventTimelinePremium
      'x-scheduler-premium/src/event-timeline-premium/content/EventTimelinePremiumContent.tsx',
      'x-scheduler-premium/src/event-timeline-premium/content/timeline-event/EventTimelinePremiumEvent.tsx',
      'x-scheduler-premium/src/event-timeline-premium/content/timeline-title-cell/EventTimelinePremiumTitleCell.tsx',
      'x-scheduler-premium/src/event-timeline-premium/content/view-header/DaysHeader.tsx',
      'x-scheduler-premium/src/event-timeline-premium/content/view-header/MonthsHeader.tsx',
      'x-scheduler-premium/src/event-timeline-premium/content/view-header/TimeHeader.tsx',
      'x-scheduler-premium/src/event-timeline-premium/content/view-header/WeeksHeader.tsx',
      'x-scheduler-premium/src/event-timeline-premium/content/view-header/YearsHeader.tsx',
    ].some((invalidPath) => filename.endsWith(invalidPath));
  },
  skipAnnotatingComponentDefinition: true,
  translationPagesDirectory: 'docs/translations/api-docs/scheduler',
  importTranslationPagesDirectory: 'docsx/translations/api-docs/scheduler',
  getComponentImports,
  propsSettings: {
    propsWithoutDefaultVerification: [],
  },
  sortingStrategies: {
    slotsSort: (a, b) => a.name.localeCompare(b.name),
  },
  generateClassName: generateUtilityClass,
  isGlobalClassName: isGlobalState,
  nonComponentFolders: [...getNonComponentFolders()],
};
