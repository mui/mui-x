import * as React from 'react';
import {
  GridArrowDropDownIcon,
  GridToolbarV8 as GridToolbar,
  useGridApiContext,
} from '@mui/x-data-grid-premium';
import MenuItem from '@mui/material/MenuItem';
import useId from '@mui/utils/useId';
import Menu from '@mui/material/Menu';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Tooltip from '@mui/material/Tooltip';

export function DownloadMenu() {
  const apiRef = useGridApiContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
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
        <GridToolbar.Button
          id={buttonId}
          aria-haspopup="menu"
          aria-controls={open ? menuId : undefined}
          aria-expanded={open ? 'true' : undefined}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <FileDownloadIcon fontSize="small" />
          <GridArrowDropDownIcon fontSize="small" sx={{ mx: -0.25 }} />
        </GridToolbar.Button>
      </Tooltip>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
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
