import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import type { RenderProp } from '@mui/x-internals/useComponentRenderer';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { GridPrintExportOptions } from '../../models/gridExport';
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
      apiRef.current.exportDataAsPrint(options).catch((error) => {
        console.error('MUI X Data Grid: Error exporting the grid as print:', error);
      });
      onClick?.(event);
    };

    const element = useComponentRenderer(rootProps.slots.baseButton, render, {
      ...rootProps.slotProps?.baseButton,
      onClick: handleClick,
      ...other,
      ref,
    });

    return <React.Fragment>{element}</React.Fragment>;
  },
);

ExportPrint.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  /**
   * If `true`, the button is disabled.
   */
  disabled: PropTypes.bool,
  /**
   * The id of the button element.
   */
  id: PropTypes.string,
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
    onStylesheetError: PropTypes.func,
    pageStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  }),
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * The ARIA role of the button element.
   */
  role: PropTypes.string,
  /**
   * The size of the button.
   */
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  /**
   * Element placed before the children.
   */
  startIcon: PropTypes.node,
  style: PropTypes.object,
  /**
   * The `tabIndex` of the button element.
   */
  tabIndex: PropTypes.number,
  /**
   * The title of the button element.
   */
  title: PropTypes.string,
  /**
   * @ignore
   */
  touchRippleRef: PropTypes.any,
} as any;

export { ExportPrint };
