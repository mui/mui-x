import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import Button from '@material-ui/core/Button';
import {
  GridCellParams,
  GridLoadIcon,
  GridRowData,
  useGridApiRef,
  XGrid,
} from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import { GridEditRowsModel } from '../../../grid/_modules_/grid/models/gridEditRowModel';
import { randomInt } from '../data/random-generator';
import { GridCellValue } from '@material-ui/x-grid';

export default {
  title: 'X-Grid Tests/Rows',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

const newRows = [
  {
    id: 3,
    brand: 'Asics',
  },
];
const baselineProps = {
  rows: [
    {
      id: 0,
      brand: 'Nike',
    },
    {
      id: 1,
      brand: 'Adidas',
    },
    {
      id: 2,
      brand: 'Puma',
    },
  ],
  columns: [{ field: 'brand' }],
};

function getStoryRowId(row) {
  return row.brand;
}
export function NoId() {
  const [rows] = React.useState([
    {
      brand: 'Nike',
    },
    {
      brand: 'Adidas',
    },
    {
      brand: 'Puma',
    },
  ]);

  return (
    <div className="grid-container">
      <XGrid columns={baselineProps.columns} rows={rows} getRowId={getStoryRowId} />
    </div>
  );
}
export function CommodityNewRowId() {
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });
  const getRowId = React.useCallback((row: GridRowData) => `${row.desk}-${row.commodity}`, []);
  return (
    <div className="grid-container">
      <XGrid
        rows={data.rows}
        columns={data.columns.filter((c) => c.field !== 'id')}
        getRowId={getRowId}
      />
    </div>
  );
}
export function SetRowsViaApi() {
  const apiRef = useGridApiRef();

  const setNewRows = React.useCallback(() => {
    apiRef.current.setRows(newRows);
  }, [apiRef]);

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button color="primary" onClick={setNewRows}>
          Load New Rows
        </Button>
      </div>
      <div className="grid-container">
        <XGrid {...baselineProps} apiRef={apiRef} />
      </div>
    </React.Fragment>
  );
}
export function SetCommodityRowsViaApi() {
  const apiRef = useGridApiRef();
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });
  const apiDemoData = useDemoData({ dataSet: 'Commodity', rowLength: 150 });

  const setNewRows = React.useCallback(() => {
    apiDemoData.setRowLength(randomInt(100, 500));
    apiDemoData.loadNewData();
    apiRef.current.setRows(apiDemoData.data.rows);
  }, [apiDemoData, apiRef]);

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button color="primary" onClick={setNewRows}>
          Load New Rows
        </Button>
      </div>
      <div className="grid-container">
        <XGrid rows={data.rows} columns={data.columns} apiRef={apiRef} />
      </div>
    </React.Fragment>
  );
}

export function ChangeRowsAndColumns() {
  const [rows, setRows] = React.useState<any[]>(baselineProps.rows);
  const [cols, setCols] = React.useState<any[]>(baselineProps.columns);

  const changeDataSet = React.useCallback(() => {
    const newData = {
      rows: [
        {
          id: 0,
          country: 'France',
        },
        {
          id: 1,
          country: 'UK',
        },
        {
          id: 12,
          country: 'US',
        },
      ],
      columns: [{ field: 'country' }],
    };

    setRows(newData.rows);
    setCols(newData.columns);
  }, []);

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button color="primary" onClick={changeDataSet}>
          Load New DataSet
        </Button>
      </div>
      <div className="grid-container">
        <XGrid rows={rows} columns={cols} />
      </div>
    </React.Fragment>
  );
}

const rows: any = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'XGrid', col2: 'is Awesome' },
  { id: 3, col1: 'Material-UI', col2: 'is Amazing' },
  { id: 4, col1: 'Hello', col2: 'World' },
  { id: 5, col1: 'XGrid', col2: 'is Awesome' },
  { id: 6, col1: 'Material-UI', col2: 'is Amazing' },
];

const columns: any[] = [
  { field: 'id', hide: true },
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];

