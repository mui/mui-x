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

export interface UseChartProExportPublicApi {
  /**
   * Opens the browser's print dialog, which can be used to print the chart or export it as PDF.
   * @returns {void}
   */
  print: () => void;
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
