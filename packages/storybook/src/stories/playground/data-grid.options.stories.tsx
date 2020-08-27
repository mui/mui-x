import * as React from 'react';
import { DataGrid, DataGridProps, SortDirection } from '@material-ui/data-grid';
import { array, boolean, number, withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { useData } from '../../hooks/useData';

export default {
  title: 'Data-Grid Demos/Options Events',
  component: DataGrid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/knobs/panel' },
    docs: {
      page: null,
    },
  },
};

export const Options = () => {
  const data = useData(2000, 200);
  const rowsPerPageOptions = array('rowsPerPageOptions', ['25', '50', '100'], ', ');
  const sortingOrder = array('sortingOrder', ['asc', 'desc', 'null'], ', ');

  const dataGridProps: DataGridProps = {
    onRowClick: (params) => action('onRowClick')(params),
    onCellClick: (params) => action('onCellClick')(params),
    onColumnHeaderClick: (params) => action('onColumnHeaderClick')(params),
    onRowSelected: (params) => action('onRowSelected')(params),
    onSelectionChange: (params) => action('onSelectionChange', { depth: 1 })(params),
    onPageChange: (params) => action('onPageChange')(params),
    onPageSizeChange: (params) => action('onPageSizeChange')(params),
    onSortModelChange: (params) => action('onSortModelChange')(params),

    pageSize: number('pageSize', 100),
    autoPageSize: boolean('autoPageSize', false),
    rowsPerPageOptions: rowsPerPageOptions.map((value) => parseInt(value, 10)),
    hideFooterRowCount: boolean('hideFooterRowCount', false),
    hideFooterPagination: boolean('hideFooterPagination', false),
    hideFooter: boolean('hideFooter', false),
    disableExtendRowFullWidth: boolean('disableExtendRowFullWidth', false),
    showCellRightBorder: boolean('showCellRightBorder', false),
    showColumnRightBorder: boolean('showColumnRightBorder', false),
    checkboxSelection: boolean('checkboxSelection', true),
    disableSelectionOnClick: boolean('disableSelectionOnClick', false),
    sortingOrder: sortingOrder.map((value) => (value === 'null' ? null : (value as SortDirection))),
    headerHeight: number('headerHeight', 56),
    rowHeight: number('rowHeight', 52),
  };

  return <DataGrid rows={data.rows} columns={data.columns} {...dataGridProps} />;
};
export const Events = () => {
  const data = useData(2000, 200);

  const options: DataGridProps = {
    onRowClick: (params) => action('onRowClick')(params),
    onCellClick: (params) => action('onCellClick')(params),
    onColumnHeaderClick: (params) => action('onColumnHeaderClick')(params),
    onRowSelected: (params) => action('onRowSelected')(params),
    onSelectionChange: (params) => action('onSelectionChange', { depth: 1 })(params),
    onPageChange: (params) => action('onPageChange')(params),
    onPageSizeChange: (params) => action('onPageSizeChange')(params),
    onSortModelChange: (params) => action('onSortModelChange')(params),
  };

  return <DataGrid rows={data.rows} columns={data.columns} {...options} />;
};
