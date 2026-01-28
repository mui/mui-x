import { type MakeOptional } from '@mui/x-internals/types';
import { type ChartPluginSignature } from '../../models';
import { type DatasetType } from '../../../../models/seriesType/config';
import { type AxisId } from '../../../../models/axis';
import { type ZAxisConfig, type ZAxisDefaultized } from '../../../../models/z-axis';

type DefaultizedZAxisConfig = {
  [axisId: string]: ZAxisDefaultized;
};

export interface UseChartZAxisParameters {
  /**
   * The configuration of the z-axes.
   */
  zAxis?: readonly MakeOptional<ZAxisConfig, 'id'>[];
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: Readonly<DatasetType>;
}

export type UseChartZAxisDefaultizedParameters = UseChartZAxisParameters;

export interface UseChartZAxisState {
  zAxis: {
    /**
     * Mapping from z-axis key to scaling configuration.
     */
    axis: DefaultizedZAxisConfig;
    /**
     * The z-axes IDs sorted by order they got provided.
     */
    axisIds: AxisId[];
  };
}

export type UseChartZAxisSignature = ChartPluginSignature<{
  params: UseChartZAxisParameters;
  defaultizedParams: UseChartZAxisDefaultizedParameters;
  state: UseChartZAxisState;
}>;
