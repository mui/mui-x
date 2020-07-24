import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { XGrid, GridOptionsProp } from '@material-ui/x-grid';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Events',
  component: XGrid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export function AllEvents() {
  const data = useData(2000, 200);

  const options: GridOptionsProp = {
    onRowClick: (params) => action('onRowClick')(params),
    onCellClick: (params) => action('onCellClick')(params),
    onColumnHeaderClick: (params) => action('onColumnHeaderClick')(params),
    onSelectedRow: (params) => action('onSelectedRow')(params),
    onSelectionChange: (params) => action('onSelectionChange', { depth: 1 })(params),
    onSortedColumns: (params) => action('onSortedColumns')(params),
    onPageChange: (params) => action('onPageChange')(params),
    onPageSizeChange: (params) => action('onPageSizeChange')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} options={options} />;
}

export const onRowClick = () => {
  const data = useData(2000, 200);

  const options: GridOptionsProp = {
    onRowClick: (params) => action('row click')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} options={options} />;
};

export const onCellClick = () => {
  const data = useData(2000, 200);
  const options: GridOptionsProp = {
    onCellClick: (params) => action('cell click')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} options={options} />;
};

export const onColumnHeaderClick = () => {
  const data = useData(2000, 200);
  const options: GridOptionsProp = {
    onColumnHeaderClick: (params) => action('Header click')(params),
  };
  return <XGrid rows={data.rows} columns={data.columns} options={options} />;
};
