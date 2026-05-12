import { getLabel } from './getLabel';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { TooltipGetter } from './plugins/corePlugins/useChartSeriesConfig';

export interface CreateTooltipGetterOptions {
  /**
   * If `true`, returns `null` when the data value is `null` (used by bar/radialBar).
   * @default false
   */
  skipNullValues?: boolean;
  /**
   * If `true`, includes a `markShape` field derived from `series.showMark` and `series.shape`
   * (used by line/radialLine).
   * @default false
   */
  includeMarkShape?: boolean;
}

/**
 * Shared tooltip getter factory for charts whose tooltip body extracts a single value
 * from `series.data[identifier.dataIndex]`.
 *
 * - `line` / `radialLine`: `{ includeMarkShape: true }`
 * - `bar` / `radialBar`: `{ skipNullValues: true }`
 */
export function createTooltipGetter<T extends ChartSeriesType>(
  options: CreateTooltipGetterOptions = {},
): TooltipGetter<T> {
  const { skipNullValues = false, includeMarkShape = false } = options;

  return ((params: any) => {
    const { series, getColor, identifier } = params;

    if (!identifier || identifier.dataIndex === undefined) {
      return null;
    }

    const label = getLabel(series.label, 'tooltip');
    const value = series.data[identifier.dataIndex];

    if (skipNullValues && value == null) {
      return null;
    }

    const formattedValue = series.valueFormatter(value, { dataIndex: identifier.dataIndex });

    return {
      identifier,
      color: getColor(identifier.dataIndex),
      label,
      value,
      formattedValue,
      markType: series.labelMarkType,
      ...(includeMarkShape && {
        markShape: series.showMark ? series.shape : undefined,
      }),
    };
  }) as TooltipGetter<T>;
}
