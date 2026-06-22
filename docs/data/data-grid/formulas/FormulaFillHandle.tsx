import * as React from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DataGridPremium, GridColDef, GridRowsProp } from '@mui/x-data-grid-premium';

const initialColumns: GridColDef[] = [
  { field: 'item', headerName: 'Item', width: 150 },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'quantity',
    headerName: 'Qty',
    type: 'number',
    width: 90,
    editable: true,
  },
  {
    field: 'total',
    headerName: 'Total',
    type: 'number',
    width: 130,
    allowFormulas: true,
    editable: true,
  },
];

// Only the first row holds a formula. Select its Total cell and drag the fill
// handle down (or press Ctrl+D) to copy the formula into the rows below — the
// references adjust to each target row.
const rows: GridRowsProp = [
  { id: 1, item: 'Keyboard', price: 89, quantity: 3, total: '=price * quantity' },
  { id: 2, item: 'Mouse', price: 45, quantity: 5, total: '' },
  { id: 3, item: 'Monitor', price: 320, quantity: 2, total: '' },
  { id: 4, item: 'Webcam', price: 60, quantity: 2, total: '' },
  { id: 5, item: 'USB-C cable', price: 12, quantity: 10, total: '' },
];

function getUniqueField(name: string, columns: GridColDef[]) {
  const existingFields = new Set(columns.map((column) => column.field));
  let field = name;
  let suffix = 2;
  while (existingFields.has(field)) {
    field = `${name}_${suffix}`;
    suffix += 1;
  }
  return field;
}

interface AddFormulaColumnPopoverProps {
  anchorEl: HTMLElement;
  onClose: () => void;
  onAdd: (name: string) => void;
}

function AddFormulaColumnPopover({
  anchorEl,
  onClose,
  onAdd,
}: AddFormulaColumnPopoverProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [columnName, setColumnName] = React.useState('');

  const handleAdd = () => {
    const name = columnName.trim();
    if (name === '') {
      return;
    }
    onAdd(name);
    onClose();
  };

  return (
    <Popover
      open
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      // Focus the input once the popover has finished opening: focusing earlier
      // races with the focus trap, which would steal it back.
      slotProps={{ transition: { onEntered: () => inputRef.current?.focus() } }}
    >
      <Stack direction="row" spacing={1} sx={{ p: 1.5 }}>
        <TextField
          inputRef={inputRef}
          size="small"
          label="Column name"
          value={columnName}
          onChange={(event) => setColumnName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // Prevent the keystroke's default activation from re-triggering the
              // "Add Formula Column" button once focus is restored to it as the
              // popover closes (which would immediately reopen the popover).
              event.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button onClick={handleAdd} disabled={columnName.trim() === ''}>
          Add
        </Button>
      </Stack>
    </Popover>
  );
}

export default function FormulaFillHandle() {
  const [columns, setColumns] = React.useState<GridColDef[]>(initialColumns);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleAddColumn = (name: string) => {
    setColumns((prevColumns) => [
      ...prevColumns,
      {
        field: getUniqueField(name.replaceAll(' ', '_'), prevColumns),
        headerName: name,
        width: 150,
        editable: true,
        allowFormulas: true,
      },
    ]);
  };

  return (
    <div style={{ width: '100%' }}>
      <Button size="small" onClick={(event) => setAnchorEl(event.currentTarget)}>
        Add Formula Column
      </Button>
      {anchorEl && (
        <AddFormulaColumnPopover
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          onAdd={handleAddColumn}
        />
      )}
      <div style={{ height: 320, width: '100%' }}>
        <DataGridPremium
          rows={rows}
          columns={columns}
          rowSelection={false}
          cellSelection
          cellSelectionFillHandle
          formulaA1Notation
          showCellVerticalBorder
          showColumnVerticalBorder
          density="compact"
          disablePivoting
        />
      </div>
    </div>
  );
}
