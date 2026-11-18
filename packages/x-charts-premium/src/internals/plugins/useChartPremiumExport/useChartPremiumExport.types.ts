import type * as Excel from '@mui/x-internal-exceljs-fork';
import type { ChartPluginSignature } from '@mui/x-charts/internals';

export interface UseChartPremiumExportParameters {}

export type UseChartPremiumExportDefaultizedParameters = UseChartPremiumExportParameters;

export interface UseChartPremiumExportState {}

/**
 * The options to apply on the Excel export.
 */
export interface ChartExcelExportOptions {
  /**
   * The name of the file without the extension.
   * @default The title of the document the chart belongs to
   */
  fileName?: string;
  /**
   * If `true`, series and items hidden through the legend are exported.
   * @default true
   */
  includeHiddenSeries?: boolean;
  /**
   * If `true`, a `formatted*` column is added next to each value, using the series `valueFormatter`.
   * @default false
   */
  includeFormattedValues?: boolean;
  /**
   * If `false`, the formulas in the cells will not be escaped.
   * It is not recommended to disable this option as it exposes the user to potential CSV injection attacks.
   * See https://owasp.org/www-community/attacks/CSV_Injection for more information.
   * @default true
   */
  escapeFormulas?: boolean;
  /**
   * If `true`, a header row is written on each sheet.
   * @default true
   */
  includeHeaders?: boolean;
}

export interface UseChartPremiumExportPublicApi {
  /**
   * Returns the chart data as an exceljs workbook, one sheet per column signature.
   * @param {ChartExcelExportOptions} options Options to customize the export.
   * @returns {Promise<Excel.Workbook | null>} The workbook, or `null` when the chart has no data to export.
   */
  getDataAsExcel: (options?: ChartExcelExportOptions) => Promise<Excel.Workbook | null>;
  /**
   * Downloads the chart data as an Excel file.
   * @param {ChartExcelExportOptions} options Options to customize the export.
   * @returns {Promise<void>} A promise that resolves once the download is triggered.
   */
  exportAsExcel: (options?: ChartExcelExportOptions) => Promise<void>;
}

export interface UseChartPremiumExportInstance extends UseChartPremiumExportPublicApi {}

export type UseChartPremiumExportSignature = ChartPluginSignature<{
  params: UseChartPremiumExportParameters;
  defaultizedParams: UseChartPremiumExportDefaultizedParameters;
  state: UseChartPremiumExportState;
  publicAPI: UseChartPremiumExportPublicApi;
  instance: UseChartPremiumExportInstance;
}>;
