import * as React from 'react';
// @ts-expect-error fixed in Material-UI v5, types definitions were added.
import { unstable_useId as useId } from '@material-ui/core/utils';
import MenuList from '@material-ui/core/MenuList';
import Button, { ButtonProps } from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { isHideMenuKey, isTabKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { GridMenu } from '../menu/GridMenu';
import { GridCsvExportOptions, GridExportFormat as ExportTypes } from '../../models/gridExport';

interface GridExportFormat {
  format: ExportTypes;
  formatOptions?: GridCsvExportOptions;
}

type GridExportFormatOption = GridExportFormat;

type GridExportOption = GridExportFormatOption & {
  label: React.ReactNode;
};

export interface GridToolbarExportProps extends ButtonProps {
  csvOptions?: GridCsvExportOptions;
}

export const GridToolbarExport = React.forwardRef<HTMLButtonElement, GridToolbarExportProps>(
  function GridToolbarExport(props, ref) {
    const { csvOptions, onClick, ...other } = props;
    const apiRef = useGridApiContext();
    const buttonId = useId();
    const menuId = useId();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const ExportIcon = apiRef!.current.components!.ExportIcon!;

    const exportOptions: Array<GridExportOption> = [
      {
        label: apiRef!.current.getLocaleText('toolbarExportCSV'),
        format: 'csv',
        formatOptions: csvOptions,
      },
      {
        label: apiRef!.current.getLocaleText('toolbarExportPrint'),
        format: 'print',
      },
    ];

    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
      onClick?.(event);
    };
    const handleMenuClose = () => setAnchorEl(null);
    const handleExport = (option: GridExportOption) => () => {
      switch (option.format) {
        case 'csv':
          apiRef!.current.exportDataAsCsv(option.formatOptions);
          break;
        case 'print':
          apiRef!.current.exportDataAsPrint();
          break;
        default:
          break;
      }

      setAnchorEl(null);
    };

    const handleListKeyDown = (event: React.KeyboardEvent) => {
      if (isTabKey(event.key)) {
        event.preventDefault();
      }
      if (isHideMenuKey(event.key)) {
        handleMenuClose();
      }
    };

    return (
      <React.Fragment>
        <Button
          ref={ref}
          color="primary"
          size="small"
          startIcon={<ExportIcon />}
          aria-expanded={anchorEl ? 'true' : undefined}
          aria-label={apiRef!.current.getLocaleText('toolbarExportLabel')}
          aria-haspopup="menu"
          aria-labelledby={menuId}
          id={buttonId}
          {...other}
          onClick={handleMenuOpen}
        >
          {apiRef!.current.getLocaleText('toolbarExport')}
        </Button>
        <GridMenu
          open={Boolean(anchorEl)}
          target={anchorEl}
          onClickAway={handleMenuClose}
          position="bottom-start"
        >
          <MenuList
            id={menuId}
            className="MuiDataGrid-gridMenuList"
            aria-labelledby={buttonId}
            onKeyDown={handleListKeyDown}
            autoFocusItem={Boolean(anchorEl)}
          >
            {exportOptions.map((option, index) => (
              <MenuItem key={index} onClick={handleExport(option)}>
                {option.label}
              </MenuItem>
            ))}
          </MenuList>
        </GridMenu>
      </React.Fragment>
    );
  },
);
