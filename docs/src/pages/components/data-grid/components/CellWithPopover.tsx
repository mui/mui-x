import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

export default function CellWithPopover() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 4,
  });
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [value, setValue] = React.useState('');

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    const field = event.currentTarget.dataset.field!;
    const id = event.currentTarget.parentElement!.dataset.id!;
    const row = data.rows.find((r) => r.id === id)!;
    setValue(row[field]);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        componentsProps={{
          cell: {
            onMouseEnter: handlePopoverOpen,
            onMouseLeave: handlePopoverClose,
          },
        }}
      />
      <Popover
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{`${value.length} characters.`}</Typography>
      </Popover>
    </div>
  );
}
