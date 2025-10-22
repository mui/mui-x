import { SeriesId } from '../../models/seriesType/common';
import { BarLabelFunction } from './BarLabel.types';
import { RangeBarValueType } from '../../models/seriesType/rangeBar';
import { BarValueType } from '../../models/seriesType/bar';

export function getBarLabel<
  V extends BarValueType | RangeBarValueType | null = BarValueType | null,
>(options: {
  barLabel: 'value' | BarLabelFunction<V>;
  value: V;
  dataIndex: number;
  seriesId: SeriesId;
  height: number;
  width: number;
}): string | null | undefined {
  const { barLabel, value, dataIndex, seriesId, height, width } = options;

  if (barLabel === 'value') {
    // We don't want to show the label if the value is 0
    if (!value) {
      return null;
    }

    if (typeof value === 'object') {
      // For range bars, we show the range as "[start, end]"
      return `[${value.start}, ${value.end}]`;
    }

    return value.toString();
  }

  return barLabel({ seriesId, dataIndex, value }, { bar: { height, width } });
}
