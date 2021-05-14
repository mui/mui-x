import * as React from 'react';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { XGrid } from '@material-ui/x-grid';

export function SortedDescendingIcon() {
  return <ExpandMoreIcon className="icon" />;
}

export function SortedAscendingIcon() {
  return <ExpandLessIcon className="icon" />;
}

export default function CustomSortIcons() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <XGrid
        columns={[
          { field: 'name', width: 150 },
          { field: 'stars', width: 150 },
        ]}
        rows={[
          {
            id: 1,
            name: 'Material-UI',
            stars: 28000,
          },
          {
            id: 2,
            name: 'XGrid',
            stars: 15000,
          },
        ]}
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
