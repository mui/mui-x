import * as React from 'react';
import { GridRowParams } from '@mui/x-data-grid-premium';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { RowModel } from '../types';

export interface RenameDialogProps {
  params: GridRowParams<RowModel>;
  open: boolean;
  container?: () => HTMLElement;
  onSaveRename: (value: string) => void;
  onClose: () => void;
}

export function RenameDialog(props: RenameDialogProps) {
  const { params, open, container, onSaveRename, onClose } = props;

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const value = formData.get('name') as string;

    onSaveRename(value);

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="rename-dialog-title"
      container={container}
      PaperProps={{
        component: 'form',
        onSubmit: handleSave,
      }}
      slotProps={{
        root: {
          style: {
            position: 'absolute',
          },
        },
        backdrop: {
          sx: {
            position: 'absolute',
          },
        },
      }}
    >
      <DialogTitle id="rename-dialog-title">Rename file</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          defaultValue={params.row.name}
          sx={{ width: 260 }}
          fullWidth
          required
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
