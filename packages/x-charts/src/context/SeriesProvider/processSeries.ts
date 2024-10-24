import { AllSeriesType } from '../../models/seriesType';
import { defaultizeColor } from '../../internals/defaultizeColor';
import { ChartSeriesType, DatasetType } from '../../models/seriesType/config';
import { FormattedSeries } from './Series.types';
import { SeriesFormatterConfig, SeriesFormatterParams } from '../PluginProvider';

/**
 * This methods is the interface between what the developer is providing and what components receives
 * To simplify the components behaviors, it groups series by type, such that LinePlots props are not updated if some line data are modified
 * It also add defaultized values such as the ids, colors
 * @param series The array of series provided by the developer
 * @param colors The color palette used to defaultize series colors
 * @returns An object structuring all the series by type.
 */
export const preprocessSeries = <T extends ChartSeriesType>({
  series,
  colors,
  seriesFormatters,
  dataset,
}: {
  series: AllSeriesType<T>[];
  colors: string[];
  seriesFormatters: SeriesFormatterConfig<T>;
  dataset?: DatasetType;
}) => {
  // Group series by type
  const seriesGroups: { [type in ChartSeriesType]?: SeriesFormatterParams<type> } = {};
  series.forEach((seriesData, seriesIndex: number) => {
    const { id = `auto-generated-id-${seriesIndex}`, type } = seriesData;

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

  const formattedSeries: FormattedSeries = {};
  // Apply formatter on a type group
  (Object.keys(seriesFormatters) as T[]).forEach((type) => {
    const group = seriesGroups[type];
    if (group !== undefined) {
      formattedSeries[type] = seriesFormatters[type]?.(group, dataset) ?? seriesGroups[type];
    }
  });

  return formattedSeries;
};
