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
    // Docs-infra demos keep a single TSX source instead of generated JS.
    'docs/data/**/demos/*/[A-Z]*.tsx',
    // Hooks examples
    'docs/data/**/use[A-Z]*.js',
    'docs/data/**/demos/*/use[A-Z]*.tsx',
    // ================== Exclusions ==================
    '!docs/data/charts/lines/{,demos/*/}GDPperCapita.{js,tsx}',
    '!docs/data/data-grid/list-view/components/*.js',
    // Excludes demos that we don't want
    '!docs/data/**/*NoSnap.*',
    '!docs/data/data-grid/filtering/{,demos/*/}RemoveBuiltInOperators.{js,tsx}', // Needs interaction
    '!docs/data/data-grid/filtering/{,demos/*/}CustomRatingOperator.{js,tsx}', // Needs interaction
    '!docs/data/data-grid/filtering/{,demos/*/}CustomInputComponent.{js,tsx}', // Needs interaction
    '!docs/data/data-grid/server-side-data/{,demos/*/}ServerSideLazyLoadingRevalidation.{js,tsx}', // Flashes cause flaky argos screenshots
    '!docs/data/data-grid/server-side-data/{,demos/*/}ServerSideLazyLoadingTreeDataRevalidation.{js,tsx}', // Flashes cause flaky argos screenshots
    '!docs/data/data-grid/server-side-data/{,demos/*/}ServerSideLazyLoadingGroupingRevalidation.{js,tsx}', // Flashes cause flaky argos screenshots
    '!docs/data/data-grid/server-side-data/{,demos/*/}ServerSideLazyLoadingRevalidationTabs.{js,tsx}', // Flashes cause flaky argos screenshots
    '!docs/data/data-grid/server-side-data/{,demos/*/}ServerSideLazyLoadingFullyReplaced.{js,tsx}', // Flashes cause flaky argos screenshots
    '!docs/data/data-grid/server-side-data/{,demos/*/}ServerSideDataGridRevalidation.{js,tsx}', // Flashes cause flaky argos screenshots
    '!docs/data/data-grid/server-side-data/{,demos/*/}ServerSideTreeDataRevalidation.{js,tsx}', // Flashes cause flaky argos screenshots
    '!docs/data/date-pickers/date-calendar/{,demos/*/}DateCalendarServerRequest.{js,tsx}', // Has random behavior (TODO: Use seeded random)
    '!docs/data/charts/tooltip/{,demos/*/}Custom*.{js,tsx}', // Composition example
    '!docs/data/charts/tooltip/{,demos/*/}Item*.{js,tsx}', // Composition example
    '!docs/data/charts/tooltip/{,demos/*/}AxisFormatter.{js,tsx}',
    '!docs/data/charts/tooltip/{,demos/*/}Formatting.{js,tsx}',
    '!docs/data/charts/tooltip/{,demos/*/}SeriesFormatter.{js,tsx}',
    '!docs/data/charts/tooltip/{,demos/*/}TooltipStyle.{js,tsx}',
    '!docs/data/charts/brush/**/*',
    '!docs/data/data-grid/server-side-data/{,demos/*/}useNestedPagination.{js,tsx}',
    '!docs/data/data-grid/server-side-data/{,demos/*/}NestedPaginationGroupingCell.{js,tsx}',
    '!docs/data/data-grid/tree-data/utils/{,demos/*/}TreeDataSyncRowDataGroupingCell.{js,tsx}',
    '!docs/data/data-grid/tree-data/utils/{,demos/*/}DataStore.{js,tsx}',
    '!docs/data/charts/export/{,demos/*/}ExportOptionSelector.{js,tsx}', // sub-component for demo purpose
    '!docs/data/charts/axis-ticks/{,demos/*/}SelectTimeFrequency.{js,tsx}', // sub-component for demo purpose
    '!docs/data/charts/sankey/{,demos/*/}CustomNodeLabelPlot.{js,tsx}', // sub-component for demo purpose
    '!docs/data/charts/references/{,demos/*/}ReferenceArea.{js,tsx}', // sub-component for demo purpose
    '!docs/data/charts/references/{,demos/*/}ReferencePoint.{js,tsx}', // sub-component for demo purpose
    '!docs/data/charts/scatter/{,demos/*/}ScatterWebGLRenderer.{js,tsx}', // Timeout due to the large number of points.
    '!docs/data/charts/scatter/{,demos/*/}ScatterAsyncRenderer.{js,tsx}', // Progressive renderer paints over several animation frames, screenshots are unstable.
    '!docs/data/charts/range-bar/{,demos/*/}WebGLRangeBars.{js,tsx}', // Timeout due to the large number of bars.

    // Exclude shared utility files that don't have a default export
    '!docs/data/**/shared/*',

    // Streaming demos conflict with the fake timers (cancelAnimationFrame on native timer)
    '!docs/data/chat/core/examples/controlled-state/{,demos/*/}ControlledStateHeadlessChat.{js,tsx}',

    // Exclude codesandbox embedded demos since they're not using packages built from the branch anyway.
    '!docs/data/migration/migration-pickers-v5/{,demos/*/}MobileKeyboardView.{js,tsx}',
    '!docs/data/migration/migration-data-grid-v4/{,demos/*/}CoreV5WithCoreV4.{js,tsx}',
    //
  ],
  { eager: true, import: 'default' },
);
Object.keys(docsImports).forEach((path: string) => {
  const [name, ...suiteArray] = path
    .replace('../../docs/data/', '')
    // Only TSX entries use the new layout during the staged migration.
    // Legacy Data Grid pages also have a `demos` directory: preserve it.
    .replace(/\/demos\/[^/]+(?=\/[^/]+\.tsx$)/, '')
    .replace(/\.(js|tsx)$/, '')
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
    'docs/src/modules/components/overview/pickers/PickersCustomization.tsx',
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
