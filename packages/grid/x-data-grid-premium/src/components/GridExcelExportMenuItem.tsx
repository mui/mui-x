import * as React from 'react';
import PropTypes from 'prop-types';
import { GridExportMenuItemProps } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridExcelExportOptions } from '../hooks/features/export';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

export type GridExcelExportMenuItemProps = GridExportMenuItemProps<GridExcelExportOptions>;

function GridExcelExportMenuItem(props: GridExcelExportMenuItemProps) {
  const apiRef = useGridApiContext();
  const { hideMenu, options, ...other } = props;
  const rootProps = useGridRootProps();

  return (
    <rootProps.slots.baseMenuItem
      onClick={() => {
        apiRef.current.exportDataAsExcel(options);
        hideMenu?.();
      }}
      {...rootProps.slotProps?.baseMenuItem}
      {...other}
    >
      {apiRef.current.getLocaleText('toolbarExportExcel')}
    </rootProps.slots.baseMenuItem>
  );
}

GridExcelExportMenuItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  hideMenu: PropTypes.func,
  options: PropTypes.shape({
    allColumns: PropTypes.bool,
    columnsStyles: PropTypes.object,
    disableToolbarButton: PropTypes.bool,
    exceljsPostProcess: PropTypes.func,
    exceljsPreProcess: PropTypes.func,
    fields: PropTypes.arrayOf(PropTypes.string),
    fileName: PropTypes.string,
    getRowsToExport: PropTypes.func,
    includeColumnGroupsHeaders: PropTypes.bool,
    includeHeaders: PropTypes.bool,
    valueOptionsSheetName: PropTypes.string,
    worker: PropTypes.func,
  }),
} as any;

export { GridExcelExportMenuItem };
