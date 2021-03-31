import * as React from 'react';
import {
  DataGrid,
  GridColumns,
  GridEditRowModelParams,
  GridRowsProp,
} from '@material-ui/data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@material-ui/x-grid-data-generator';

const columns: GridColumns = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
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
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];

export default function EditRowModelControlGrid() {
  const [editRowsModel, setEditRowsModel] = React.useState({});

  const handleEditRowModelChange = React.useCallback(
    (params: GridEditRowModelParams) => {
      setEditRowsModel(params.model);
    },
    [],
  );

  return (<div style={{width: '100%'}}>
      <DataGrid rows={rows} columns={columns} autoHeight
                editRowsModel={editRowsModel}
                onEditRowModelChange={handleEditRowModelChange}
      />
      <code>{JSON.stringify(editRowsModel)}</code>
    </div>
  );
}
