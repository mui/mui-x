import { ChartPluginSignature } from '../../models';

export interface UseChartIdParameters {
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id?: string;
}

export type UseChartIdDefaultizedParameters = UseChartIdParameters;

export interface UseChartIdState {
  id: {
    chartId: string;
    providedChartId: string | undefined;
  };
}

export type UseChartIdSignature = ChartPluginSignature<{
  params: UseChartIdParameters;
  defaultizedParams: UseChartIdDefaultizedParameters;
  state: UseChartIdState;
}>;
