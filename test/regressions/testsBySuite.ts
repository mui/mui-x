export interface Test {
  path: string;
  suite: string;
  name: string;
  case: React.ComponentType;
}

const tests: Test[] = [];

const removeExtension = (filePath: string) => {
  const extStart = filePath.lastIndexOf('.');
  return extStart >= 0 ? filePath.slice(0, extStart) : filePath;
};

// Also use some of the demos to avoid code duplication.
const docsImports = import.meta.glob<React.ComponentType>(
  [
    'docs/data/**/[A-Z]*.js',
    // Hooks examples
    'docs/data/**/use[A-Z]*.js',
    // ================== Exclusions ==================
    '!docs/data/charts/lines/GDPperCapita.js',
    '!docs/data/data-grid/list-view/components/*.js',
    // Excludes demos that we don't want
    '!docs/data/**/*NoSnap.*',
    '!docs/data/data-grid/filtering/RemoveBuiltInOperators', // Needs interaction
    '!docs/data/data-grid/filtering/CustomRatingOperator', // Needs interaction
    '!docs/data/data-grid/filtering/CustomInputComponent', // Needs interaction
    '!docs/data/data-grid/server-side-data/ServerSideLazyLoadingRevalidation', // Flashes cause flaky argos screenshots
    '!docs/data/data-grid/server-side-data/ServerSideLazyLoadingFullyReplaced', // Flashes cause flaky argos screenshots
    '!docs/data/data-grid/server-side-data/ServerSideDataGridRevalidation', // Flashes cause flaky argos screenshots
    '!docs/data/data-grid/server-side-data/ServerSideTreeDataRevalidation', // Flashes cause flaky argos screenshots
    '!docs/data/date-pickers/date-calendar/DateCalendarServerRequest', // Has random behavior (TODO: Use seeded random)
    '!docs/data/charts/tooltip/Custom*', // Composition example
    '!docs/data/charts/tooltip/Item*', // Composition example
    '!docs/data/charts/tooltip/AxisFormatter',
    '!docs/data/charts/tooltip/Formatting',
    '!docs/data/charts/tooltip/SeriesFormatter',
    '!docs/data/charts/tooltip/TooltipStyle',
    '!docs/data/charts/brush/*',
    '!docs/data/data-grid/server-side-data/useNestedPagination',
    '!docs/data/data-grid/server-side-data/NestedPaginationGroupingCell',
    '!docs/data/data-grid/tree-data/utils/TreeDataSyncRowDataGroupingCell',
    '!docs/data/data-grid/tree-data/utils/DataStore',
    '!docs/data/charts/export/ExportOptionSelector', // sub-component for demo purpose
    '!docs/data/charts/axis-ticks/SelectTimeFrequency', // sub-component for demo purpose
    '!docs/data/charts/sankey/CustomNodeLabelPlot', // sub-component for demo purpose
    '!docs/data/charts/references/ReferenceArea', // sub-component for demo purpose
    '!docs/data/charts/references/ReferencePoint', // sub-component for demo purpose

    // Exclude shared utility files that don't have a default export
    '!docs/data/**/shared/*',

    // Streaming demos conflict with sinon fake timers (cancelAnimationFrame on native timer)
    '!docs/data/chat/core/examples/controlled-state/ControlledStateHeadlessChat',

    // Exclude codesandbox embedded demos since they're not using packages built from the branch anyway.
    '!docs/data/migration/migration-pickers-v5/MobileKeyboardView',
    '!docs/data/migration/migration-data-grid-v4/CoreV5WithCoreV4',
    //
  ],
  { eager: true, import: 'default' },
);
Object.keys(docsImports).forEach((path: string) => {
  const [name, ...suiteArray] = path
    .replace('../../docs/data/', '')
    .replace('.js', '')
    .split('/')
    .reverse();
  const suite = `docs-${suiteArray.reverse().join('-')}`;

  if (docsImports[path] === undefined) {
    return;
  }

  tests.push({
    path,
    suite,
    name,
    case: docsImports[path],
  });
});

const regressionsImports = import.meta.glob<React.ComponentType>('./data-grid/**/*.{js,tsx}', {
  eager: true,
  import: 'default',
});
Object.keys(regressionsImports).forEach((path: string) => {
  const name = removeExtension(path.replace('./data-grid/', ''));
  const suite = `test-regressions-data-grid`;

  tests.push({
    path,
    suite,
    name,
    case: regressionsImports[path],
  });
});

