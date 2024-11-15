import * as React from 'react';
import { Grid, useGridApiContext } from '@mui/x-data-grid-premium';
import MenuItem from '@mui/material/MenuItem';
import useId from '@mui/utils/useId';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export function DownloadMenu() {
  const apiRef = useGridApiContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const buttonId = useId();
  const menuId = useId();
  const open = !!anchorEl;

  const downloadCsv = () => {
    apiRef.current.exportDataAsCsv();
    setAnchorEl(null);
  };

  const downloadExcel = () => {
    // Only available in the Premium version
    apiRef.current?.exportDataAsExcel();
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Tooltip title="Download">
        <Grid.Toolbar.Button
          id={buttonId}
          aria-haspopup="menu"
          aria-controls={open ? menuId : undefined}
          aria-expanded={open ? 'true' : undefined}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <FileDownloadIcon fontSize="small" />
          <ArrowDropDownIcon fontSize="small" sx={{ mx: -0.25 }} />
        </Grid.Toolbar.Button>
      </Tooltip>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        MenuListProps={{
          'aria-labelledby': buttonId,
        }}
      >
        <MenuItem onClick={downloadCsv}>Download as CSV</MenuItem>
        <MenuItem onClick={downloadExcel} disabled>
          Download as Excel
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
