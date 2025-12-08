import * as React from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridRowId,
  GridColDef,
  GridActionsCell,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { randomUserName } from '@mui/x-data-grid-generator';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const initialRows = [
  { id: 1, name: randomUserName() },
  { id: 2, name: randomUserName() },
  { id: 3, name: randomUserName() },
];

type Row = (typeof initialRows)[number];

const ActionHandlersContext = React.createContext<
  ((id: GridRowId) => void) | undefined
>(undefined);

function ActionsCell(props: GridRenderCellParams) {
  const setActionRowId = React.useContext(ActionHandlersContext);

  if (!setActionRowId) {
    throw new Error('ActionHandlersContext is empty');
  }

  return (
    <GridActionsCell {...props}>
      <GridActionsCellItem
        label="Delete"
        showInMenu
        icon={<DeleteIcon />}
        onClick={() => setActionRowId(props.id)}
        closeMenuOnClick={false}
      />
    </GridActionsCell>
  );
}

const columns: GridColDef<Row>[] = [
  { field: 'name', type: 'string' },
  {
    field: 'actions',
    type: 'actions',
    width: 80,
    renderCell: (params) => <ActionsCell {...params} />,
  },
];

export default function ActionsWithModalGrid() {
  const [rows, setRows] = React.useState<Row[]>(initialRows);
  const [actionRowId, setActionRowId] = React.useState<GridRowId | null>(null);

  const deleteActiveRow = React.useCallback(
    (rowId: GridRowId) =>
      setRows((prevRows) => prevRows.filter((row) => row.id !== rowId)),
    [],
  );

  const handleCloseDialog = React.useCallback(() => {
    setActionRowId(null);
  }, []);

  const handleConfirmDelete = React.useCallback(() => {
    deleteActiveRow(actionRowId!);
    handleCloseDialog();
  }, [actionRowId, deleteActiveRow, handleCloseDialog]);

  return (
    <div style={{ height: 300, width: '100%' }}>
      <ActionHandlersContext.Provider value={setActionRowId}>
        <DataGrid columns={columns} rows={rows} />
      </ActionHandlersContext.Provider>
      <Dialog
        open={actionRowId !== null}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete this user?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="warning" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
