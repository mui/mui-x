/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import { GridCsvExportOptions } from '../../../models/gridExport';
import type { GridSlotProps } from '../../../models';

export type GridExportCsvTriggerProps = GridSlotProps['baseButton'] & {
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
 * Demos:
 *
 * - [Export](https://mui.com/x/react-data-grid/components/export/)
 *
 * API:
 *
 * - [GridExportCsvTrigger API](https://mui.com/x/api/data-grid/grid-export-csv-trigger/)
 */
const GridExportCsvTrigger = React.forwardRef<HTMLButtonElement, GridExportCsvTriggerProps>(
  function GridExportCsvTrigger(props, ref) {
    const { render, options, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      apiRef.current.exportDataAsCsv(options);
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

GridExportCsvTrigger.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
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
} as any;

export { GridExportCsvTrigger };
