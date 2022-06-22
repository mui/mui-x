import * as React from 'react';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { TouchRippleActions } from '@mui/material/ButtonBase/TouchRipple';

const RenderDate = (props: GridRenderCellParams<Date>) => {
  const { hasFocus, value } = props;
  const buttonElement = React.useRef<HTMLButtonElement | null>(null);
  const rippleRef = React.useRef<TouchRippleActions | null>(null);

  React.useLayoutEffect(() => {
    if (hasFocus) {
      const input = buttonElement.current?.querySelector('input');
      input?.focus();
    } else if (rippleRef.current) {
      // Only available in @mui/material v5.4.1 or later
      rippleRef.current.stop({} as any);
    }
  }, [hasFocus]);

  return (
    <strong>
      {value?.getFullYear() ?? ''}
      <Button
        component="button"
        ref={buttonElement}
        touchRippleRef={rippleRef}
        variant="contained"
        size="small"
        style={{ marginLeft: 16 }}
        // Remove button from tab sequence when cell does not have focus
        tabIndex={hasFocus ? 0 : -1}
        onKeyDown={(event: React.KeyboardEvent) => {
          if (event.key === ' ') {
            // Prevent key navigation when focus is on button
            event.stopPropagation();
          }
        }}
      >
        Open
      </Button>
    </strong>
  );
};

const columns: GridColDef[] = [
  {
    field: 'date',
    headerName: 'Year',
    width: 150,
    renderCell: RenderDate,
  },
];

const rows = [
  {
    id: 1,
    date: new Date(1979, 0, 1),
  },
  {
    id: 2,
    date: new Date(1984, 1, 1),
  },
  {
    id: 3,
    date: new Date(1992, 2, 1),
  },
];

export default function RenderCellGrid() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
