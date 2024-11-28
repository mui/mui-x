import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  randomId,
  randomTraderName,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

const roles = ['Marketing', 'Finance', 'Development'];

const randomRole = () => {
  return randomArrayItem(roles);
};

const initialRows = [
  {
    id: randomId(),
    name: randomTraderName(),
    position: randomRole(),
    avatar: '#4caf50',
  },
  {
    id: randomId(),
    name: randomTraderName(),
    position: randomRole(),
    avatar: '#2196f3',
  },
  {
    id: randomId(),
    name: randomTraderName(),
    position: randomRole(),
    avatar: '#ff9800',
  },
  {
    id: randomId(),
    name: randomTraderName(),
    position: randomRole(),
    avatar: '#9c27b0',
  },
  {
    id: randomId(),
    name: randomTraderName(),
    position: randomRole(),
    avatar: '#f44336',
  },
];

const columns = [
  { field: 'name', headerName: 'Name', width: 180 },
  {
    field: 'position',
    headerName: 'Department',
    width: 220,
    type: 'singleSelect',
    valueOptions: roles,
  },
];

function EditAction(props) {
  const { row, onSave } = props;
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(row.name);
  const [position, setPosition] = React.useState(row.position);

  const handleEdit = (event) => {
    event.stopPropagation();
    setEditing(true);
  };

  const handleClose = () => {
    setEditing(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    onSave(row.id, { name, position });
    handleClose();
  };

  React.useEffect(() => {
    setName(row.name);
    setPosition(row.position);
  }, [row]);

  return (
    <React.Fragment>
      <IconButton aria-label="Edit" onClick={handleEdit}>
        <EditIcon />
      </IconButton>

      <Dialog
        open={editing}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSave,
        }}
      >
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <DialogContentText>
            Make changes to the employee&apos;s information.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <FormControl fullWidth required>
            <InputLabel id="position-label">Position</InputLabel>
            <Select
              labelId="position-label"
              id="position"
              name="position"
              label="Position"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save changes</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function ListViewCell(props) {
  const { row } = props;

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        height: '100%',
        gap: 2,
      }}
    >
      <Avatar sx={{ width: 32, height: 32, backgroundColor: row.avatar }} />
      <Stack sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {row.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {row.position}
        </Typography>
      </Stack>
      <EditAction {...props} />
    </Stack>
  );
}

export default function ListViewEdit() {
  const [rows, setRows] = React.useState(initialRows);

  const updateRow = React.useCallback((id, rowUpdates) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, ...rowUpdates } : row)),
    );
  }, []);

  const listColDef = React.useMemo(
    () => ({
      field: 'listColumn',
      renderCell: (params) => <ListViewCell {...params} onSave={updateRow} />,
    }),
    [updateRow],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 360,
        maxHeight: 400,
      }}
    >
      <DataGridPro
        rows={rows}
        columns={columns}
        rowHeight={64}
        unstable_listView
        unstable_listColumn={listColDef}
        sx={{ backgroundColor: 'background.paper' }}
      />
    </div>
  );
}
