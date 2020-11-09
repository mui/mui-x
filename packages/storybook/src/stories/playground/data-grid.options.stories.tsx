import * as React from 'react';
import { ColDef, DataGrid, DataGridProps, SortDirection } from '@material-ui/data-grid';
import { array, boolean, number, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { useData } from '../../hooks/useData';

export default {
  title: 'Data-Grid Demos/Options Events',
  component: DataGrid,
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: 'storybook/knobs/panel' },
    docs: {
      page: null,
    },
  },
};

export const Options = () => {
  const { columns, rows } = useData(2000, 200);
  const rowsPerPageOptions = array('rowsPerPageOptions', ['25', '50', '100'], ', ');
  const sortingOrder = array('sortingOrder', ['asc', 'desc', 'null'], ', ');

  const dataGridProps: Partial<DataGridProps> = {
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

  return <DataGrid rows={rows} columns={columns as ColDef[]} {...dataGridProps} />;
};
export const Events = () => {
  const { rows, columns } = useData(2000, 200);

  const options: Partial<DataGridProps> = {
    onRowClick: (params) => action('onRowClick')(params),
    onCellClick: (params) => action('onCellClick')(params),
    onColumnHeaderClick: (params) => action('onColumnHeaderClick')(params),
    onRowSelected: (params) => action('onRowSelected')(params),
    onSelectionChange: (params) => action('onSelectionChange', { depth: 1 })(params),
    onPageChange: (params) => action('onPageChange')(params),
    onPageSizeChange: (params) => action('onPageSizeChange')(params),
    onSortModelChange: (params) => action('onSortModelChange')(params),
  };

  return <DataGrid rows={rows} columns={columns as ColDef[]} {...options} />;
};

export const ResizableValidation = () => {
  const { rows, columns } = useData(2000, 200);
  columns.forEach((c) => {
    c.resizable = true;
  });

  const options: Partial<DataGridProps> = {
    onRowClick: (params) => action('onRowClick')(params),
    onCellClick: (params) => action('onCellClick')(params),
    onColumnHeaderClick: (params) => action('onColumnHeaderClick')(params),
    onRowSelected: (params) => action('onRowSelected')(params),
    onSelectionChange: (params) => action('onSelectionChange', { depth: 1 })(params),
    onPageChange: (params) => action('onPageChange')(params),
    onPageSizeChange: (params) => action('onPageSizeChange')(params),
    onSortModelChange: (params) => action('onSortModelChange')(params),
  };

  return <DataGrid rows={rows} columns={columns as ColDef[]} {...options} />;
};
