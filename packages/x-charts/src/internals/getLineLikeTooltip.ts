import { getLabel } from './getLabel';
import type { ChartSeriesType } from '../models/seriesType/config';
import type {
  TooltipGetterParams,
  TooltipGetterResult,
} from './plugins/corePlugins/useChartSeriesConfig';

type LineLikeTooltipChartType = Extract<
  ChartSeriesType,
  'line' | 'radialLine' | 'bar' | 'radialBar' | 'scatter'
>;

export interface LineLikeTooltipOptions {
  skipNullValues?: boolean;
  includeMarkShape?: boolean;
}

export function getLineLikeTooltip<SeriesType extends LineLikeTooltipChartType>(
  params: TooltipGetterParams<SeriesType>,
  options: LineLikeTooltipOptions = {},
): TooltipGetterResult<SeriesType> {
  const { series, getColor, identifier } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null as TooltipGetterResult<SeriesType>;
  }

  const label = getLabel(series.label, 'tooltip');
  const value = series.data[identifier.dataIndex];

  if (options.skipNullValues && value == null) {
    return null as TooltipGetterResult<SeriesType>;
  }

  const formattedValue = (series as TooltipGetterParams<'line'>['series']).valueFormatter(
    value as number | null,
    { dataIndex: identifier.dataIndex },
  );

  const result = {
    identifier,
    color: getColor(identifier.dataIndex),
    label,
    value,
    formattedValue,
    markType: series.labelMarkType,
    ...(options.includeMarkShape &&
      'showMark' in series && {
        markShape: series.showMark ? series.shape : undefined,
      }),
  };

  return result as TooltipGetterResult<SeriesType>;
}
