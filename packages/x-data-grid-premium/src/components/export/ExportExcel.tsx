import * as React from 'react';
import PropTypes from 'prop-types';
import { GridSlotProps, RenderProp } from '@mui/x-data-grid';
import { useGridComponentRenderer } from '@mui/x-data-grid/internals';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridExcelExportOptions } from '../../hooks/features/export';

export type ExportExcelProps = GridSlotProps['baseButton'] & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton']>;
  /**
   * The options to apply on the Excel export.
   * @demos
   *   - [Excel export](/x/react-data-grid/export/#excel-export)
   */
  options?: GridExcelExportOptions;
};

/**
 * A button that triggers an Excel export.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Export](https://mui.com/x/react-data-grid/components/export/)
 *
 * API:
 *
 * - [ExportExcel API](https://mui.com/x/api/data-grid/export-excel/)
 */
const ExportExcel = forwardRef<HTMLButtonElement, ExportExcelProps>(
  function ExportExcel(props, ref) {
    const { render, options, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      apiRef.current.exportDataAsExcel(options);
      onClick?.(event);
    };

    const element = useGridComponentRenderer(rootProps.slots.baseButton, render, {
      onClick: handleClick,
      ...rootProps.slotProps?.baseButton,
      ...other,
      ref,
    });

    return <React.Fragment>{element}</React.Fragment>;
  },
);

ExportExcel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  /**
   * The options to apply on the Excel export.
   * @demos
   *   - [Excel export](/x/react-data-grid/export/#excel-export)
   */
  options: PropTypes.shape({
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
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  role: PropTypes.string,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  startIcon: PropTypes.node,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  title: PropTypes.string,
  touchRippleRef: PropTypes.any,
} as any;

export { ExportExcel };
