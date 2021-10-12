import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Events',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export function AllEvents() {
  const data = useData(2000, 200);

  return (
    <DataGridPro
      rows={data.rows}
      columns={data.columns}
      onRowClick={(params) => action('onRowClick')(params)}
      onCellClick={(params) => action('onCellClick')(params)}
      onColumnHeaderClick={(params) => action('onColumnHeaderClick')(params)}
      onSelectionModelChange={(params) => action('onSelectionChange', { depth: 1 })(params)}
      onPageChange={(params) => action('onPageChange')(params)}
      onPageSizeChange={(params) => action('onPageSizeChange')(params)}
      onSortModelChange={(params) => action('onSortModelChange')(params)}
      onStateChange={(params) => action('onStateChange')(params)}
    />
  );
}

export const OnRowClick = () => {
  const data = useData(2000, 200);

  return (
    <DataGridPro
      rows={data.rows}
      columns={data.columns}
      onRowClick={(params) => action('row click')(params)}
    />
  );
};
export const OnRowDoubleClick = () => {
  const data = useData(2000, 200);

  return (
    <DataGridPro
      rows={data.rows}
      columns={data.columns}
      onRowDoubleClick={(params) => action('row double click')(params)}
    />
  );
};

export const OnCellClick = () => {
  const data = useData(2000, 200);

  return (
    <DataGridPro
      rows={data.rows}
      columns={data.columns}
      onCellClick={(params) => action('cell click')(params)}
    />
  );
};
export const OnCellClickNotPropagated = () => {
  const data = useData(2000, 200);

  return (
    <DataGridPro
      rows={data.rows}
      columns={data.columns}
      onCellClick={(params, event) => {
        (event as React.SyntheticEvent).stopPropagation();
        action('cell click')(params);
      }}
    />
  );
};
export const OnCellDoubleClick = () => {
  const data = useData(2000, 200);

  return (
    <DataGridPro
      rows={data.rows}
      columns={data.columns}
      onCellDoubleClick={(params) => action('Cell double click')(params)}
    />
  );
};

export const OnColumnHeaderClick = () => {
  const data = useData(2000, 200);

  return (
    <DataGridPro
      rows={data.rows}
      columns={data.columns}
      onColumnHeaderClick={(params) => action('Header click')(params)}
    />
  );
};
