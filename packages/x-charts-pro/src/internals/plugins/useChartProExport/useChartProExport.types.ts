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

/**
 * The options to apply on the image export.
 * @demos
 *   - [Image export](/x/react-charts/export/#export-as-image)
 */
export interface ChartImageExportOptions {
  /**
   * The value to be used as the print window title.
   * @default The title of the page.
   */
  fileName?: string;

  /**
   * The format of the image to be exported.
   * Browsers are required to support 'image/png'. Some browsers also support 'image/jpeg' and 'image/webp'.
   * @default 'image/png'
   */
  type?: 'image/png' | string;

  /**
   * The quality of the image to be exported between 0 and 1. This is only applicable for lossy formats, such as
   * 'image/jpeg' and 'image/webp'. 'image/png' does not support this option.
   * @default 0.9
   */
  quality?: number;
}

export interface UseChartProExportPublicApi {
  /**
   * Opens the browser's print dialog, which can be used to print the chart or export it as PDF.
   * @param {ChartPrintExportOptions} options Options to customize the print export.
   * @returns {void}
   */
  exportAsPrint: (options?: ChartPrintExportOptions) => void;
  /**
   * Exports the chart as an image.
   * If the provided `type` is not supported by the browser, it will default to `image/png`.
   *
   * @param {ChartPrintExportOptions} options Options to customize the print export.
   * @returns {void}
   */
  exportAsImage: (options?: ChartImageExportOptions) => void;
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
