import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridComponentRenderer, RenderProp } from '../../hooks/utils/useGridComponentRenderer';
import { GridPrintExportOptions } from '../../models/gridExport';
import type { GridSlotProps } from '../../models';

export type ExportPrintProps = GridSlotProps['baseButton'] & {
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
 * A button that triggers a print export.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Export](https://mui.com/x/react-data-grid/components/export/)
 *
 * API:
 *
 * - [ExportPrint API](https://mui.com/x/api/data-grid/export-print/)
 */
const ExportPrint = forwardRef<HTMLButtonElement, ExportPrintProps>(
  function ExportPrint(props, ref) {
    const { render, options, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      apiRef.current.exportDataAsPrint(options);
      onClick?.(event);
    };

    const element = useGridComponentRenderer(rootProps.slots.baseButton, render, {
      ...rootProps.slotProps?.baseButton,
      onClick: handleClick,
      ...other,
      ref,
    });

    return <React.Fragment>{element}</React.Fragment>;
  },
);

ExportPrint.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onPointerDown: PropTypes.func,
  onPointerUp: PropTypes.func,
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
  role: PropTypes.string,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  startIcon: PropTypes.node,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  title: PropTypes.string,
  touchRippleRef: PropTypes.any,
} as any;

export { ExportPrint };
