import * as React from 'react';
import {
  DataGridPro,
  GridColumns,
  GridRowsProp,
  GridColumnMenuContainer,
  GridColumnMenuSortItem,
  GridColumnMenuHideItem,
  GridColumnMenuColumnsItem,
  GridColumnMenuFilterItem,
  GridColumnMenuProps,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomEmail,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

export function CustomColumnMenu(props: GridColumnMenuProps) {
  const { hideMenu, currentColumn, color, ...other } = props;

  return (
    <GridColumnMenuContainer
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      {...other}
    >
      <GridColumnMenuSortItem onClick={hideMenu} column={currentColumn} />
      <GridColumnMenuFilterItem onClick={hideMenu} column={currentColumn} />
      <GridColumnMenuHideItem onClick={hideMenu} column={currentColumn} />
      <GridColumnMenuColumnsItem onClick={hideMenu} column={currentColumn} />
    </GridColumnMenuContainer>
  );
}

export default function DisableColumnPinningButtons() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        components={{ ColumnMenu: CustomColumnMenu }}
        initialState={{ pinnedColumns: { left: ['name'], right: ['actions'] } }}
      />
    </div>
  );
}

const columns: GridColumns = [
  { field: 'name', headerName: 'Name', width: 160, editable: true },
  { field: 'email', headerName: 'Email', width: 200, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: randomTraderName(),
    email: randomEmail(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    email: randomEmail(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    email: randomEmail(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    email: randomEmail(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    email: randomEmail(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];