export function ScrollIssue() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      apiRef.current.scrollToIndexes({ colIndex: 0, rowIndex: 6 });
    }, 0);

    return () => clearTimeout(timeout);
  }, [apiRef]);

  return (
    <div style={{ height: 300, width: 600 }}>
      <XGrid rows={rows} columns={columns} apiRef={apiRef} />
    </div>
  );
}

// Requirements
/*
- Turn edit mode, using a button or events such as double click...
- Expose double click cell
- Be able to edit rows as well as individual cell
- Validate the value of a cell
- render different input component according to the type of value to edit
- fix issue with number as IDs
- Provide a basic Edit UX out of the box
- Customise the edit for a particular cell
- Some columns should not be editable
- Some rows should not be editable

colDef.renderEditCell

        <XGrid
          {...baselineProps}
          apiRef={apiRef}
          onCellClick={onCellClick}
          isCellEditable={(params: CellParams)=> boolean}
          onCellModeChange
          onRowModeChange
          onCellValueChange=??? => while typing, allows to validate? Or feedback user...
          onCellValueChangeCommitted => pressing enter? What happens when you press ESC?
        />

 */
// TODO demo with Cell edit with value getter
// Todo demo with cell not editable according to value
// demo with cell edit validation
// demo with cell edit validation serverside ie username
// demo with cell edit client and serverside ie username

// TODO create inputs for each col types

const baselineEditProps = {
  rows: [
    {
      id: 0,
      firstname: 'Damien',
      lastname: 'Tassone',
      email: 'damien@material-ui.com',
      username: 'Damo',
      lastLogin: new Date(),
      age: 25,
      DOB: new Date(1996, 10, 2),
      meetup: new Date(2020, 2, 25, 10, 50, 0),
    },
    {
      id: 1,
      firstname: 'Jon',
      lastname: 'Wood',
      email: 'jon@material-ui.com',
      username: 'jon',
      lastLogin: new Date(),
      age: 25,
      DOB: new Date(1992, 1, 20),
      meetup: new Date(2020, 4, 15, 10, 50, 0),
    },
    {
      id: 2,
      firstname: 'James',
      lastname: 'Smith',
      email: 'james@material-ui.com',
      username: 'smithhhh',
      lastLogin: new Date(),
      age: 25,
      DOB: new Date(1986, 0, 12),
      meetup: new Date(2020, 3, 5, 10, 50, 0),
    },
  ],
  columns: [
    { field: 'firstname', editable: true },
    { field: 'lastname', editable: true },
    {
      field: 'fullname',
      editable: true,
      valueGetter: ({ row }) => `${row.firstname} ${row.lastname}`,
    },
    { field: 'username', editable: true },
    { field: 'email', editable: true, width: 150 },
    { field: 'age', width: 50, type: 'number', editable: true },
    { field: 'DOB', width: 120, type: 'date', editable: true },
    { field: 'meetup', width: 180, type: 'dateTime', editable: true },
    { field: 'lastLogin', width: 180, type: 'dateTime', editable: false },
  ],
};
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const useStyles = makeStyles({
  root: {
    '& .MuiDataGrid-cellEditable': {
      backgroundColor: 'rgba(184,250,158,0.19)',
      color: '#1a3e72',
    },
    '& .MuiDataGrid-cellEditing': {
      backgroundColor: 'rgb(255,215,115, 0.19)',
      color: '#1a3e72',
    },
    '& .Mui-error': {
      backgroundColor: 'rgb(126,10,15, 0.1)',
      color: '#750f0f',
    },
  },
});

