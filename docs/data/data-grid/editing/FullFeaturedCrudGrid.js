import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridRowEditStopReasons,
  gridEditRowsStateSelector,
  useGridSelector,
  useGridApiContext,
  GridActionsCell,
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

const initialRows = [
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

function EditToolbar(props) {
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

const ActionHandlersContext = React.createContext({
  handleCancelClick: () => {},
  handleDeleteClick: () => {},
  handleEditClick: () => {},
  handleSaveClick: () => {},
});

function ActionsCell(props) {
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

const columns = [
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
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const actionHandlers = React.useMemo(
    () => ({
      handleEditClick: (id) => {
        setRowModesModel((prevRowModesModel) => ({
          ...prevRowModesModel,
          [id]: { mode: GridRowModes.Edit },
        }));
      },
      handleSaveClick: (id) => {
        setRowModesModel((prevRowModesModel) => ({
          ...prevRowModesModel,
          [id]: { mode: GridRowModes.View },
        }));
      },
      handleDeleteClick: (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      },
      handleCancelClick: (id) => {
        setRowModesModel((prevRowModesModel) => {
          return {
            ...prevRowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
          };
        });

        setRows((prevRows) => {
          const editedRow = prevRows.find((row) => row.id === id);
          if (editedRow.isNew) {
            return prevRows.filter((row) => row.id !== id);
          }
          return prevRows;
        });
      },
    }),
    [],
  );

  const processRowUpdate = (newRow) => {
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
          slots={{ toolbar: EditToolbar }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </ActionHandlersContext.Provider>
    </Box>
  );
}
