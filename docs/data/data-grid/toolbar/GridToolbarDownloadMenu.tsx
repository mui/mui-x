import * as React from 'react';
import {
  DataGridPremium,
  GridToolbarV8 as GridToolbar,
  useGridApiContext,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import useId from '@mui/utils/useId';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function ExportMenu() {
  const apiRef = useGridApiContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const buttonId = useId();
  const menuId = useId();
  const open = !!anchorEl;

  const exportCsv = () => {
    apiRef.current.exportDataAsCsv();
    setAnchorEl(null);
  };

  const exportExcel = () => {
    apiRef.current.exportDataAsExcel();
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <GridToolbar.Button
        id={buttonId}
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? menuId : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <FileDownloadIcon fontSize="small" />
        Download
        <ArrowDropDownIcon fontSize="small" sx={{ mx: -0.25 }} />
      </GridToolbar.Button>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': buttonId,
        }}
      >
        <MenuItem onClick={exportCsv}>Download as CSV</MenuItem>
        <MenuItem onClick={exportExcel}>Download as Excel</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

function Toolbar() {
  return (
    <GridToolbar.Root>
      <ExportMenu />
    </GridToolbar.Root>
  );
}

export default function GridToolbarDownloadMenu() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium {...data} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
