import * as React from 'react';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DataGrid } from '@material-ui/data-grid';

export function SortedDescendingIcon() {
  return <ExpandMoreIcon className="icon" />;
}

export function SortedAscendingIcon() {
  return <ExpandLessIcon className="icon" />;
}

const rows = [
  {
    id: 1,
    name: 'Material-UI',
    stars: 28000,
  },
  {
    id: 2,
    name: 'DataGrid',
    stars: 15000,
  },
];

const columns = [
  { field: 'name', width: 150 },
  { field: 'stars', width: 150 },
];

export default function CustomSortIcons() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        sortModel={[
          { field: 'name', sort: 'asc' },
          { field: 'stars', sort: 'desc' },
        ]}
        components={{
          ColumnSortedDescendingIcon: SortedDescendingIcon,
          ColumnSortedAscendingIcon: SortedAscendingIcon,
        }}
      />
    </div>
  );
}
