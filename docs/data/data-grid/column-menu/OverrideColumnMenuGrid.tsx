import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconFilter from '@mui/icons-material/FilterAlt';
import {
  DataGrid,
  GridColumnMenu,
  GridColumnMenuProps,
  GridColumnMenuItemProps,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomFilterItem(props: GridColumnMenuItemProps) {
  const { onClick, colDef } = props;
  const apiRef = useGridApiContext();
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      apiRef.current.showFilterPanel(colDef.field);
      onClick(event);
    },
    [apiRef, colDef.field, onClick],
  );
  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon>
        <IconFilter fontSize="small" />
      </ListItemIcon>
      <ListItemText>Show Filters</ListItemText>
    </MenuItem>
  );
}

function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        // Override slot for `columnMenuFilterItem`
        columnMenuFilterItem: CustomFilterItem,
      }}
    />
  );
}

export default function OverrideColumnMenuGrid() {
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
