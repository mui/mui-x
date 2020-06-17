import React from 'react';
import { withA11y } from '@storybook/addon-a11y';
import { Grid, GridOptionsProp, SortDirection } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import '@material-ui/x-grid-data-generator/dist/demo-style.css';
import { Button } from '@material-ui/core';
import { randomInt } from '../../data/random-generator';
import { array, boolean, number, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
  title: 'X-Grid Demos/Playground',
  component: Grid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/knobs/panel' },
    docs: {
      page: null,
    },
  },
};

const rowsPerPageOptions = array('paginationRowsPerPageOptions', ['25', '50', '100'], ', ');
const sortingOrder = array('sortingOrder', ['asc', 'desc', 'null'], ', ');

const getGridOptions: () => GridOptionsProp = () => ({
  onRowClicked: params => action('onRowClicked')(params),
  onCellClicked: params => action('onCellClicked')(params),
  onColumnHeaderClicked: params => action('onColumnHeaderClicked')(params),
  onRowSelected: params => action('onRowSelected')(params),
  onSelectionChanged: params => action('onSelectionChanged')(params),
  onColumnsSorted: params => action('onColumnsSorted')(params),
  onPageChanged: params => action('onPageChanged')(params),
  onPageSizeChanged: params => action('onPageSizeChanged')(params),

  pagination: boolean('pagination', false),
  paginationPageSize: number('paginationPageSize', 100),
  paginationAutoPageSize: boolean('paginationAutoPageSize', false),
  paginationRowsPerPageOptions: rowsPerPageOptions.map(value => parseInt(value, 10)),
  hideFooterRowCount: boolean('hideFooterRowCount', false),
  hideFooterPagination: boolean('hideFooterPagination', false),
  hideFooter: boolean('hideFooter', false),
  extendRowFullWidth: boolean('extendRowFullWidth', true),
  showCellRightBorder: boolean('showCellRightBorder', false),
  showColumnSeparator: boolean('showColumnSeparator', false),
  enableMultipleSelection: boolean('enableMultipleSelection', true),
  checkboxSelection: boolean('checkboxSelection', true),
  disableSelectionOnClick: boolean('disableSelectionOnClick', true),
  enableMultipleColumnsSorting: boolean('enableMultipleColumnsSorting', true),
  sortingOrder: sortingOrder.map(value => (value === 'null' ? null : (value as SortDirection))),
  headerHeight: number('headerHeight', 56),
  rowHeight: number('rowHeight', 52),
});

export const Commodity = () => {
  const { data, setSize, loadNewData } = useDemoData('Commodity', 100);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button color={'primary'} onClick={loadNewData}>
          Load New Rows
        </Button>
        <Button color={'primary'} onClick={() => setSize(randomInt(100, 500))}>
          Load New Rows with new length
        </Button>
      </div>
      <div style={{ padding: 10, flexGrow: 1 }}>
        <Grid rows={data.rows} columns={data.columns} options={getGridOptions()} />
      </div>
    </>
  );
};
export const Commodity500 = () => {
  const { data } = useDemoData('Commodity', 500);

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={getGridOptions()} />
    </div>
  );
};
export const Commodity1000 = () => {
  const { data } = useDemoData('Commodity', 1000);

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={getGridOptions()} />
    </div>
  );
};

export const Commodity10000 = () => {
  const { data } = useDemoData('Commodity', 10000);

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={getGridOptions()} />
    </div>
  );
};

export const Employee100 = () => {
  const { data } = useDemoData('Employee', 100);

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={getGridOptions()} />
    </div>
  );
};
export const Employee1000 = () => {
  const { data } = useDemoData('Employee', 1000);

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={getGridOptions()} />
    </div>
  );
};
export const Employee10000 = () => {
  const { data } = useDemoData('Employee', 10000);

  return (
    <div style={{ padding: 10, flexGrow: 1 }}>
      <Grid rows={data.rows} columns={data.columns} options={getGridOptions()} />
    </div>
  );
};
