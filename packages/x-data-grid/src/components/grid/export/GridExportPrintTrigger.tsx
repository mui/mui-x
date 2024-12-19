/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import { GridPrintExportOptions } from '../../../models/gridExport';
import type { GridSlotProps } from '../../../models';

export type GridExportPrintTriggerProps = GridSlotProps['baseButton'] & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton']>;
  /**
   * The options to apply on the Print export.
   * @demos
   *   - [Print export](/x/react-data-grid/export/#print-export)
   */
  options?: GridPrintExportOptions;
};

/**
 * Demos:
 *
 * - [Export](https://mui.com/x/react-data-grid/components/export/)
 *
 * API:
 *
 * - [GridExportPrintTrigger API](https://mui.com/x/api/data-grid/grid-export-print-trigger/)
 */
const GridExportPrintTrigger = React.forwardRef<HTMLButtonElement, GridExportPrintTriggerProps>(
  function GridExportPrintTrigger(props, ref) {
    const { render, options, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      apiRef.current.exportDataAsPrint(options);
      onClick?.(event);
    };

    return useGridComponentRenderer(rootProps.slots.baseButton, render, {
      ...rootProps.slotProps?.baseButton,
      ref,
      onClick: handleClick,
      ...other,
    });
  },
);

GridExportPrintTrigger.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The options to apply on the Print export.
   * @demos
   *   - [Print export](/x/react-data-grid/export/#print-export)
   */
  options: PropTypes.shape({
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
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { GridExportPrintTrigger };
