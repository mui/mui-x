import pages from '@mui/monorepo/docs/src/pages';

const components = pages.find((page) => page.pathname === '/components');
const componentsAPI = pages.find((page) => page.pathname === '/api-docs');

// Add the Date / Time section at the root instead of in the lab
components.children.push({
  title: 'Date / Time',
  pathname: '/components',
  subheader: '/components/pickers',
});

const lab = components.children.find((page) => page.subheader === '/components/lab');
lab.children = lab.children.filter((child) => child.subheader !== '/components/lab-pickers');

const replaceChildren = (parent, pathname, subheader, children) => {
  const node = parent.children.find(
    (page) => page.pathname === pathname && page.subheader === subheader,
  );

  if (!node) {
    throw new Error(`Page ${pathname} ${subheader} not found`);
  }

  node.children = children;
};

replaceChildren(components, '/components', '/components/data-grid', [
  {
    pathname: '/components/data-grid',
    subheader: '/components/data-grid/overview',
    title: 'Overview',
  },
  { pathname: '/components/data-grid/demo' },
  { pathname: '/components/data-grid/getting-started' },
  { pathname: '/components/data-grid/migration-v4', title: 'Migration From v4' },
  { pathname: '/components/data-grid/layout' },
  { pathname: '/components/data-grid/columns' },
  { pathname: '/components/data-grid/rows' },
  { pathname: '/components/data-grid/editing' },
  { pathname: '/components/data-grid/sorting' },
  { pathname: '/components/data-grid/filtering' },
  { pathname: '/components/data-grid/pagination' },
  { pathname: '/components/data-grid/selection' },
  { pathname: '/components/data-grid/events' },
  { pathname: '/components/data-grid/state' },
  { pathname: '/components/data-grid/export' },
  { pathname: '/components/data-grid/components' },
  { pathname: '/components/data-grid/style' },
  { pathname: '/components/data-grid/localization' },
  { pathname: '/components/data-grid/scrolling' },
  { pathname: '/components/data-grid/virtualization' },
  { pathname: '/components/data-grid/accessibility' },
  { pathname: '/components/data-grid/group-pivot', title: 'Group & Pivot' },
]);

replaceChildren(
  componentsAPI,
  '/api-docs/data-grid',
  undefined,
  [
    { pathname: '/api-docs/data-grid', title: 'API Reference' },
    { pathname: '/api-docs/data-grid/data-grid', title: 'DataGrid' },
    { pathname: '/api-docs/data-grid/data-grid-pro', title: 'DataGridPro' },
    { pathname: '/api-docs/data-grid/grid-api', title: 'GridApi' },
    { pathname: '/api-docs/data-grid/grid-col-def', title: 'GridColDef' },
    { pathname: '/api-docs/data-grid/grid-cell-params', title: 'GridCellParams' },
    { pathname: '/api-docs/data-grid/grid-row-params', title: 'GridRowParams' },
    { pathname: '/api-docs/data-grid/grid-csv-export-options', title: 'GridCSVExportOptions' },
    { pathname: '/api-docs/data-grid/grid-print-export-options', title: 'GridPrintExportOptions' },
  { pathname: '/api-docs/data-grid/grid-filter-model', title: 'GridFilterModel' },
  { pathname: '/api-docs/data-grid/grid-filter-item', title: 'GridFilterItem' },
  { pathname: '/api-docs/data-grid/grid-filter-operator', title: 'GridFilterOperator' },
].map((page) => ({
    ...page,
    linkProps: { linkAs: `${page.pathname.replace(/^\/api-docs/, '/api')}/` },
  })),
);

replaceChildren(components, '/components', '/components/pickers', [
  { pathname: '/components/pickers/getting-started' },
  { pathname: '/components/pickers/date-picker' },
  { pathname: '/components/pickers/date-range-picker', title: 'Date Range Picker ⚡️' },
  { pathname: '/components/pickers/date-time-picker' },
  { pathname: '/components/pickers/time-picker' },
]);

export default pages;
