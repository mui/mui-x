import type { MuiPage } from '@mui/monorepo/docs/src/MuiPage';

const pages: MuiPage[] = [
  {
    pathname: '/x/introduction',
    scopePathnames: ['/x/introduction'],
    icon: 'DescriptionIcon',
    children: [
      { pathname: `/x/introduction`, title: 'Overview' },
      { pathname: `/x/introduction/installation` },
      { pathname: `/x/introduction/licensing` },
      { pathname: `/x/introduction/support` },
      { pathname: `/x/introduction/roadmap` },
    ],
  },
  {
    pathname: '/x/react-data-grid',
    scopePathnames: ['/x/api/data-grid'],
    title: 'Data grid',
    icon: 'TableViewIcon',
    children: [
      { pathname: '/x/react-data-grid', title: 'Overview' },
      { pathname: '/x/react-data-grid/demo' },
      { pathname: '/x/react-data-grid/getting-started' },
      { pathname: '/x/react-data-grid/migration-v4', title: 'Migration from v4' },
      { pathname: '/x/react-data-grid/layout' },
      {
        pathname: '/x/react-data-grid/columns',
        scopePathnames: ['/x/react-data-grid/column-'],
        children: [
          { pathname: '/x/react-data-grid/column-definition' },
          { pathname: '/x/react-data-grid/column-dimensions' },
          { pathname: '/x/react-data-grid/column-visibility' },
          { pathname: '/x/react-data-grid/column-header' },
          { pathname: '/x/react-data-grid/column-ordering', plan: 'pro' },
          { pathname: '/x/react-data-grid/column-pinning', plan: 'pro' },
          { pathname: '/x/react-data-grid/column-spanning' },
          { pathname: '/x/react-data-grid/column-groups' },
        ],
      },
      {
        pathname: '/x/react-data-grid/rows',
        scopePathnames: ['/x/react-data-grid/row-', '/x/react-data-grid/master-detail'],
        children: [
          { pathname: '/x/react-data-grid/row-definition' },
          { pathname: '/x/react-data-grid/row-updates' },
          { pathname: '/x/react-data-grid/row-height' },
          { pathname: '/x/react-data-grid/master-detail', plan: 'pro' },
          { pathname: '/x/react-data-grid/row-ordering', plan: 'pro' },
          { pathname: '/x/react-data-grid/row-pinning', plan: 'pro' },
          { pathname: '/x/react-data-grid/row-spanning', title: 'Row spanning 🚧' },
        ],
      },
      { pathname: '/x/react-data-grid/editing' },
      { pathname: '/x/react-data-grid/sorting' },
      { pathname: '/x/react-data-grid/filtering' },
      { pathname: '/x/react-data-grid/pagination' },
      { pathname: '/x/react-data-grid/selection' },
      { pathname: '/x/react-data-grid/export' },
      { pathname: '/x/react-data-grid/components' },
      { pathname: '/x/react-data-grid/style' },
      { pathname: '/x/react-data-grid/localization' },
      { pathname: '/x/react-data-grid/scrolling' },
      { pathname: '/x/react-data-grid/virtualization' },
      { pathname: '/x/react-data-grid/accessibility' },
      {
        pathname: '/x/react-data-grid/row-grouping',
        title: 'Group & Pivot',
        scopePathnames: [
          '/x/react-data-grid/row-grouping',
          '/x/react-data-grid/tree-data',
          '/x/react-data-grid/aggregation',
          '/x/react-data-grid/pivoting',
        ],
        children: [
          { pathname: '/x/react-data-grid/row-grouping', plan: 'premium' },
          { pathname: '/x/react-data-grid/tree-data', plan: 'pro' },
          { pathname: '/x/react-data-grid/aggregation', title: 'Aggregation', plan: 'premium' },
          { pathname: '/x/react-data-grid/pivoting', title: 'Pivoting 🚧', plan: 'premium' },
        ],
      },
      {
        title: 'Advanced',
        pathname: '/x/react-data-grid/api-object',
        scopePathnames: [
          '/x/react-data-grid/api-object',
          '/x/react-data-grid/events',
          '/x/react-data-grid/state',
        ],
        children: [
          { pathname: '/x/react-data-grid/api-object', title: 'API object' },
          { pathname: '/x/react-data-grid/events' },
          { pathname: '/x/react-data-grid/state' },
        ],
      },
      {
        title: 'Recipes',
        pathname: '/x/react-data-grid/recipes',
        scopePathnames: ['/x/react-data-grid/recipes-'],
        children: [
          { pathname: '/x/react-data-grid/recipes-editing', title: 'Editing' },
          { pathname: '/x/react-data-grid/recipes-row-grouping', title: 'Row grouping' },
        ],
      },
      {
        pathname: '/x/api/data-grid',
        title: 'API Reference',
        children: [
          { pathname: '/x/api/data-grid', title: 'Index' },
          { pathname: '/x/api/data-grid/data-grid', title: 'DataGrid' },
          { pathname: '/x/api/data-grid/data-grid-pro', title: 'DataGridPro' },
          { pathname: '/x/api/data-grid/data-grid-premium', title: 'DataGridPremium' },
          { pathname: '/x/api/data-grid/grid-api', title: 'GridApi' },
          { pathname: '/x/api/data-grid/grid-cell-params', title: 'GridCellParams' },
          { pathname: '/x/api/data-grid/grid-col-def', title: 'GridColDef' },
          { pathname: '/x/api/data-grid/grid-export-state-params', title: 'GridExportStateParams' },
          { pathname: '/x/api/data-grid/grid-filter-form', title: 'GridFilterForm' },
          { pathname: '/x/api/data-grid/grid-filter-item', title: 'GridFilterItem' },
          { pathname: '/x/api/data-grid/grid-filter-model', title: 'GridFilterModel' },
          { pathname: '/x/api/data-grid/grid-filter-operator', title: 'GridFilterOperator' },
          { pathname: '/x/api/data-grid/grid-filter-panel', title: 'GridFilterPanel' },
          {
            pathname: '/x/api/data-grid/grid-row-class-name-params',
            title: 'GridRowClassNameParams',
          },
          { pathname: '/x/api/data-grid/grid-row-params', title: 'GridRowParams' },
          { pathname: '/x/api/data-grid/grid-row-spacing-params', title: 'GridRowSpacingParams' },
          {
            pathname: '/x/api/data-grid/grid-aggregation-function',
            title: 'GridAggregationFunction',
          },
          { pathname: '/x/api/data-grid/grid-csv-export-options', title: 'GridCsvExportOptions' },
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
  {
    pathname: '/x/react-date-pickers',
    scopePathnames: ['/x/api/date-pickers'],
    title: 'Date and Time pickers',
    icon: 'DatePickerIcon',
    children: [
      { pathname: '/x/react-date-pickers/getting-started' },
      { pathname: '/x/react-date-pickers/migration-lab', title: 'Migration from the lab' },
      {
        pathname: '/react-date-pickers/pickers',
        title: 'Picker components',
        scopePathnames: [
          '/x/react-date-pickers/date-picker',
          '/x/react-date-pickers/date-range-picker',
          '/x/react-date-pickers/date-time-picker',
          '/x/react-date-pickers/date-time-range-picker',
          '/x/react-date-pickers/time-picker',
          '/x/react-date-pickers/time-range-picker',
        ],
        children: [
          { pathname: '/x/react-date-pickers/date-picker' },
          {
            pathname: '/x/react-date-pickers/date-range-picker',
            plan: 'pro',
          },
          { pathname: '/x/react-date-pickers/date-time-picker' },
          {
            pathname: '/x/react-date-pickers/date-time-range-picker',
            title: 'Date time range picker 🚧',
            plan: 'pro',
          },
          { pathname: '/x/react-date-pickers/time-picker' },
          {
            pathname: '/x/react-date-pickers/time-range-picker',
            title: 'Time range picker 🚧',
            plan: 'pro',
          },
        ],
      },
      { pathname: '/x/react-date-pickers/localization' },
      { pathname: '/x/react-date-pickers/custom-components' },
      {
        pathname: '/x/api/date-pickers',
        title: 'API Reference',
        children: [
          { pathname: '/x/api/date-pickers', title: 'Index' },
          { pathname: '/x/api/date-pickers/calendar-picker', title: 'CalendarPicker' },
          {
            pathname: '/x/api/date-pickers/calendar-picker-skeleton',
            title: 'CalendarPickerSkeleton',
          },
          { pathname: '/x/api/date-pickers/clock-picker', title: 'ClockPicker' },
          { pathname: '/x/api/date-pickers/date-picker', title: 'DatePicker' },
          {
            pathname: '/x/api/date-pickers/date-range-picker',
            title: 'DateRangePicker',
            plan: 'pro',
          },
          {
            pathname: '/x/api/date-pickers/date-range-picker-day',
            title: 'DateRangePickerDay',
            plan: 'pro',
          },
          { pathname: '/x/api/date-pickers/date-time-picker', title: 'DateTimePicker' },
          { pathname: '/x/api/date-pickers/desktop-date-picker', title: 'DesktopDatePicker' },
          {
            pathname: '/x/api/date-pickers/desktop-date-range-picker',
            title: 'DesktopDateRangePicker',
            plan: 'pro',
          },
          {
            pathname: '/x/api/date-pickers/desktop-date-time-picker',
            title: 'DesktopDateTimePicker',
          },
          { pathname: '/x/api/date-pickers/desktop-time-picker', title: 'DesktopTimePicker' },
          { pathname: '/x/api/date-pickers/localization-provider', title: 'LocalizationProvider' },
          { pathname: '/x/api/date-pickers/mobile-date-picker', title: 'MobileDatePicker' },
          {
            pathname: '/x/api/date-pickers/mobile-date-range-picker',
            title: 'MobileDateRangePicker',
            plan: 'pro',
          },
          {
            pathname: '/x/api/date-pickers/mobile-date-time-picker',
            title: 'MobileDateTimePicker',
          },
          { pathname: '/x/api/date-pickers/mobile-time-picker', title: 'MobileTimePicker' },
          { pathname: '/x/api/date-pickers/month-picker', title: 'MonthPicker' },
          { pathname: '/x/api/date-pickers/pickers-day', title: 'PickersDay' },
          { pathname: '/x/api/date-pickers/static-date-picker', title: 'StaticDatePicker' },
          {
            pathname: '/x/api/date-pickers/static-date-range-picker',
            title: 'StaticDateRangePicker',
            plan: 'pro',
          },
          {
            pathname: '/x/api/date-pickers/static-date-time-picker',
            title: 'StaticDateTimePicker',
          },
          { pathname: '/x/api/date-pickers/static-time-picker', title: 'StaticTimePicker' },
          { pathname: '/x/api/date-pickers/time-picker', title: 'TimePicker' },
          { pathname: '/x/api/date-pickers/year-picker', title: 'YearPicker' },
        ],
      },
    ],
  },
];

export default pages;
