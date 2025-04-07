import {
  UseChartSeriesSignature,
  ChartPluginSignature,
  UseChartCartesianAxisSignature,
} from '@mui/x-charts/internals';

export interface UseChartProExportParameters {}

export type UseChartProExportDefaultizedParameters = UseChartProExportParameters;

export interface UseChartProExportState {
  export: {};
}

/**
 * The options to apply on the Print export.
 * @demos
 *   - [Print export](/x/react-charts/export/#print-export-as-pdf)
 */
export interface ChartPrintExportOptions {
  /**
   * The value to be used as the print window title.
   * @default The title of the page.
   */
  fileName?: string;
}

export interface UseChartProExportPublicApi {
  /**
   * Opens the browser's print dialog, which can be used to print the chart or export it as PDF.
   * @param {ChartPrintExportOptions} options Options to customize the print export.
   * @returns {void}
   */
  print: (options?: ChartPrintExportOptions) => void;
}

export interface UseChartProExportInstance extends UseChartProExportPublicApi {}

export type UseChartProExportSignature = ChartPluginSignature<{
  params: UseChartProExportParameters;
  defaultizedParams: UseChartProExportDefaultizedParameters;
  state: UseChartProExportState;
  publicAPI: UseChartProExportPublicApi;
  instance: UseChartProExportInstance;
  dependencies: [UseChartSeriesSignature, UseChartCartesianAxisSignature];
}>;
