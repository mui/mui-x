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

function DeleteUserActionItem({
  deleteUser,
  ...props
}: GridActionsCellItemProps & { deleteUser: () => void }) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <GridActionsCellItem {...props} onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setOpen(false);
              deleteUser();
            }}
            color="warning"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

type Row = (typeof initialRows)[number];

export default function ActionsWithModalGrid() {
  const [rows, setRows] = React.useState<Row[]>(initialRows);

  const deleteUser = React.useCallback(
    (id: GridRowId) => () => {
      setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      });
    },
    [],
  );

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
            deleteUser={deleteUser(params.id)}
            closeMenuOnClick={false}
          />,
        ],
      },
    ],
    [deleteUser],
  );

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid columns={columns} rows={rows} />
    </div>
  );
}
