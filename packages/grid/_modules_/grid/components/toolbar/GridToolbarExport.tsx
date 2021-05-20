import * as React from 'react';
// @ts-expect-error fixed in Material-UI v5, types definitions were added.
import { unstable_useId as useId } from '@material-ui/core/utils';
import MenuList from '@material-ui/core/MenuList';
import Button, { ButtonProps } from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { isHideMenuKey, isTabKey } from '../../utils/keyboardUtils';
import { GridApiContext } from '../GridApiContext';
import { GridMenu } from '../menu/GridMenu';
import { GridExportOption, GridExportFormat, GridExportConfiguration } from '../../models';

type GridToolbarExportProps = ButtonProps & { exportConfiguration?: GridExportConfiguration };

export const GridToolbarExport = React.forwardRef<HTMLButtonElement, GridToolbarExportProps>(
  function GridToolbarExport({ exportConfiguration, ...other }, ref) {
    const apiRef = React.useContext(GridApiContext);
    const exportButtonId = useId();
    const exportMenuId = useId();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const ExportIcon = apiRef!.current.components!.ExportIcon!;

    const ExportOptions: Array<GridExportOption> = [];

    ExportOptions.push({
      label: apiRef!.current.getLocaleText('toolbarExportCSV'),
      format: 'csv',
      options: exportConfiguration?.csv,
    });

    const handleExportSelectorOpen = (event) => setAnchorEl(event.currentTarget);
    const handleExportSelectorClose = () => setAnchorEl(null);
    const handleExport = (option: GridExportFormat, fileName?: string) => {
      if (option.format === 'csv') {
        apiRef!.current.exportDataAsCsv(option.options, fileName);
      }

      setAnchorEl(null);
    };

    const handleListKeyDown = (event: React.KeyboardEvent) => {
      if (isTabKey(event.key)) {
        event.preventDefault();
      }
      if (isHideMenuKey(event.key)) {
        handleExportSelectorClose();
      }
    };

    const renderExportOptions: Array<React.ReactElement> = ExportOptions.map((option, index) => (
      <MenuItem key={index} onClick={() => handleExport(option, exportConfiguration?.fileName)}>
        {option.label}
      </MenuItem>
    ));

    return (
      <React.Fragment>
        <Button
          ref={ref}
          color="primary"
          size="small"
          startIcon={<ExportIcon />}
          onClick={handleExportSelectorOpen}
          aria-expanded={anchorEl ? 'true' : undefined}
          aria-haspopup="menu"
          aria-labelledby={exportMenuId}
          id={exportButtonId}
          {...other}
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
            id={exportMenuId}
            className="MuiDataGrid-gridMenuList"
            aria-labelledby={exportButtonId}
            onKeyDown={handleListKeyDown}
            autoFocusItem={Boolean(anchorEl)}
          >
            {renderExportOptions}
          </MenuList>
        </GridMenu>
      </React.Fragment>
    );
  },
);
