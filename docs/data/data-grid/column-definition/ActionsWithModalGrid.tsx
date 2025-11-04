import * as React from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridRowId,
  GridColDef,
  GridActionsCellItemProps,
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

function DeleteUserActionItem({
  rowId,
  onConfirm,
  ...props
}: GridActionsCellItemProps & {
  rowId: GridRowId;
  onConfirm: (id: GridRowId) => void;
}) {
  return (
    <GridActionsCellItem
      {...(props as any)}
      onClick={() => onConfirm(rowId)}
      closeMenuOnClick={false}
    />
  );
}

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

  const columns = React.useMemo<GridColDef<Row>[]>(
    () => [
      { field: 'name', type: 'string' },
      {
        field: 'actions',
        type: 'actions',
        width: 80,
        getActions: (params) => [
          <DeleteUserActionItem
            label="Delete"
            showInMenu
            icon={<DeleteIcon />}
            rowId={params.id}
            onConfirm={setActionRowId}
          />,
        ],
      },
    ],
    [],
  );

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid columns={columns} rows={rows} />
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
