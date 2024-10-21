import type { MuiPage } from 'docs/src/MuiPage';

const apiPages: MuiPage[] = [
  {
    pathname: '/x/api/data-grid/data-grid',
    title: 'DataGrid',
  },
  {
    pathname: '/x/api/data-grid/data-grid-premium',
    title: 'DataGridPremium',
    plan: 'premium',
  },
  {
    pathname: '/x/api/data-grid/data-grid-pro',
    title: 'DataGridPro',
    plan: 'pro',
  },
  {
    pathname: '/x/api/data-grid/grid-filter-form',
    title: 'GridFilterForm',
  },
  {
    pathname: '/x/api/data-grid/grid-filter-panel',
    title: 'GridFilterPanel',
  },
  {
    pathname: '/x/api/data-grid/grid-toolbar-quick-filter',
    title: 'GridToolbarQuickFilter',
  },
];
export default apiPages;
