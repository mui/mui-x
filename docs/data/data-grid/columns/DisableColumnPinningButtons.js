import * as React from 'react';
import PropTypes from 'prop-types';
import {
  DataGridPro,
  GridColumnMenuContainer,
  SortGridMenuItems,
  HideGridColMenuItem,
  GridColumnsMenuItem,
  GridFilterMenuItem,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomEmail,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

function CustomColumnMenu(props) {
  const { hideMenu, currentColumn, color, ...other } = props;

  return (
    <GridColumnMenuContainer
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      {...other}
    >
      <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
      <GridFilterMenuItem onClick={hideMenu} column={currentColumn} />
      <HideGridColMenuItem onClick={hideMenu} column={currentColumn} />
      <GridColumnsMenuItem onClick={hideMenu} column={currentColumn} />
    </GridColumnMenuContainer>
  );
}

CustomColumnMenu.propTypes = {
  color: PropTypes.string,
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
};

export { CustomColumnMenu };

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

const columns = [
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

const rows = [
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
