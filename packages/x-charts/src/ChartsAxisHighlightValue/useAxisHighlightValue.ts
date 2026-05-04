import { getValueToPositionMapper } from '../hooks/getValueToPositionMapper';
import { useDrawingArea } from '../hooks';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartsHighlightXAxisValue,
  selectorChartsHighlightYAxisValue,
  selectorChartXAxis,
  selectorChartYAxis,
  type UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import type { ComputedAxis, AxisId } from '../models/axis';
import type { UseChartBrushSignature } from '../internals/plugins/featurePlugins/useChartBrush';
import type { ChartsAxisHighlightValuePosition } from './ChartsAxisHighlightValue';
import type { ChartsAxisHighlightValueItemProps } from './ChartsAxisHighlightValueItem';

function getAxisValueFormatter(
  axis: ComputedAxis,
  valueFormatter?: (value: number | Date | string) => string,
): (value: number | Date | string) => string {
  if (valueFormatter) {
    return valueFormatter;
  }

  if (axis.valueFormatter) {
    return (v: number | Date | string) =>
      axis.valueFormatter!(v as any, { location: 'tooltip', scale: axis.scale });
  }

  return (v: number | Date | string) => `${v}`;
}

export interface AxisHighlightValueItem extends ChartsAxisHighlightValueItemProps {
  key: string;
}

export interface UseAxisHighlightValueParams {
  axisDirection: 'x' | 'y';
  axisId?: AxisId;
  labelPosition?: ChartsAxisHighlightValuePosition;
  value?: number | Date | string | null;
  valueFormatter?: (value: number | Date | string) => string;
}

const EMPTY_ARRAY: AxisHighlightValueItem[] = [];

export function useAxisHighlightValue(
  params: UseAxisHighlightValueParams,
): AxisHighlightValueItem[] {
  const { axisDirection, axisId, labelPosition = 'end', value, valueFormatter } = params;

  const { top, left, width, height, right, bottom } = useDrawingArea();

  const store = useStore<[UseChartCartesianAxisSignature, UseChartBrushSignature]>();

  const highlightSelector =
    axisDirection === 'x' ? selectorChartsHighlightXAxisValue : selectorChartsHighlightYAxisValue;
  const axisSelector = axisDirection === 'x' ? selectorChartXAxis : selectorChartYAxis;

  const axisHighlightValues = store.use(highlightSelector);
  const axes = store.use(axisSelector);

  if (labelPosition === 'none') {
    return EMPTY_ARRAY;
  }

  type AxisHighlightItem = { axisId: AxisId; value: number | Date | string };
  let items: AxisHighlightItem[];

  if (value !== undefined && value !== null) {
    const targetAxisId = axisId ?? axes.axisIds[0];
    items = [{ axisId: targetAxisId, value }];
  } else {
    items = axisHighlightValues
      .filter(
        (item) => (axisId === undefined || item.axisId === axisId) && item.value !== undefined,
      )
      .map((item) => ({ axisId: item.axisId, value: item.value }));
  }

  const result: AxisHighlightValueItem[] = [];

  for (const { axisId: itemAxisId, value: itemValue } of items) {
    const axis = axes.axis[itemAxisId];
    if (!axis) {
      continue;
    }

    const scale = axis.scale;
    const position = getValueToPositionMapper(scale)(itemValue);

    if (!Number.isFinite(position)) {
      continue;
    }

    const format = getAxisValueFormatter(axis, valueFormatter);
    const formattedValue = format(itemValue);

    if (axisDirection === 'x') {
      if (labelPosition === 'start' || labelPosition === 'both') {
        result.push({
          key: `${itemAxisId}-${String(itemValue)}-start`,
          x: position,
          y: top,
          formattedValue,
          position: 'top',
          minCoord: left,
          maxCoord: left + width,
          space: top,
        });
      }
      if (labelPosition === 'end' || labelPosition === 'both') {
        result.push({
          key: `${itemAxisId}-${String(itemValue)}-end`,
          x: position,
          y: top + height,
          formattedValue,
          position: 'bottom',
          minCoord: left,
          maxCoord: left + width,
          space: bottom,
        });
      }
    } else {
      if (labelPosition === 'start' || labelPosition === 'both') {
        result.push({
          key: `${itemAxisId}-${String(itemValue)}-start`,
          x: left,
          y: position,
          formattedValue,
          position: 'left',
          minCoord: top,
          maxCoord: top + height,
          space: left,
        });
      }
      if (labelPosition === 'end' || labelPosition === 'both') {
        result.push({
          key: `${itemAxisId}-${String(itemValue)}-end`,
          x: left + width,
          y: position,
          formattedValue,
          position: 'right',
          minCoord: top,
          maxCoord: top + height,
          space: right,
        });
      }
    }
  }

  return result;
}
