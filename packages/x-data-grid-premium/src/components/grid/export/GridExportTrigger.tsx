/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import {
  GridCsvExportOptions,
  GridPrintExportOptions,
  useGridComponentRenderer,
  RenderProp,
  GridSlotProps,
} from '@mui/x-data-grid';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridExcelExportOptions } from '../../../hooks/features/export';

export type GridExportTriggerProps = GridSlotProps['baseButton'] & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<{}>;
} & (
    | {
        /**
         * The type of export to trigger.
         */
        exportType: 'csv';
        /**
         * Configure how the export is generated.
         */
        exportOptions?: GridCsvExportOptions;
      }
    | {
        /**
         * The type of export to trigger.
         */
        exportType: 'print';
        /**
         * Configure how the export is generated.
         */
        exportOptions?: GridPrintExportOptions;
      }
    | {
        /**
         * The type of export to trigger.
         */
        exportType: 'excel';
        /**
         * Configure how the export is generated.
         */
        exportOptions?: GridExcelExportOptions;
      }
  );

/**
 * Demos:
 *
 * - [Export](https://mui.com/x/react-data-grid/components/export/)
 *
 */
const GridExportTrigger = React.forwardRef<HTMLButtonElement, GridExportTriggerProps>(
  function GridExportTrigger(props, ref) {
    const { render, exportType, exportOptions, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      switch (exportType) {
        case 'csv':
          apiRef.current.exportDataAsCsv(exportOptions);
          break;
        case 'print':
          apiRef.current.exportDataAsPrint(exportOptions);
          break;
        case 'excel':
          apiRef.current.exportDataAsExcel(exportOptions);
          break;
        default:
          break;
      }

      onClick?.(event);
    };

    return useGridComponentRenderer(rootProps.slots.baseButton, render, {
      ref,
      onClick: handleClick,
      ...rootProps.slotProps?.baseButton,
      ...other,
    });
  },
);

GridExportTrigger.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Configure how the export is generated.
   */
  exportOptions: PropTypes.oneOfType([
    PropTypes.shape({
      allColumns: PropTypes.bool,
      columnsStyles: PropTypes.object,
      escapeFormulas: PropTypes.bool,
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
    PropTypes.shape({
      allColumns: PropTypes.bool,
      delimiter: PropTypes.string,
      escapeFormulas: PropTypes.bool,
      fields: PropTypes.arrayOf(PropTypes.string),
      fileName: PropTypes.string,
      getRowsToExport: PropTypes.func,
      includeColumnGroupsHeaders: PropTypes.bool,
      includeHeaders: PropTypes.bool,
      shouldAppendQuotes: PropTypes.bool,
      utf8WithBom: PropTypes.bool,
    }),
    PropTypes.shape({
      allColumns: PropTypes.bool,
      bodyClassName: PropTypes.string,
      copyStyles: PropTypes.bool,
      fields: PropTypes.arrayOf(PropTypes.string),
      fileName: PropTypes.string,
      getRowsToExport: PropTypes.func,
      hideFooter: PropTypes.bool,
      hideToolbar: PropTypes.bool,
      includeCheckboxes: PropTypes.bool,
      pageStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    }),
  ]),
  /**
   * The type of export to trigger.
   */
  exportType: PropTypes.oneOf(['csv', 'excel', 'print']).isRequired,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { GridExportTrigger };
