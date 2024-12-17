/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridComponentRenderer, RenderProp, GridSlotProps } from '@mui/x-data-grid';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridExcelExportOptions } from '../../../hooks/features/export';

export type GridExportExcelTriggerProps = GridSlotProps['baseButton'] & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<{}>;
  /**
   * The options to apply on the Excel export.
   * @demos
   *   - [Excel export](/x/react-data-grid/export/#excel-export)
   */
  options?: GridExcelExportOptions;
};

/**
 * Demos:
 *
 * - [Export](https://mui.com/x/react-data-grid/components/export/)
 *
 * API:
 *
 * - [GridExportExcelTrigger API](https://mui.com/x/api/data-grid/grid-export-excel-trigger/)
 */
const GridExportExcelTrigger = React.forwardRef<HTMLButtonElement, GridExportExcelTriggerProps>(
  function GridExportExcelTrigger(props, ref) {
    const { render, options, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      apiRef.current.exportDataAsExcel(options);
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

GridExportExcelTrigger.propTypes = {
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

export { GridExportExcelTrigger };
