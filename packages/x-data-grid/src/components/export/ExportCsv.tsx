import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import type { RenderProp } from '@mui/x-internals/useComponentRenderer';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { GridCsvExportOptions } from '../../models/gridExport';
import type { GridSlotProps } from '../../models';

export type ExportCsvProps = GridSlotProps['baseButton'] & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton']>;
  /**
   * The options to apply on the CSV export.
   * @demos
   *   - [CSV export](/x/react-data-grid/export/#csv-export)
   */
  options?: GridCsvExportOptions;
};

/**
 * A button that triggers a CSV export.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Export](https://mui.com/x/react-data-grid/components/export/)
 *
 * API:
 *
 * - [ExportCsv API](https://mui.com/x/api/data-grid/export-csv/)
 */
const ExportCsv = forwardRef<HTMLButtonElement, ExportCsvProps>(function ExportCsv(props, ref) {
  const { render, options, onClick, ...other } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    apiRef.current.exportDataAsCsv(options);
    onClick?.(event);
  };

  const element = useComponentRenderer(rootProps.slots.baseButton, render, {
    ...rootProps.slotProps?.baseButton,
    onClick: handleClick,
    ...other,
    ref,
  });

  return <React.Fragment>{element}</React.Fragment>;
});

ExportCsv.propTypes /* remove-proptypes */ = {
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
   * The options to apply on the CSV export.
   * @demos
   *   - [CSV export](/x/react-data-grid/export/#csv-export)
   */
  options: PropTypes.shape({
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

export { ExportCsv };
