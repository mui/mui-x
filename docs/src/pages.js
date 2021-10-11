import pages from '@material-ui/monorepo/docs/src/pages';

const components = pages[1];
const componentsAPI = pages[2];

if (components.pathname !== '/components') {
  throw new Error('Integration not compatible.');
}

const lab = components.children[components.children.length - 1];

if (lab.subheader !== '/components/lab') {
  throw new Error('Integration not compatible.');
}

const dataGridComponent = components.children[7];

if (dataGridComponent.subheader !== '/components/data-grid') {
  throw new Error('Integration not compatible.');
}

const dataGridComponentAPI = componentsAPI.children.find(
  (page) => page.pathname === '/api-docs/data-grid',
);

dataGridComponent.children = [
  {
    pathname: '/components/data-grid',
    subheader: '/components/data-grid/overview',
    title: 'Overview',
  },
  { pathname: '/components/data-grid/demo' },
  { pathname: '/components/data-grid/getting-started' },
  { pathname: '/components/data-grid/layout' },
  { pathname: '/components/data-grid/columns' },
  { pathname: '/components/data-grid/rows' },
  { pathname: '/components/data-grid/editing' },
  { pathname: '/components/data-grid/sorting' },
  { pathname: '/components/data-grid/filtering' },
  { pathname: '/components/data-grid/pagination' },
  { pathname: '/components/data-grid/selection' },
  { pathname: '/components/data-grid/events' },
  { pathname: '/components/data-grid/export' },
  { pathname: '/components/data-grid/components' },
  { pathname: '/components/data-grid/style' },
  { pathname: '/components/data-grid/localization' },
  { pathname: '/components/data-grid/scrolling' },
  { pathname: '/components/data-grid/virtualization' },
  { pathname: '/components/data-grid/accessibility' },
  { pathname: '/components/data-grid/group-pivot', title: 'Group & Pivot' },
];

dataGridComponentAPI.children = [
  { pathname: '/api-docs/data-grid', title: 'API Reference' },
  { pathname: '/api-docs/data-grid/data-grid', title: 'DataGrid' },
  { pathname: '/api-docs/data-grid/data-grid-pro', title: 'DataGridPro' },
  { pathname: '/api-docs/data-grid/grid-api', title: 'GridApi' },
  { pathname: '/api-docs/data-grid/grid-col-def', title: 'GridColDef' },
  { pathname: '/api-docs/data-grid/grid-cell-params', title: 'GridCellParams' },
  { pathname: '/api-docs/data-grid/grid-row-params', title: 'GridRowParams' },
  { pathname: '/api-docs/data-grid/grid-export-csv-options', title: 'GridExportCSVOptions' },
].map((page) => {
  return { ...page, linkProps: { as: page.pathname.replace(/^\/api-docs/, '/api') } };
});

export default pages;
