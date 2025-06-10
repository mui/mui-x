import * as React from 'react';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  useGridApiContext,
} from '@mui/x-data-grid';
import { randomId, useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const [newPanelOpen, setNewPanelOpen] = React.useState(false);
  const newPanelTriggerRef = React.useRef(null);

  const handleClose = () => {
    setNewPanelOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    apiRef.current.updateRows([
      {
        id: randomId(),
        commodity: formData.get('commodity'),
        quantity: Number(formData.get('quantity')),
        unitPrice: Number(formData.get('unitPrice')),
      },
    ]);
    handleClose();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <Toolbar>
      <Tooltip title="Add new commodity">
        <ToolbarButton
          ref={newPanelTriggerRef}
          aria-describedby="new-panel"
          onClick={() => setNewPanelOpen((prev) => !prev)}
        >
          <AddIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>

      <Popper
        open={newPanelOpen}
        anchorEl={newPanelTriggerRef.current}
        placement="bottom-end"
        id="new-panel"
        onKeyDown={handleKeyDown}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 300,
              p: 2,
            }}
            elevation={8}
          >
            <Typography fontWeight="bold">Add new commodity</Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Commodity"
                  name="commodity"
                  size="small"
                  autoFocus
                  fullWidth
                  required
                />
                <TextField
                  label="Quantity"
                  type="number"
                  name="quantity"
                  size="small"
                  fullWidth
                  required
                />
                <TextField
                  label="Price"
                  type="number"
                  name="unitPrice"
                  size="small"
                  fullWidth
                  required
                />
                <Button type="submit" variant="contained" fullWidth>
                  Add Commodity
                </Button>
              </Stack>
            </form>
          </Paper>
        </ClickAwayListener>
      </Popper>

      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>

      <Tooltip title="Filters">
        <FilterPanelTrigger
          render={(props, state) => (
            <ToolbarButton {...props} color="default">
              <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                <FilterListIcon fontSize="small" />
              </Badge>
            </ToolbarButton>
          )}
        />
      </Tooltip>
    </Toolbar>
  );
}

export default function GridToolbarCustomPanel() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 2,
    maxColumns: 10,
    visibleFields: ['commodity', 'quantity', 'unitPrice'],
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}
