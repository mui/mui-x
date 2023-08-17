import type { MuiPage } from '@mui/monorepo/docs/src/MuiPage';
import dataGridComponentApi from './data-grid-component-api-pages';
import pickersComponentApi from './date-pickers-component-api-pages';
import chartsComponentApi from './charts-component-api-pages';
import treeViewComponentApi from './tree-view-component-api-pages';

// const isPreview =
//   process.env.NODE_ENV === 'development' ||
//   process.env.CONTEXT === 'deploy-preview' ||
//   process.env.CONTEXT === 'branch-deploy';

const pages: MuiPage[] = [
  {
    pathname: '/blog/mui-x-v6/',
    title: "✨ What's new in v6? ✨",
  },
  {
    pathname: '/x/introduction-group',
    title: 'Introduction',

    children: [
      { pathname: `/x/introduction`, title: 'Overview' },
      { pathname: `/x/introduction/installation` },
      { pathname: `/x/introduction/licensing` },
      { pathname: `/x/introduction/support` },
      { pathname: `/x/introduction/roadmap` },
    ],
  },
  {
    pathname: '/x/react-data-grid-group',
    title: 'Data Grid',

    children: [
      { pathname: '/x/react-data-grid', title: 'Overview' },
      { pathname: '/x/react-data-grid/demo' },
      { pathname: '/x/react-data-grid/getting-started' },
      { pathname: '/x/react-data-grid/layout' },
      {
        pathname: '/x/react-data-grid/columns',
        children: [
          { pathname: '/x/react-data-grid/column-definition' },
          { pathname: '/x/react-data-grid/column-dimensions' },
          { pathname: '/x/react-data-grid/column-visibility' },
          { pathname: '/x/react-data-grid/column-header' },
          { pathname: '/x/react-data-grid/column-menu' },
          { pathname: '/x/react-data-grid/column-spanning' },
          { pathname: '/x/react-data-grid/column-groups' },
          { pathname: '/x/react-data-grid/column-ordering', plan: 'pro' },
          { pathname: '/x/react-data-grid/column-pinning', plan: 'pro' },
        ],
      },
      {
        pathname: '/x/react-data-grid/rows',
        children: [
          { pathname: '/x/react-data-grid/row-definition' },
          { pathname: '/x/react-data-grid/row-updates' },
          { pathname: '/x/react-data-grid/row-height' },
          { pathname: '/x/react-data-grid/row-spanning', title: 'Row spanning 🚧' },
          { pathname: '/x/react-data-grid/master-detail', plan: 'pro' },
          { pathname: '/x/react-data-grid/row-ordering', plan: 'pro' },
          { pathname: '/x/react-data-grid/row-pinning', plan: 'pro' },
          { pathname: '/x/react-data-grid/row-recipes', title: 'Recipes' },
        ],
      },
      { pathname: '/x/react-data-grid/editing' },
      { pathname: '/x/react-data-grid/sorting' },
      {
        pathname: '/x/react-data-grid/filtering-group',
        title: 'Filtering',
        children: [
          { pathname: '/x/react-data-grid/filtering', title: 'Overview' },
          { pathname: '/x/react-data-grid/filtering/customization' },
          { pathname: '/x/react-data-grid/filtering/quick-filter' },
          { pathname: '/x/react-data-grid/filtering/server-side', title: 'Server-side filter' },
          { pathname: '/x/react-data-grid/filtering/multi-filters', plan: 'pro' },
          {
            pathname: '/x/react-data-grid/filtering/header-filters',
            plan: 'pro',
            newFeature: true,
          },
        ],
      },
      { pathname: '/x/react-data-grid/pagination' },
      {
        pathname: '/x/react-data-grid/selection',
        children: [
          { pathname: '/x/react-data-grid/row-selection' },
          { pathname: '/x/react-data-grid/cell-selection', plan: 'premium', newFeature: true },
        ],
      },
      { pathname: '/x/react-data-grid/export' },
      { pathname: '/x/react-data-grid/clipboard', title: 'Copy and paste', newFeature: true },
      { pathname: '/x/react-data-grid/components', title: 'Custom subcomponents' },
      { pathname: '/x/react-data-grid/style' },
      { pathname: '/x/react-data-grid/localization' },
      { pathname: '/x/react-data-grid/scrolling' },
      { pathname: '/x/react-data-grid/virtualization' },
      { pathname: '/x/react-data-grid/accessibility' },
      { pathname: '/x/react-data-grid/performance' },
      {
        pathname: '/x/react-data-grid-group-pivot',
        title: 'Group & Pivot',
        plan: 'pro',
        children: [
          { pathname: '/x/react-data-grid/tree-data', plan: 'pro' },
          { pathname: '/x/react-data-grid/row-grouping', plan: 'premium' },
          { pathname: '/x/react-data-grid/aggregation', title: 'Aggregation', plan: 'premium' },
          { pathname: '/x/react-data-grid/pivoting', title: 'Pivoting 🚧', plan: 'premium' },
        ],
      },
      {
        title: 'Advanced',
        pathname: '/x/react-data-grid/advanced',
        children: [
          { pathname: '/x/react-data-grid/api-object', title: 'API object' },
          { pathname: '/x/react-data-grid/events' },
          { pathname: '/x/react-data-grid/state' },
        ],
      },
      {
        title: 'Recipes',
        pathname: '/x/react-data-grid/recipes',
        children: [
          { pathname: '/x/react-data-grid/recipes-editing', title: 'Editing' },
          {
            pathname: '/x/react-data-grid/recipes-row-grouping',
            title: 'Row grouping',
            plan: 'premium',
          },
        ],
      },
      {
        pathname: '/x/api/data-grid-group',
        title: 'API Reference',
        children: [
          { pathname: '/x/api/data-grid', title: 'Index' },
          {
            pathname: '/x/api/data-grid-components-group',
            subheader: 'Components',
            children: [...dataGridComponentApi],
          },
          {
            pathname: '/x/api/data-grid-interfaces-group',
            subheader: 'Interfaces',
            children: [
              { pathname: '/x/api/data-grid/grid-api', title: 'GridApi' },
              { pathname: '/x/api/data-grid/grid-cell-params', title: 'GridCellParams' },
              { pathname: '/x/api/data-grid/grid-col-def', title: 'GridColDef' },
              {
                pathname: '/x/api/data-grid/grid-single-select-col-def',
                title: 'GridSingleSelectColDef',
              },

              { pathname: '/x/api/data-grid/grid-actions-col-def', title: 'GridActionsColDef' },
              {
                pathname: '/x/api/data-grid/grid-export-state-params',
                title: 'GridExportStateParams',
              },
              { pathname: '/x/api/data-grid/grid-filter-item', title: 'GridFilterItem' },
              { pathname: '/x/api/data-grid/grid-filter-model', title: 'GridFilterModel' },
              { pathname: '/x/api/data-grid/grid-filter-operator', title: 'GridFilterOperator' },
              {
                pathname: '/x/api/data-grid/grid-row-class-name-params',
                title: 'GridRowClassNameParams',
              },
              { pathname: '/x/api/data-grid/grid-row-params', title: 'GridRowParams' },
              {
                pathname: '/x/api/data-grid/grid-row-spacing-params',
                title: 'GridRowSpacingParams',
              },
              {
                pathname: '/x/api/data-grid/grid-aggregation-function',
                title: 'GridAggregationFunction',
              },
              {
                pathname: '/x/api/data-grid/grid-csv-export-options',
                title: 'GridCsvExportOptions',
              },
              {
                pathname: '/x/api/data-grid/grid-print-export-options',
                title: 'GridPrintExportOptions',
              },
              {
                pathname: '/x/api/data-grid/grid-excel-export-options',
                title: 'GridExcelExportOptions',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    pathname: '/x/react-date-pickers-group',
    title: 'Date and Time Pickers',
    children: [
      { pathname: '/x/react-date-pickers', title: 'Overview' },
      { pathname: '/x/react-date-pickers/getting-started' },
      { pathname: '/x/react-date-pickers/base-concepts' },
      {
        pathname: '/x/react-date-pickers/date-pickers',
        title: 'Date components',
        children: [
          { pathname: '/x/react-date-pickers/date-picker', title: 'Date Picker' },
          { pathname: '/x/react-date-pickers/date-field', title: 'Date Field', newFeature: true },
          { pathname: '/x/react-date-pickers/date-calendar', title: 'Date Calendar' },
        ],
      },
      {
        pathname: '/x/react-date-pickers/time-pickers',
        title: 'Time components',
        children: [
          { pathname: '/x/react-date-pickers/time-picker', title: 'Time Picker' },
          { pathname: '/x/react-date-pickers/time-field', title: 'Time Field', newFeature: true },
          { pathname: '/x/react-date-pickers/time-clock', title: 'Time Clock' },
          {
            pathname: '/x/react-date-pickers/digital-clock',
            title: 'Digital Clock',
            newFeature: true,
          },
        ],
      },
      {
        pathname: '/x/react-date-pickers/date-time-pickers',
        title: 'Date Time components',
        children: [
          { pathname: '/x/react-date-pickers/date-time-picker', title: 'Date Time Picker' },
          {
            pathname: '/x/react-date-pickers/date-time-field',
            title: 'Date Time Field',
            newFeature: true,
          },
        ],
      },
      {
        pathname: '/x/react-date-pickers/date-range-pickers',
        title: 'Date Range components',
        plan: 'pro',
        children: [
          { pathname: '/x/react-date-pickers/date-range-picker', title: 'Date Range Picker' },
          {
            pathname: '/x/react-date-pickers/date-range-field',
            title: 'Date Range Field',
            newFeature: true,
          },
          {
            pathname: '/x/react-date-pickers/date-range-calendar',
            title: 'Date Range Calendar',
            newFeature: true,
          },
        ],
      },
      {
        pathname: '/x/react-date-pickers/time-range-pickers',
        title: 'Time Range components',
        plan: 'pro',
        children: [
          { pathname: '/x/react-date-pickers/time-range-picker', title: 'Time Range Picker 🚧' },
          {
            pathname: '/x/react-date-pickers/time-range-field',
            title: 'Time Range Field',
            newFeature: true,
          },
        ],
      },
      {
        pathname: '/x/react-date-pickers/date-time-range-pickers',
        title: 'Date Time Range components',
        plan: 'pro',
        children: [
          {
            pathname: '/x/react-date-pickers/date-time-range-picker',
            title: 'Date Time Range Picker 🚧',
          },
          {
            pathname: '/x/react-date-pickers/date-time-range-field',
            title: 'Date Time Range Field',
            newFeature: true,
          },
        ],
      },
      { pathname: '/x/react-date-pickers/validation' },
      {
        pathname: '/x/react-date-pickers/localization-group',
        title: 'Localization',
        children: [
          {
            pathname: '/x/react-date-pickers/adapters-locale',
            title: 'Date localization',
          },
          {
            pathname: '/x/react-date-pickers/timezone',
            title: 'UTC and timezone',
          },
          {
            pathname: '/x/react-date-pickers/localization',
            title: 'Component localization',
          },
          { pathname: '/x/react-date-pickers/calendar-systems' },
        ],
      },
      { pathname: '/x/react-date-pickers/lifecycle', title: 'Components lifecycle' },
      { pathname: '/x/react-date-pickers/fields', title: 'Field components', newFeature: true },
      {
        pathname: '/x/react-date-pickers/visual-customization',
        title: 'Visual customization',
        children: [
          { pathname: '/x/react-date-pickers/custom-components', title: 'Custom subcomponents' },
          { pathname: '/x/react-date-pickers/custom-layout' },
          { pathname: '/x/react-date-pickers/custom-field' },
          { pathname: '/x/react-date-pickers/shortcuts' },
        ],
      },
      { pathname: '/x/react-date-pickers/playground', title: 'Playground' },
      {
        pathname: '/x/api/date-pickers-group',
        title: 'API Reference',
        children: [{ pathname: '/x/api/date-pickers', title: 'Index' }, ...pickersComponentApi],
      },
    ],
  },
  {
    pathname: '/x/react-charts-group',
    title: 'Charts 🧪',
    newFeature: true,
    children: [
      { pathname: '/x/react-charts', title: 'Overview' },
      {
        pathname: '/x/react-charts-bars',
        title: 'Bars',
        children: [
          { pathname: '/x/react-charts/bars', title: 'Bars' },
          { pathname: '/x/react-charts/bar-demo', title: 'Demo' },
        ],
      },
      {
        pathname: '/x/react-charts-lines',
        title: 'Lines',
        children: [
          { pathname: '/x/react-charts/lines', title: 'Lines' },
          { pathname: '/x/react-charts/line-demo', title: 'Demo lines' },
          { pathname: '/x/react-charts/areas-demo', title: 'Demo area' },
        ],
      },
      {
        pathname: '/x/react-charts-pie',
        title: 'Pie',
        children: [
          { pathname: '/x/react-charts/pie', title: 'Pie' },
          { pathname: '/x/react-charts/pie-demo', title: 'Demo' },
        ],
      },
      {
        pathname: '/x/react-charts-scatter',
        title: 'Scatter',
        children: [
          { pathname: '/x/react-charts/scatter', title: 'Scatter' },
          { pathname: '/x/react-charts/scatter-demo', title: 'Demo' },
        ],
      },
      {
        pathname: '/x/react-charts/sparkline',
        title: 'Sparkline',
      },
      { pathname: '/x/react-charts/axis', title: 'Axis' },
      { pathname: '/x/react-charts/components', title: 'Custom components' },
      { pathname: '/x/react-charts/legend', title: 'Legend' },
      { pathname: '/x/react-charts/stacking', title: 'Stacking' },
      { pathname: '/x/react-charts/styling', title: 'Styling' },
      { pathname: '/x/react-charts/tooltip', title: 'Tooltip' },
      {
        pathname: '/x/api/charts-group',
        title: 'API Reference',
        children: [...chartsComponentApi],
      },
      { pathname: '/x/react-charts/heat-map', title: 'Heat map 🚧' },
      { pathname: '/x/react-charts/funnel', title: 'Funnel 🚧' },
      { pathname: '/x/react-charts/gantt', title: 'Gantt 🚧' },
      { pathname: '/x/react-charts/radar', title: 'Radar 🚧' },
      { pathname: '/x/react-charts/sankey', title: 'Sankey 🚧' },
      { pathname: '/x/react-charts/tree-map', title: 'Tree map 🚧' },
    ],
  },
  {
    pathname: '/x/react-tree-view-group',
    title: 'Tree View',
    newFeature: true,
    children: [
      { pathname: '/x/react-tree-view', title: 'Overview' },
      {
        pathname: '/x/api/tree-view-group',
        title: 'API Reference',
        children: [...treeViewComponentApi],
      },
    ],
  },
  {
    pathname: '/x/migration-group',
    title: 'Migration',
    children: [
      {
        pathname: '/x/migration-v6',
        subheader: 'Upgrade to v6',
        children: [
          { pathname: '/x/migration/migration-data-grid-v5', title: 'Breaking changes: Data Grid' },
          {
            pathname: '/x/migration/migration-pickers-v5',
            title: 'Breaking changes: Date and Time Pickers',
          },
          {
            pathname: '/x/migration/migration-tree-view-lab',
            title: 'Migration from lab to v6 (Tree View)',
          },
        ],
      },
      {
        pathname: '/x/migration-earlier',
        subheader: 'Earlier versions',
        children: [
          {
            pathname: '/x/migration/migration-pickers-lab',
            title: 'Migration from lab to v5 (Date and Time Pickers)',
          },
          {
            pathname: '/x/migration/migration-data-grid-v4',
            title: 'Migration from v4 to v5 (Data Grid)',
          },
        ],
      },
    ],
  },
];

export default pages;
