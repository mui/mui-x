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
  // SAFETY: bar/radialBar/line/radialLine/scatter series share every field accessed here
  // (label, data, valueFormatter, labelMarkType). showMark/shape are only read when
  // includeMarkShape=true (line/radialLine only).
  const typed = params as TooltipGetterParams<'line'>;
  const { series, getColor, identifier } = typed;

  if (!identifier || identifier.dataIndex === undefined) {
    return null as TooltipGetterResult<SeriesType>;
  }

  const label = getLabel(series.label, 'tooltip');
  const value = series.data[identifier.dataIndex];

  if (options.skipNullValues && value == null) {
    return null as TooltipGetterResult<SeriesType>;
  }

  const formattedValue = series.valueFormatter(value, { dataIndex: identifier.dataIndex });

  const result = {
    identifier,
    color: getColor(identifier.dataIndex),
    label,
    value,
    formattedValue,
    markType: series.labelMarkType,
    ...(options.includeMarkShape && {
      markShape: series.showMark ? series.shape : undefined,
    }),
  };

  return result as TooltipGetterResult<SeriesType>;
}
