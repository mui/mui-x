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
    <Stack py={1} px={1.5}>
      <Button color="primary" onClick={props.onClick}>
        Close Menu
      </Button>
    </Stack>
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
  // Show specific items for this column
  columns[4].getVisibleColumnMenuItems = () => [
    'closeMenu',
    'divider',
    'manageColumns',
  ];

  const columnMenuItems = {
    filter: {
      // overriding existing item
      component: <FilterComponent />, // overriden property
    },
    closeMenu: {
      // adding new item
      component: <MenuCloseComponent />,
      displayName: 'MenuClose',
    },
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
