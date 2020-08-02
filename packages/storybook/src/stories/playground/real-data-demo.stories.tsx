import * as React from 'react';
import { withA11y } from '@storybook/addon-a11y';
import { XGrid, GridOptionsProp, SortDirection } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import Button from '@material-ui/core/Button';
import { array, boolean, number, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { randomInt } from '../../data/random-generator';
// eslint-disable-next-line no-restricted-imports
import '@material-ui/x-grid-data-generator/style/real-data-stories.css';

export default {
  title: 'X-Grid Demos/Playground',
  component: XGrid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/knobs/panel' },
    docs: {
      page: null,
    },
  },
};

const getGridOptions: () => GridOptionsProp = () => {
  const rowsPerPageOptions = array('rowsPerPageOptions', ['25', '50', '100'], ', ');
  const sortingOrder = array('sortingOrder', ['asc', 'desc', 'null'], ', ');

  return {
    onRowClick: (params) => action('onRowClick')(params),
    onCellClick: (params) => action('onCellClick')(params),
    onColumnHeaderClick: (params) => action('onColumnHeaderClick')(params),
    onRowSelected: (params) => action('onRowSelected')(params),
    onSelectionChange: (params) =>
      action('onSelectionChange', {
        depth: 1,
      })(params),
    onPageChange: (params) => action('onPageChange')(params),
    onPageSizeChange: (params) => action('onPageSizeChange')(params),

    pagination: boolean('pagination', false),
    pageSize: number('pageSize', 100),
    autoPageSize: boolean('autoPageSize', false),
    rowsPerPageOptions: rowsPerPageOptions.map((value) => parseInt(value, 10)),
    hideFooterRowCount: boolean('hideFooterRowCount', false),
    hideFooterPagination: boolean('hideFooterPagination', false),
    hideFooter: boolean('hideFooter', false),
    extendRowFullWidth: boolean('extendRowFullWidth', true),
    showCellRightBorder: boolean('showCellRightBorder', false),
    showColumnRightBorder: boolean('showColumnRightBorder', false),
    enableMultipleSelection: boolean('enableMultipleSelection', true),
    checkboxSelection: boolean('checkboxSelection', true),
    disableSelectionOnClick: boolean('disableSelectionOnClick', true),
    enableMultipleColumnsSorting: boolean('enableMultipleColumnsSorting', true),
    sortingOrder: sortingOrder.map((value) => (value === 'null' ? null : (value as SortDirection))),
    headerHeight: number('headerHeight', 56),
    rowHeight: number('rowHeight', 52),
  };
};

export function Commodity() {
  const { data, setSize, loadNewData } = useDemoData('Commodity', 100);

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button color="primary" onClick={loadNewData}>
          Load New Rows
        </Button>
        <Button color="primary" onClick={() => setSize(randomInt(100, 500))}>
          Load New Rows with new length
        </Button>
      </div>
      <div className="grid-container">
        <XGrid rows={data.rows} columns={data.columns} options={getGridOptions()} />
      </div>
    </React.Fragment>
  );
}

export function Commodity500() {
  const { data } = useDemoData('Commodity', 500);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} options={getGridOptions()} />
    </div>
  );
}

export function Commodity1000() {
  const { data } = useDemoData('Commodity', 1000);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} options={getGridOptions()} />
    </div>
  );
}

export function Commodity10000() {
  const { data } = useDemoData('Commodity', 10000);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} options={getGridOptions()} />
    </div>
  );
}

export function Employee100() {
  const { data } = useDemoData('Employee', 100);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} options={getGridOptions()} />
    </div>
  );
}

export function Employee1000() {
  const { data } = useDemoData('Employee', 1000);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} options={getGridOptions()} />
    </div>
  );
}

export function Employee10000() {
  const { data } = useDemoData('Employee', 10000);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} options={getGridOptions()} />
    </div>
  );
}
