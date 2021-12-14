import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId, useForkRef } from '@mui/material/utils';
import MenuList from '@mui/material/MenuList';
import Button, { ButtonProps } from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { isHideMenuKey, isTabKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridMenu } from '../menu/GridMenu';
import {
  GridCsvExportOptions,
  GridExportFormat as ExportTypes,
  GridPrintExportOptions,
} from '../../models/gridExport';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridClasses } from '../../gridClasses';

interface GridExportDisplayOptions {
  /**
   * If `true`, this export option will be removed from the GridToolbarExport menu.
   * @default false
   */
  disableToolbarButton?: boolean;
}

interface GridExportOption {
  label: React.ReactNode;
  format: ExportTypes;
  formatOptions?: (GridCsvExportOptions | GridPrintExportOptions) & GridExportDisplayOptions;
}

export interface GridToolbarExportProps extends ButtonProps {
  csvOptions?: GridCsvExportOptions & GridExportDisplayOptions;
  printOptions?: GridPrintExportOptions & GridExportDisplayOptions;
}

const GridToolbarExport = React.forwardRef<HTMLButtonElement, GridToolbarExportProps>(
  function GridToolbarExport(props, ref) {
    const { csvOptions, printOptions, onClick, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const buttonId = useId();
    const menuId = useId();

    const [open, setOpen] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const handleRef = useForkRef(ref, buttonRef);

    const exportOptions: Array<GridExportOption> = [
      {
        label: apiRef.current.getLocaleText('toolbarExportCSV'),
        format: 'csv',
        formatOptions: csvOptions,
      },
      {
        label: apiRef.current.getLocaleText('toolbarExportPrint'),
        format: 'print',
        formatOptions: printOptions,
      },
    ];

    const handleMenuOpen = (event) => {
      setOpen(true);
      onClick?.(event);
    };
    const handleMenuClose = () => setOpen(false);
    const handleExport = (option: GridExportOption) => () => {
      switch (option.format) {
        case 'csv':
          apiRef.current.exportDataAsCsv(option.formatOptions);
          break;
        case 'print':
          apiRef.current.exportDataAsPrint(option.formatOptions);
          break;
        default:
          break;
      }

      setOpen(false);
    };

    const handleListKeyDown = (event: React.KeyboardEvent) => {
      if (isTabKey(event.key)) {
        event.preventDefault();
      }
      if (isHideMenuKey(event.key)) {
        handleMenuClose();
      }
    };

    if (csvOptions?.disableToolbarButton && printOptions?.disableToolbarButton) {
      return null;
    }

    return (
      <React.Fragment>
        <Button
          ref={handleRef}
          color="primary"
          size="small"
          startIcon={<rootProps.components.ExportIcon />}
          aria-expanded={open ? 'true' : undefined}
          aria-label={apiRef.current.getLocaleText('toolbarExportLabel')}
          aria-haspopup="menu"
          aria-labelledby={menuId}
          id={buttonId}
          {...other}
          onClick={handleMenuOpen}
        >
          {apiRef.current.getLocaleText('toolbarExport')}
        </Button>
        <GridMenu
          open={open}
          target={buttonRef.current}
          onClickAway={handleMenuClose}
          position="bottom-start"
        >
          <MenuList
            id={menuId}
            className={gridClasses.menuList}
            aria-labelledby={buttonId}
            onKeyDown={handleListKeyDown}
            autoFocusItem={open}
          >
            {exportOptions.map((option, index) =>
              option.formatOptions?.disableToolbarButton ? null : (
                <MenuItem key={index} onClick={handleExport(option)}>
                  {option.label}
                </MenuItem>
              ),
            )}
          </MenuList>
        </GridMenu>
      </React.Fragment>
    );
  },
);

GridToolbarExport.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  csvOptions: PropTypes.object,
  printOptions: PropTypes.object,
} as any;

export { GridToolbarExport };
