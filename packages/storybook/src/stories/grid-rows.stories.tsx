import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  GridCellValue,
  GridCellParams,
  GridEditRowsModel,
  GridLoadIcon,
  GridColDef,
  isOverflown,
  GridRowData,
  useGridApiRef,
  XGrid,
  GRID_CELL_EXIT_EDIT,
  GridEditCellPropsParams,
} from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import { action } from '@storybook/addon-actions';
import { randomInt } from '../data/random-generator';

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

interface GridCellExpandProps {
  value: string;
  width: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      lineHeight: '24px',
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      '& .MuiRating-root': {
        marginRight: theme.spacing(1),
      },
      '& .cellValue': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
  }),
);
const GridCellExpand = React.memo(function CellExpand(props: GridCellExpandProps) {
  const { width, value } = props;
  const wrapper = React.useRef<HTMLDivElement | null>(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const classes = useStyles();
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current!);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent: KeyboardEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <div
      ref={wrapper}
      className={classes.root}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cellDiv}
        style={{
          height: 1,
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <div ref={cellValue} className="cellValue">
        {value}
      </div>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl != null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper elevation={1} style={{ minHeight: wrapper.current!.offsetHeight - 3 }}>
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </div>
  );
});

function RenderCellExpand(params: GridCellParams) {
  return (
    <GridCellExpand
      value={params.value ? params.value.toString() : ''}
      width={params.colDef.width}
    />
  );
}

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 80, renderCell: RenderCellExpand },
  { field: 'col2', headerName: 'Column 2', width: 100, renderCell: RenderCellExpand },
  { field: 'col3', headerName: 'Column 3', width: 150, renderCell: RenderCellExpand },
];
const rows: any = [
  {
    id: 1,
    col1: 'Hello',
    col2: 'World',
    col3: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used.',
  },
  {
    id: 2,
    col1: 'XGrid',
    col2: 'is Awesome',
    col3:
      'In publishing and graphic design, Lorem ipsum is a placeholder text or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
  },
  {
    id: 3,
    col1: 'Material-UI',
    col2: 'is Amazing',
    col3:
      'Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
  },
  {
    id: 4,
    col1: 'Hello',
    col2: 'World',
    col3:
      'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form.',
  },
  {
    id: 5,
    col1: 'XGrid',
    col2: 'is Awesome',
    col3:
      'Typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
  },
  {
    id: 6,
    col1: 'Material-UI',
    col2: 'is Amazing',
    col3: 'Lorem ipsum may be used as a placeholder before final copy is available.',
  },
];

export function ExpendRowCell() {
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
// TODO demo with Cell edit with value getter
// Todo demo with cell not editable according to value
// demo with cell edit validation, email, username(serverside)

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
      valueGetter: ({ row }) => `${row.firstname || ''} ${row.lastname || ''}`,
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

const useEditCellStyles = makeStyles({
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
  const classes = useEditCellStyles();

  const [selectedCell, setSelectedCell] = React.useState<[string, string, GridCellValue] | null>(
    null,
  );
  const [isEditable, setIsEditable] = React.useState<boolean>(false);
  const [editRowsModel, setEditRowsModel] = React.useState<GridEditRowsModel>({});

  const editRow = React.useCallback(() => {
    if (!selectedCell) {
      return;
    }
    const [id, field] = selectedCell;

    apiRef.current.setCellMode(id, field, 'edit');
  }, [apiRef, selectedCell]);

  const onCellClick = React.useCallback((params: GridCellParams) => {
    setSelectedCell([params.row.id!.toString(), params.field, params.value]);
    setIsEditable(!!params.isEditable);
  }, []);

  const isCellEditable = React.useCallback((params: GridCellParams) => params.row.id !== 0, []);

  const onEditCellChange = React.useCallback(
    ({ id, field, props }: GridEditCellPropsParams) => {
      if (field === 'email') {
        const isValid = validateEmail(props.value);
        const newState = {};
        newState[id] = {
          ...editRowsModel[id],
          email: { ...props, error: !isValid },
        };
        setEditRowsModel((state) => ({ ...state, ...newState }));
        return;
      }
      const newState = {};
      newState[id] = {
        ...editRowsModel[id],
      };
      newState[id][field] = props;
      setEditRowsModel((state) => ({ ...state, ...newState }));
    },
    [editRowsModel],
  );

  const onEditCellChangeCommitted = React.useCallback(
    (params: GridEditCellPropsParams, event?: React.SyntheticEvent) => {
      const { id, field, props } = params;
      event!.persist();
      // we stop propagation as we want to switch back to view mode after we updated the value on the server
      event!.stopPropagation();

      let cellUpdate: any = { id };
      cellUpdate[field] = props.value;

      const newState = {};
      newState[id] = {};
      newState[id][field] = { ...props, endAdornment: <GridLoadIcon /> };
      setEditRowsModel((state) => ({ ...state, ...newState }));

      if (field === 'fullname') {
        const [firstname, lastname] = props.value!.toString().split(' ');
        cellUpdate = { id, firstname, lastname };
      }

      setTimeout(() => {
        apiRef.current.updateRows([cellUpdate]);
        apiRef.current.publishEvent(GRID_CELL_EXIT_EDIT, params, event);
      }, randomInt(300, 2000));
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
          isCellEditable={isCellEditable}
          onEditCellChange={onEditCellChange}
          onEditCellChangeCommitted={onEditCellChangeCommitted}
          editRowsModel={editRowsModel}
          editMode="server"
        />
      </div>
    </React.Fragment>
  );
}
export function EditRowsBasic() {
  const apiRef = useGridApiRef();

  return (
    <React.Fragment>
      <div className="grid-container">
        <XGrid
          {...baselineEditProps}
          apiRef={apiRef}
          onEditRowModelChange={action('onEditRowsModelChange')}
        />
      </div>
    </React.Fragment>
  );
}
const singleData = { rows: [...baselineEditProps.rows], columns: [...baselineEditProps.columns] };
singleData.rows.length = 1;
singleData.columns.length = 1;
singleData.columns[0].width = 200;

export function SingleCellBasic() {
  return (
    <div className="grid-container">
      <XGrid {...singleData} onEditRowModelChange={action('onEditRowsModelChange')} />
    </div>
  );
}
export function CommodityEdit() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100000,
  });

  return (
    <div style={{ width: '100%', height: 600 }}>
      <XGrid {...data} />
    </div>
  );
}

export function EditCellSnap() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    apiRef.current.setCellMode(1, 'brand', 'edit');
  });

  return (
    <div className="grid-container">
      <XGrid {...baselineProps} apiRef={apiRef} />
    </div>
  );
}
