import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  ExportCsv,
  ExportPrint,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const menuId = React.useId();
  const triggerId = React.useId();
  const closeMenu = () => setAnchorEl(null);

  return (
    <Toolbar>
      <ToolbarButton
        render={<Button size="small" startIcon={<rootProps.slots.exportIcon />} />}
        id={triggerId}
        aria-haspopup="menu"
        aria-controls={anchorEl ? menuId : undefined}
        aria-expanded={Boolean(anchorEl)}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        {apiRef.current.getLocaleText('toolbarExport')}
      </ToolbarButton>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        slotProps={{ list: { 'aria-labelledby': triggerId } }}
      >
        <ExportCsv render={<MenuItem />} onClick={closeMenu}>
          {apiRef.current.getLocaleText('toolbarExportCSV')}
        </ExportCsv>
        <ExportPrint render={<MenuItem />} onClick={closeMenu}>
          {apiRef.current.getLocaleText('toolbarExportPrint')}
        </ExportPrint>
      </Menu>
    </Toolbar>
  );
}

export default function ExportCustomToolbar() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{
          toolbar: CustomToolbar,
        }}
        showToolbar
      />
    </div>
  );
}
