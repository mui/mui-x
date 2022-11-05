import * as React from 'react';
import {
  DataGrid,
  GridFilterMenuSimpleItem,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

declare module '@mui/x-data-grid' {
  interface GridColumnMenuSlotOverrides {
    closeMenu: true;
  }
}

const MenuCloseComponent = (props: GridColumnMenuItemProps) => {
  return (
    <Button color="primary" onClick={props.onClick}>
      Close Menu
    </Button>
  );
};

const FilterComponent = (props: GridColumnMenuItemProps) => (
  <Stack my={1}>
    <GridFilterMenuSimpleItem {...props} />
  </Stack>
);

export default function FilterColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });
  const columns = data.columns;
  // Show only specific items for this column
  columns[4].getVisibleColumnMenuItems = () => ['closeMenu'];

  const columnMenuItems = {
    filter: <FilterComponent />, // overriding existing item
    closeMenu: <MenuCloseComponent />, // adding new item
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        columns={columns}
        componentsProps={{
          columnMenu: {
            columnMenuItems,
            getVisibleColumnMenuItems: () => [
              'hideColumn',
              'divider',
              'filter',
              'divider',
              'closeMenu',
              'divider',
              'manageColumns',
            ],
          },
        }}
      />
    </div>
  );
}
