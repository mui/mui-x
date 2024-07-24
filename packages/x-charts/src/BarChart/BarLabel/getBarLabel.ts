import { SeriesId } from '../../models/seriesType/common';
import { BarLabelFunction } from './BarLabel.types';

export const getBarLabel = (options: {
  barLabel: 'value' | BarLabelFunction;
  value: number | null;
  dataIndex: number;
  seriesId: SeriesId;
  height: number;
  width: number;
}): string | null | undefined => {
  const { barLabel, value, dataIndex, seriesId, height, width } = options;

  if (barLabel === 'value') {
    // We don't want to show the label if the value is 0
    return value ? value?.toString() : null;
  }

  return barLabel({ seriesId, dataIndex, value }, { bar: { height, width } });
};
