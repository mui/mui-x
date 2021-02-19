import * as React from 'react';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { GridApiContext } from '../GridApiContext';
import { GridMenu } from '../menu/GridMenu';
import { GridExportOption } from '../../models';

export function GridToolbarExport() {
  const apiRef = React.useContext(GridApiContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const ExportIcon = apiRef!.current.components!.ExportIcon!;

  const ExportOptions: Array<GridExportOption> = [
    {
      label: apiRef!.current.getLocaleText('toolbarExportCSV'),
      format: 'csv',
    },
  ];

  const handleExportSelectorOpen = (event) => setAnchorEl(event.currentTarget);
  const handleExportSelectorClose = () => setAnchorEl(null);
  const handleExport = (format) => {
    if (format === 'csv') {
      apiRef!.current.exportDataAsCsv();
    }

    setAnchorEl(null);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
      event.preventDefault();
      handleExportSelectorClose();
    }
  };

  const renderExportOptions: Array<React.ReactElement> = ExportOptions.map((option, index) => (
    <MenuItem key={index} onClick={() => handleExport(option.format)}>
      {option.label}
    </MenuItem>
  ));

  return (
    <React.Fragment>
      <Button
        color="primary"
        size="small"
        startIcon={<ExportIcon />}
        onClick={handleExportSelectorOpen}
        aria-expanded={Boolean(anchorEl)}
        aria-haspopup="true"
      >
        {apiRef!.current.getLocaleText('toolbarExport')}
      </Button>
      <GridMenu
        open={Boolean(anchorEl)}
        target={anchorEl}
        onClickAway={handleExportSelectorClose}
        position="bottom-start"
      >
        <MenuList onKeyDown={handleListKeyDown} autoFocusItem={Boolean(anchorEl)}>
          {renderExportOptions}
        </MenuList>
      </GridMenu>
    </React.Fragment>
  );
}
