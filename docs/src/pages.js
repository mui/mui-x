import pages from '@material-ui/monorepo/docs/src/pages';

const components = pages[1];

if (components.pathname !== '/components') {
  throw new Error('Integration not compatible.');
}

const lab = components.children[components.children.length - 1];

if (lab.subheader !== '/components/lab') {
  throw new Error('Integration not compatible.');
}

const datagrid = lab.children[3];

if (datagrid.subheader !== '/components/data-grid') {
  throw new Error('Integration not compatible.');
}

datagrid.children =
  process.env.PULL_REQUEST === 'false'
    ? [
        {
          pathname: '/components/data-grid',
          title: 'Overview',
        },
        { pathname: '/components/data-grid/getting-started' },
        { pathname: '/components/data-grid/columns' },
        { pathname: '/components/data-grid/rows' },
        { pathname: '/components/data-grid/sorting' },
        { pathname: '/components/data-grid/filtering' },
        { pathname: '/components/data-grid/pagination' },
        { pathname: '/components/data-grid/selection' },
        { pathname: '/components/data-grid/editing', title: '🚧 Editing' },
        { pathname: '/components/data-grid/rendering' },
        { pathname: '/components/data-grid/export', title: '🚧 Export & Import' },
        { pathname: '/components/data-grid/localization', title: 'Localization' },
        { pathname: '/components/data-grid/group-pivot', title: '🚧 Group & Pivot' },
        { pathname: '/components/data-grid/accessibility' },
      ]
    : [
        {
          pathname: '/components/data-grid',
          title: 'Overview',
        },
        { pathname: '/components/data-grid/getting-started' },
        { pathname: '/components/data-grid/columns' },
        { pathname: '/components/data-grid/rows' },
        { pathname: '/components/data-grid/sorting' },
        { pathname: '/components/data-grid/filtering' },
        { pathname: '/components/data-grid/pagination' },
        { pathname: '/components/data-grid/selection' },
        { pathname: '/components/data-grid/editing', title: '🚧 Editing' },
        { pathname: '/components/data-grid/rendering' },
        { pathname: '/components/data-grid/export', title: '🚧 Export & Import' },
        { pathname: '/components/data-grid/localization', title: 'Localization' },
        { pathname: '/components/data-grid/group-pivot', title: '🚧 Group & Pivot' },
        { pathname: '/components/data-grid/accessibility' },
      ];

export default pages;
