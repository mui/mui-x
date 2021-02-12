import * as React from 'react';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { ApiContext } from '../api-context';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridMenu } from '../menu/GridMenu';
import { ExportOption } from '../../models';

export function ExportSelector() {
  const apiRef = React.useContext(ApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const ExportIcon = apiRef!.current.components!.ExportIcon!;

  const ExportOptions: Array<ExportOption> = [
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

  // Disable the button if the corresponding is disabled
  if (options.disableCsvExport) {
    return null;
  }

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
        aria-label={apiRef!.current.getLocaleText('toolbarExportLabel')}
        aria-expanded="true"
        aria-haspopup="listbox"
        aria-labelledby="MuiDataGrid-export-selector-menu"
        id="MuiDataGrid-export-selector-button"
      >
        {apiRef!.current.getLocaleText('toolbarExport')}
      </Button>
      <GridMenu
        open={Boolean(anchorEl)}
        target={anchorEl}
        onClickAway={handleExportSelectorClose}
        position="bottom-start"
      >
        <MenuList
          id="MuiDataGrid-export-selector-menu"
          role="listbox"
          aria-labelledby="MuiDataGrid-export-selector-button"
          onKeyDown={handleListKeyDown}
          autoFocusItem={Boolean(anchorEl)}
        >
          {renderExportOptions}
        </MenuList>
      </GridMenu>
    </React.Fragment>
  );
}
