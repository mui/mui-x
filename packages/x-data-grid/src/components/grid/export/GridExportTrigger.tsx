import * as React from 'react';
import PropTypes from 'prop-types';
import { ButtonProps } from '@mui/material/Button';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import { GridCsvExportOptions, GridPrintExportOptions } from '../../../models/gridExport';

export interface GridExportTriggerState {}

export type GridExportTriggerProps = ButtonProps & {
  // eslint-disable-next-line react/no-unused-prop-types
  render?: RenderProp<GridExportTriggerState>;
} & (
    | {
        exportType: 'csv';
        exportOptions?: GridCsvExportOptions;
      }
    | {
        exportType: 'print';
        exportOptions?: GridPrintExportOptions;
      }
  );

const GridExportTrigger = React.forwardRef<HTMLButtonElement, GridExportTriggerProps>(
  function GridExportTrigger(props, ref) {
    const { render, exportType, exportOptions, ...other } = props;
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
        default:
          break;
      }

      props.onClick?.(event);
    };

    const { renderElement } = useGridComponentRenderer({
      render,
      defaultElement: rootProps.slots.baseButton,
      props: {
        ref,
        onClick: handleClick,
        ...rootProps.slotProps?.baseButton,
        ...other,
      },
    });

    return renderElement();
  },
);

GridExportTrigger.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  exportOptions: PropTypes.oneOfType([
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
  exportType: PropTypes.oneOf(['csv', 'print']).isRequired,
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { GridExportTrigger };