const chartsImports = import.meta.glob<React.ComponentType>('./charts/**/*.{js,tsx}', {
  eager: true,
  import: 'default',
});
Object.keys(chartsImports).forEach((path: string) => {
  const name = removeExtension(path.replace('./charts/', ''));
  const suite = `test-regressions-charts`;

  tests.push({
    path,
    suite,
    name,
    case: chartsImports[path],
  });
});

const pickersImports = import.meta.glob<React.ComponentType>('./pickers/**/*.{js,tsx}', {
  eager: true,
  import: 'default',
});
Object.keys(pickersImports).forEach((path: string) => {
  const name = removeExtension(path.replace('./pickers/', ''));
  const suite = `test-regressions-pickers`;

  tests.push({
    path,
    suite,
    name,
    case: pickersImports[path],
  });
});

// Bespoke composites used to assemble the product overview pages
// (`/x/react-<product>`). They are not picked up by the `docs/data/**` glob
// above and otherwise have no Argos coverage.
const overviewsImports = import.meta.glob<React.ComponentType>(
  [
    // Charts
    'docs/src/modules/components/overview/charts/mainDemo/MainDemo.tsx',
    'docs/src/modules/components/overview/charts/featuresHighlight/FeaturesHighlight.tsx',
    'docs/src/modules/components/overview/charts/ChartsCommunityOrPro.tsx',
    'docs/src/modules/components/overview/charts/essentialCharts/EssentialCharts.tsx',
    'docs/src/modules/components/overview/charts/advancedCharts/AdvancedChartDemo.tsx',
    'docs/src/modules/components/overview/charts/advancedFeatures/AdvancedFeatures.tsx',
    // Date Pickers
    'docs/src/modules/components/overview/pickers/MainDemo.tsx',
    'docs/src/modules/components/overview/pickers/PickersFeatureHighlight.tsx',
    'docs/src/modules/components/overview/pickers/PickersCommunityOrPro.tsx',
    // PickersCustomization is excluded — its `StaticDateRangePicker` with a
    // custom `PickersLayout` doesn't size its grid columns predictably outside
    // the docs page wrapper, so the second-month calendar overflows past the
    // shortcuts column. Restore once the composite renders cleanly in the
    // isolated fixture, or add a per-fixture wrapper that constrains its width.
    'docs/src/modules/components/overview/pickers/PickersKeyboard.tsx',
    'docs/src/modules/components/overview/pickers/Internationalization.tsx',
    'docs/src/modules/components/overview/pickers/DateLibraries.tsx',
    // Tree View
    'docs/src/modules/components/overview/tree-view/mainDemo/MainDemo.tsx',
    'docs/src/modules/components/overview/tree-view/TreeViewFeaturesHighlight.tsx',
    'docs/src/modules/components/overview/tree-view/TreeViewCommunityOrPro.tsx',
    'docs/src/modules/components/overview/tree-view/playground/Playground.tsx',
    'docs/src/modules/components/overview/tree-view/advancedFeatures/AdvancedFeatures.tsx',
    'docs/src/modules/components/overview/tree-view/TreeViewKeyboard.tsx',
    // Scheduler
    'docs/src/modules/components/overview/scheduler/mainDemo/MainDemo.tsx',
    'docs/src/modules/components/overview/scheduler/SchedulerFeaturesHighlight.tsx',
    'docs/src/modules/components/overview/scheduler/SchedulerCommunityOrPremium.tsx',
    // Chat
    'docs/src/modules/components/overview/chat/mainDemo/MainDemo.tsx',
    'docs/src/modules/components/overview/chat/ChatFeaturesHighlight.tsx',
    'docs/src/modules/components/overview/chat/ChatCommunityOrPro.tsx',
  ],
  { eager: true, import: 'default' },
);
Object.keys(overviewsImports).forEach((path: string) => {
  if (overviewsImports[path] === undefined) {
    return;
  }
  const product = path.split('/overview/')[1].split('/')[0];
  const name = removeExtension(path.split('/').pop()!);
  const suite = `test-regressions-overviews-${product}`;

  tests.push({
    path,
    suite,
    name,
    case: overviewsImports[path],
  });
});

export const testsBySuite = tests.reduce(
  (acc, test) => {
    if (!acc[test.suite]) {
      acc[test.suite] = [];
    }
    acc[test.suite].push(test);
    return acc;
  },
  {} as Record<string, Test[]>,
);
