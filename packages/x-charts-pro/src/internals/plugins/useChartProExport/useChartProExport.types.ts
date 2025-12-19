import { type ChartPluginSignature } from '@mui/x-charts/internals';

export interface UseChartProExportParameters {}

export type UseChartProExportDefaultizedParameters = UseChartProExportParameters;

export interface UseChartProExportState {
  export: {};
}

export interface ChartExportOptions {
  /**
   * The name of the file without the extension.
   * @default The title of the document the chart belongs to
   */
  fileName?: string;
  /**
   * Callback function that is called before the export is triggered.
   * It can be used to modify the iframe or perform any other actions before the export, such as updating styles,
   * removing elements, etc.
   * @param {HTMLIFrameElement} iframe containing the chart to be exported.
   * @returns {Promise<void> | void} A promise or void. If a promise is returned, the export will wait for it to resolve before proceeding.
   */
  onBeforeExport?: (iframe: HTMLIFrameElement) => Promise<void> | void;
  /**
   * If `true`, the styles of the page the chart belongs to will be copied to the export iframe.
   * Copying styles is useful to ensure that the exported chart looks the same as it does on the page.
   * @default true
   */
  copyStyles?: boolean;
  /**
   * A nonce to be used for Content Security Policy (CSP) compliance.
   * If provided, this nonce will be added to any style elements created during the export process.
   */
  nonce?: string;
}

/**
 * The options to apply on the Print export.
 * @demos
 *   - [Print export](https://mui.com/x/react-charts/export/#print-export-as-pdf)
 */
export interface ChartPrintExportOptions extends ChartExportOptions {}

/**
 * The options to apply on the image export.
 * @demos
 *   - [Image export](https://mui.com/x/react-charts/export/#export-as-image)
 */
export interface ChartImageExportOptions extends ChartExportOptions {
  /**
   * The format of the image to be exported.
   * Browsers are required to support 'image/png'. Some browsers also support 'image/jpeg' and 'image/webp'.
   * If the provided `type` is not supported by the browser, it will default to 'image/png'.
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
}>;
