import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import type { GridColDef } from '@mui/x-data-grid-premium';

interface AddColumnDialogProps {
  open: boolean;
  existingFields: string[];
  onClose: () => void;
  onAdd: (column: GridColDef) => void;
}

// Field names shaped like A1 addresses (`q1`, `ab12`) are valid but display as
// `FIELD("q1")` in A1 notation to stay unambiguous — steer users away from
// them to keep the mental model simple.
const A1_LIKE = /^[a-zA-Z]{1,3}\d+$/;

function toFieldName(header: string) {
  const words = header
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
  if (words.length === 0) {
    return '';
  }
  return words
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('');
}

function AddColumnDialog(props: AddColumnDialogProps) {
  const { open, existingFields, onClose, onAdd } = props;
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<'number' | 'string'>('number');
  const [allowFormulas, setAllowFormulas] = React.useState(true);

  const field = toFieldName(name);
  let error: string | null = null;
  if (name.trim() !== '') {
    if (field === '') {
      error = 'The name must contain letters or digits.';
    } else if (existingFields.includes(field)) {
      error = `A column with the field "${field}" already exists.`;
    } else if (A1_LIKE.test(field)) {
      error = 'This name reads as an A1 cell address — pick a longer one.';
    }
  }

  const handleAdd = () => {
    if (name.trim() === '' || error !== null) {
      return;
    }
    onAdd({
      field,
      headerName: name.trim(),
      type: type === 'number' ? 'number' : undefined,
      width: 120,
      editable: true,
      allowFormulas,
    });
    setName('');
    setType('number');
    setAllowFormulas(true);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock>
      <DialogTitle>Add a column</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <TextField
            autoFocus
            label="Column name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleAdd();
              }
            }}
            error={error !== null}
            helperText={error ?? (field !== '' ? `Field: ${field}` : ' ')}
            size="small"
          />
          <TextField
            select
            label="Type"
            value={type}
            onChange={(event) => setType(event.target.value as 'number' | 'string')}
            size="small"
            slotProps={{ select: { MenuProps: { disableScrollLock: true } } }}
          >
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="string">Text</MenuItem>
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={allowFormulas}
                onChange={(event) => setAllowFormulas(event.target.checked)}
              />
            }
            label="Allow formulas"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={name.trim() === '' || error !== null}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { AddColumnDialog };
