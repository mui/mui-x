import { SeriesId, SeriesValueFormatter } from '../../models/seriesType/common';
import { BarLabelFunction } from './types';

export const getBarLabel = (options: {
  barLabel: 'value' | 'formattedValue' | BarLabelFunction | undefined | null;
  value: number | null;
  valueFormatter: SeriesValueFormatter<number | null>;
  dataIndex: number;
  seriesId: SeriesId;
  height: number;
  width: number;
}): string | null => {
  if (!options.barLabel) {
    return null;
  }

  const { barLabel, value, valueFormatter, dataIndex, seriesId, height, width } = options;

  if (barLabel === 'value') {
    // We don't want to show the label if the value is 0
    return value ? value?.toString() : null;
  }

  if (barLabel === 'formattedValue') {
    return valueFormatter(value, { dataIndex });
  }

  return barLabel({ seriesId, dataIndex, value }, { bar: { height, width } });
};
