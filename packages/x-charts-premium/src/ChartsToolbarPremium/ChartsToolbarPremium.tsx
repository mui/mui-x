'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import { ChartsToolbarPro } from '@mui/x-charts-pro/ChartsToolbarPro';
import type { ChartsToolbarProProps } from '@mui/x-charts-pro/ChartsToolbarPro';
import { ChartsToolbarExcelExportMenuItem } from './ChartsToolbarExcelExportMenuItem';
import type { ChartPremiumApiWithExcelExport } from './ChartsToolbarExcelExportTrigger';
import { useChartPremiumApiContext } from '../context/useChartPremiumApiContext';
import type { ChartExcelExportOptions } from '../internals/plugins/useChartPremiumExport';

export interface ChartsToolbarPremiumExcelExportOptions extends ChartExcelExportOptions {
  /**
   * If `true`, the Excel export button is not shown in the toolbar's export menu.
   * @default false
   */
  disableToolbarButton?: boolean;
}

export interface ChartsToolbarPremiumDataGridExportOptions {
  /**
   * If `true`, the Data Grid export button is not shown in the toolbar's export menu.
   * @default false
   */
  disableToolbarButton?: boolean;
}

export interface ChartsToolbarPremiumProps extends ChartsToolbarProProps {
  /**
   * The options to apply on the Excel export of the chart's own data.
   */
  excelExportOptions?: ChartsToolbarPremiumExcelExportOptions;
  /**
   * Overrides how the chart's data is exported.
   * Defaults to `apiRef.current.exportAsExcel`, and is required for a chart that does not
   * register `useChartPremiumExport`, such as the one in the Data Grid integration.
   * @param {ChartExcelExportOptions} options The options to apply on the Excel export.
   * @returns {Promise<void>} A promise that resolves once the export is done.
   */
  onExcelExport?: (options?: ChartExcelExportOptions) => Promise<void>;
  /**
   * The options to apply on the Excel export of the Data Grid's data.
   * The entry is only shown when `onDataGridExcelExport` is provided, which the Data Grid
   * integration does.
   */
  dataGridExportOptions?: ChartsToolbarPremiumDataGridExportOptions;
  /**
   * Exports the data of the Data Grid the chart is bound to, rather than the chart's own data.
   * @returns {Promise<void>} A promise that resolves once the export is done.
   */
  onDataGridExcelExport?: () => Promise<void>;
}

/**
 * The chart toolbar component for the premium package.
 * It adds the Excel export entry to the Pro toolbar's export menu.
 */
function ChartsToolbarPremium({
  excelExportOptions,
  exportMenuItems,
  onExcelExport,
  dataGridExportOptions,
  onDataGridExcelExport,
  ...other
}: ChartsToolbarPremiumProps) {
  const { localeText } = useChartsLocalization();
  const apiRef = useChartPremiumApiContext<ChartPremiumApiWithExcelExport>();

  // `useChartPremiumExport` is opt-in. The provider assigns the public api during its own render,
  // so the method is already there when this child renders. Decided here rather than inside the
  // render prop, so the Pro toolbar does not open an export menu that would be empty.
  const showExcelExport =
    !excelExportOptions?.disableToolbarButton &&
    (onExcelExport != null || apiRef.current?.exportAsExcel != null);

  // The Data Grid's data is a separate entry: the chart's own export only covers what is plotted.
  const showDataGridExport =
    !dataGridExportOptions?.disableToolbarButton && onDataGridExcelExport != null;

  const renderExportMenuItems =
    showExcelExport || showDataGridExport || exportMenuItems
      ? (params: { onClose: () => void }) => (
          <React.Fragment>
            {exportMenuItems?.(params)}
            {showExcelExport && (
              <ChartsToolbarExcelExportMenuItem
                label={localeText.toolbarExportExcel}
                options={excelExportOptions}
                onExport={onExcelExport}
                onClose={params.onClose}
              />
            )}
            {showDataGridExport && (
              <ChartsToolbarExcelExportMenuItem
                label={localeText.toolbarExportDataGridExcel}
                onExport={onDataGridExcelExport}
                onClose={params.onClose}
              />
            )}
          </React.Fragment>
        )
      : undefined;

  return <ChartsToolbarPro {...other} exportMenuItems={renderExportMenuItems} />;
}

ChartsToolbarPremium.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The options to apply on the Excel export of the Data Grid's data.
   * The entry is only shown when `onDataGridExcelExport` is provided, which the Data Grid
   * integration does.
   */
  dataGridExportOptions: PropTypes.shape({
    disableToolbarButton: PropTypes.bool,
  }),
  /**
   * The options to apply on the Excel export of the chart's own data.
   */
  excelExportOptions: PropTypes.shape({
    disableToolbarButton: PropTypes.bool,
    escapeFormulas: PropTypes.bool,
    fileName: PropTypes.string,
    includeFormattedValues: PropTypes.bool,
    includeHeaders: PropTypes.bool,
    includeHiddenSeries: PropTypes.bool,
  }),
  /**
   * Extra items rendered at the end of the export menu.
   * @param {object} params The render params.
   * @param {Function} params.onClose Closes the export menu.
   * @returns {React.ReactNode} The menu items.
   */
  exportMenuItems: PropTypes.func,
  imageExportOptions: PropTypes.arrayOf(
    PropTypes.shape({
      copyStyles: PropTypes.bool,
      fileName: PropTypes.string,
      nonce: PropTypes.string,
      onBeforeExport: PropTypes.func,
      onStylesheetError: PropTypes.func,
      pixelRatio: PropTypes.number,
      quality: PropTypes.number,
      type: PropTypes.string.isRequired,
    }),
  ),
  /**
   * Exports the data of the Data Grid the chart is bound to, rather than the chart's own data.
   * @returns {Promise<void>} A promise that resolves once the export is done.
   */
  onDataGridExcelExport: PropTypes.func,
  /**
   * Overrides how the chart's data is exported.
   * Defaults to `apiRef.current.exportAsExcel`, and is required for a chart that does not
   * register `useChartPremiumExport`, such as the one in the Data Grid integration.
   * @param {ChartExcelExportOptions} options The options to apply on the Excel export.
   * @returns {Promise<void>} A promise that resolves once the export is done.
   */
  onExcelExport: PropTypes.func,
  printOptions: PropTypes.object,
  /**
   * Configuration for range buttons shown in the toolbar.
   * Each button zooms the chart to a predefined time range from the end of the data.
   */
  rangeButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.instanceOf(Date).isRequired),
        PropTypes.arrayOf(PropTypes.string.isRequired),
        PropTypes.func,
        PropTypes.shape({
          step: PropTypes.number,
          unit: PropTypes.oneOf([
            'day',
            'hour',
            'microsecond',
            'millisecond',
            'minute',
            'month',
            'second',
            'week',
            'year',
          ]).isRequired,
        }),
      ]),
    }),
  ),
  /**
   * The axis ID to apply range buttons to.
   * Defaults to the first x-axis with zoom enabled and a time scale.
   */
  rangeButtonsAxisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
} as any;

export { ChartsToolbarPremium };
