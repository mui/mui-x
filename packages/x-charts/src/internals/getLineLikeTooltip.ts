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

  // `series.valueFormatter` is a union of formatter signatures with incompatible value
  // parameters across chart types. We just pass through whatever value `series.data[i]`
  // returned, so cast the formatter to one of the matching shapes.
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
    ...(options.includeMarkShape && {
      // showMark / shape only exist on line and radialLine series; consumers that pass
      // includeMarkShape: true must be one of those types.
      markShape: (series as TooltipGetterParams<'line'>['series']).showMark
        ? (series as TooltipGetterParams<'line'>['series']).shape
        : undefined,
    }),
  };

  return result as TooltipGetterResult<SeriesType>;
}
