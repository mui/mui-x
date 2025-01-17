import { AllSeriesType } from '../../../../models/seriesType';
import { defaultizeColor } from '../../../defaultizeColor';
import { ChartSeriesType, DatasetType } from '../../../../models/seriesType/config';
import { ChartSeriesConfig } from '../../models/seriesConfig';
import {
  SeriesProcessorParams,
  SeriesProcessorResult,
} from '../../models/seriesConfig/seriesProcessor.types';

/**
 * This methods is the interface between what the developer is providing and what components receives
 * To simplify the components behaviors, it groups series by type, such that LinePlots props are not updated if some line data are modified
 * It also add defaultized values such as the ids, colors
 * @param series The array of series provided by the developer
 * @param colors The color palette used to defaultize series colors
 * @returns An object structuring all the series by type.
 */
export const preprocessSeries = <TSeriesType extends ChartSeriesType>({
  series,
  colors,
  seriesConfig,
  dataset,
}: {
  series: AllSeriesType<TSeriesType>[];
  colors: string[];
  seriesConfig: ChartSeriesConfig<TSeriesType>;
  dataset?: DatasetType;
}) => {
  // Group series by type
  const seriesGroups: { [type in ChartSeriesType]?: SeriesProcessorParams<type> } = {};
  // Notice the line about uses `ChartSeriesType` instead of TSeriesType.
  // That's probably because the series.type is not propagated from the generic but hardcoded in the config.

  series.forEach((seriesData, seriesIndex: number) => {
    const { id = `auto-generated-id-${seriesIndex}`, type } =
      seriesData as AllSeriesType<TSeriesType>;

    if (seriesGroups[type] === undefined) {
      seriesGroups[type] = { series: {}, seriesOrder: [] };
    }
    if (seriesGroups[type]?.series[id] !== undefined) {
      throw new Error(`MUI X: series' id "${id}" is not unique.`);
    }

    seriesGroups[type]!.series[id] = {
      id,
      ...defaultizeColor(seriesData, seriesIndex, colors),
    };
    seriesGroups[type]!.seriesOrder.push(id);
  });

  const processedSeries: { [type in TSeriesType]?: SeriesProcessorResult<TSeriesType> } = {};
  // Apply formatter on a type group
  (Object.keys(seriesConfig) as TSeriesType[]).forEach((type) => {
    const group = seriesGroups[type];
    if (group !== undefined) {
      processedSeries[type] =
        seriesConfig[type]?.seriesProcessor?.(group, dataset) ?? seriesGroups[type];
    }
  });

  return processedSeries;
};
