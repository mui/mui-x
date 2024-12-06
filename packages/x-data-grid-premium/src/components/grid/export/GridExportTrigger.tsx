/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import { ButtonProps } from '@mui/material/Button';
import {
  GridCsvExportOptions,
  GridPrintExportOptions,
  useGridComponentRenderer,
  RenderProp,
  GridExportTriggerState,
} from '@mui/x-data-grid';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridExcelExportOptions } from '../../../hooks/features/export';

export type GridExportTriggerProps = ButtonProps & {
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
    | {
        exportType: 'excel';
        exportOptions?: GridExcelExportOptions;
      }
  );

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
  exportType: PropTypes.oneOf(['csv', 'excel', 'print']).isRequired,
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { GridExportTrigger };
