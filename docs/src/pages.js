import pages from '@mui/monorepo/docs/src/pages';
import xApiPages from './pagesApi.json';

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
];

dataGridComponentAPI.children = [
  { pathname: '/api-docs/data-grid', title: 'API Reference' },
  { pathname: '/api-docs/data-grid/data-grid', title: 'DataGrid' },
  { pathname: '/api-docs/data-grid/data-grid-pro', title: 'DataGridPro' },
  ...xApiPages,
].map((page) => {
  return { ...page, linkProps: { linkAs: `${page.pathname.replace(/^\/api-docs/, '/api')}/` } };
});

export default pages;