export function EditRowsControl() {
  const apiRef = useGridApiRef();
  const classes = useStyles();

  const [selectedCell, setSelectedCell] = React.useState<[string, string,  GridCellValue] | null>(null);
  const [isEditable, setIsEditable] = React.useState<boolean>(false);
  const [editRowsModel, setEditRowsModel] = React.useState<GridEditRowsModel>({});

  const editRow = React.useCallback(() => {
    if (!selectedCell) {
      return;
    }

    setEditRowsModel((state) => {
      const editRowState: GridEditRowsModel = { ...state };
      editRowState[selectedCell[0]] = editRowState[selectedCell[0]]
        ? editRowState[selectedCell[0]]
        : {id: selectedCell[0]};
      editRowState[selectedCell[0]][selectedCell[1]] = selectedCell[2];

      return { ...state, ...editRowState };
    });
  }, [selectedCell]);

  const onCellClick = React.useCallback((params: GridCellParams) => {
    setSelectedCell([params.row.id!.toString(), params.field, params.value]);
    setIsEditable(!!params.isEditable);
  }, []);

  const onCellDoubleClick = React.useCallback(
    (params: GridCellParams) => {
      if (params.isEditable) {
        apiRef.current.setCellMode(params.row.id!.toString(), params.field, 'edit');
      }
    },
    [apiRef],
  );

  const isCellEditable = React.useCallback((params: GridCellParams) => params.row.id !== 0, []);

  const onEditCellValueChange = React.useCallback(
    ({ update }) => {
      if (update.email) {
        const isValid = validateEmail(update.email);
        const newState = {};
        newState[update.id] = {
          ...editRowsModel[update.id],
          email: { value: update.email, error: !isValid },
        };
        setEditRowsModel((state) => ({ ...state, ...newState }));
        return;
      }
      // todo handle native types like date internally?
      if (update.DOB) {
        const newState = {};
        newState[update.id] = { ...editRowsModel[update.id], DOB: { value: new Date(update.DOB) } };
        setEditRowsModel((state) => ({ ...state, ...newState }));
        return;
      }
      if (update.meetup) {
        const newState = {};
        newState[update.id] = {
          ...editRowsModel[update.id],
          meetup: { value: new Date(update.meetup) },
        };
        setEditRowsModel((state) => ({ ...state, ...newState }));
        return;
      }
      const newState = {};
      newState[update.id] = {
        ...editRowsModel[update.id],
        ...update,
      };
      setEditRowsModel((state) => ({ ...state, ...newState }));
    },
    [editRowsModel],
  );

  const onEditCellValueChangeCommitted = React.useCallback(
    ({ update }) => {
      const field = Object.keys(update).find((key) => key !== 'id')!;
      if (update.email) {
        const newState = {};
        const componentProps = {
          InputProps: { endAdornment: <GridLoadIcon /> },
        };
        newState[update.id] = {};
        newState[update.id][field] = { value: update.email, ...componentProps };
        setEditRowsModel((state) => ({ ...state, ...newState }));
        setTimeout(() => {
          apiRef.current.updateRows([update]);
          apiRef.current.setCellMode(update.id, field, 'view');
        }, 2000);
      } else if (update.fullname) {
        const [firstname, lastname] = update.fullname.split(' ');
        apiRef.current.updateRows([{ id: update.id, firstname, lastname }]);
        apiRef.current.setCellMode(update.id, field, 'view');
      } else {
        apiRef.current.updateRows([update]);
        apiRef.current.setCellMode(update.id, field, 'view');
      }
    },
    [apiRef],
  );

  return (
    <React.Fragment>
      Green cells are editable! Click + EDIT or Double click
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button color="primary" onClick={editRow} disabled={!isEditable}>
          Edit
        </Button>
      </div>
      <div className="grid-container">
        <XGrid
          className={classes.root}
          {...baselineEditProps}
          apiRef={apiRef}
          onCellClick={onCellClick}
          onCellDoubleClick={onCellDoubleClick}
          isCellEditable={isCellEditable}
          onEditCellValueChange={onEditCellValueChange}
          onEditCellValueChangeCommitted={onEditCellValueChangeCommitted}
          editRowsModel={editRowsModel}
          editMode="server"
        />
      </div>
    </React.Fragment>
  );
}
export function EditRowsBasic() {
  const apiRef = useGridApiRef();

  const onCellDoubleClick = React.useCallback(
    (params: GridCellParams) => {
      if (params.isEditable) {
        apiRef.current.setCellMode(params.row.id!.toString(), params.field, 'edit');
      }
    },
    [apiRef],
  );

  return (
    <React.Fragment>
      Green cells are editable! Double click
      <div className="grid-container">
        <XGrid {...baselineEditProps} apiRef={apiRef} onCellDoubleClick={onCellDoubleClick} />
      </div>
    </React.Fragment>
  );
}
