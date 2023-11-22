import * as React from 'react';
import { DataGrid, GridColumnMenu, GridColumnMenuProps } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenu
      {...props}
      slotProps={{
        // Swap positions of filter and sort items
        columnMenuFilterItem: {
          displayOrder: 0, // Previously `10`
        },
        columnMenuSortItem: {
          displayOrder: 10, // Previously `0`
        },
      }}
    />
  );
}

export default function ReorderColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} slots={{ columnMenu: CustomColumnMenu }} />
    </div>
  );
}
