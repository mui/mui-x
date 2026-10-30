import type { GridColumnMenuProps } from '@mui/x-data-grid';
import { DataGrid, GridColumnMenu } from '@mui/x-data-grid';
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
  // @focus-start @padding 1
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
  // @focus-end
}
