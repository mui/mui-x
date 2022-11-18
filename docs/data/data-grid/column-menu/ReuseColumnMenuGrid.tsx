import * as React from 'react';
import Button from '@mui/material/Button';
import IconFilter from '@mui/icons-material/FilterAlt';
import {
  DataGrid,
  GridColumnMenuDefault,
  GridColumnMenuProps,
  gridColumnMenuSlots,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomFilterItem(props: GridColumnMenuItemProps) {
  const { column, onClick } = props;
  return (
    <Button sx={{ m: 1 }} onClick={onClick} startIcon={<IconFilter />}>
      Show {column.field} Filters
    </Button>
  );
}

function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenuDefault
      {...props}
      slots={{
        ...gridColumnMenuSlots,
        ColumnMenuFilterItem: {
          // override component for Filter item
          component: CustomFilterItem,
          // change order
          priority: 1,
        },
        ColumnMenuSortItem: {
          ...gridColumnMenuSlots.ColumnMenuSortItem,
          priority: 2,
        },
      }}
    />
  );
}

export default function ReuseColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} components={{ ColumnMenu: CustomColumnMenu }} />
    </div>
  );
}
