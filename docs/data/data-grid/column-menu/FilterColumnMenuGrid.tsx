import * as React from 'react';
import { DataGrid, GridFilterMenuSimpleItem } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const MenuCloseComponent = (props: any) => (
  <Stack py={1} px={1.5}>
    <Button color="primary" onClick={props.onClick}>
      Close Menu
    </Button>
  </Stack>
);

const FilterComponent = (props: any) => (
  <Stack my={1}>
    <GridFilterMenuSimpleItem {...props} />
  </Stack>
);

export default function ColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });
  const columns = data.columns;
  // only show `Manage Columns` for last column
  columns[4].getVisibleColumnMenuItems = () => ['closeMenu', 'manageColumns'];

  const columnMenuItems = {
    ['filter']: {
      // existing slot
      component: <FilterComponent />, // overriden property
    },
    ['closeMenu']: {
      // registering new slot
      component: <MenuCloseComponent />,
      displayName: 'MenuClose',
      addDivider: true,
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
              'filter',
              'closeMenu',
              'manageColumns',
            ],
          },
        }}
      />
    </div>
  );
}
