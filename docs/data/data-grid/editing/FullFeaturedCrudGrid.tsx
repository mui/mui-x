import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
  gridEditRowsStateSelector,
  useGridSelector,
  useGridApiContext,
  GridActionsCell,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

const roles = ['Market', 'Finance', 'Development'];
const randomRole = () => {
  return randomArrayItem(roles);
};

const initialRows: GridRowsProp = [
  {
    id: randomId(),
    name: randomTraderName(),
    age: 25,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 36,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 28,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 23,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, name: '', age: '', role: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

interface ActionHandlers {
  handleCancelClick: (id: GridRowId) => void;
  handleDeleteClick: (id: GridRowId) => void;
  handleEditClick: (id: GridRowId) => void;
  handleSaveClick: (id: GridRowId) => void;
}

const ActionHandlersContext = React.createContext<ActionHandlers>({
  handleCancelClick: () => {},
  handleDeleteClick: () => {},
  handleEditClick: () => {},
  handleSaveClick: () => {},
});

function ActionsCell(props: GridRenderCellParams) {
  const apiRef = useGridApiContext();
  const rowModesModel = useGridSelector(apiRef, gridEditRowsStateSelector);
  const isInEditMode = typeof rowModesModel[props.id] !== 'undefined';

  const { handleSaveClick, handleCancelClick, handleEditClick, handleDeleteClick } =
    React.useContext(ActionHandlersContext);

  return (
    <GridActionsCell {...props}>
      {isInEditMode
        ? [
            <GridActionsCell.Item
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={() => handleSaveClick(props.id)}
            />,
            <GridActionsCell.Item
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={() => handleCancelClick(props.id)}
              color="inherit"
            />,
          ]
        : [
            <GridActionsCell.Item
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={() => handleEditClick(props.id)}
              color="inherit"
            />,
            <GridActionsCell.Item
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDeleteClick(props.id)}
              color="inherit"
            />,
          ]}
    </GridActionsCell>
  );
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 80,
    align: 'left',
    headerAlign: 'left',
    editable: true,
  },
  {
    field: 'joinDate',
    headerName: 'Join date',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'role',
    headerName: 'Department',
    width: 220,
    editable: true,
    type: 'singleSelect',
    valueOptions: ['Market', 'Finance', 'Development'],
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    cellClassName: 'actions',
    renderCell: (params) => <ActionsCell {...params} />,
  },
];

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const actionHandlers = React.useMemo<ActionHandlers>(
    () => ({
      handleEditClick: (id: GridRowId) => {
        setRowModesModel((prevRowModesModel) => ({
          ...prevRowModesModel,
          [id]: { mode: GridRowModes.Edit },
        }));
      },
      handleSaveClick: (id: GridRowId) => {
        setRowModesModel((prevRowModesModel) => ({
          ...prevRowModesModel,
          [id]: { mode: GridRowModes.View },
        }));
      },
      handleDeleteClick: (id: GridRowId) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      },
      handleCancelClick: (id: GridRowId) => {
        setRowModesModel((prevRowModesModel) => {
          return {
            ...prevRowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
          };
        });

        setRows((prevRows) => {
          const editedRow = prevRows.find((row) => row.id === id);
          if (editedRow!.isNew) {
            return prevRows.filter((row) => row.id !== id);
          }
          return prevRows;
        });
      },
    }),
    [],
  );

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)),
    );
    return updatedRow;
  };

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <ActionHandlersContext.Provider value={actionHandlers}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </ActionHandlersContext.Provider>
    </Box>
  );
}
