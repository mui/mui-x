import type { SeriesId } from '@mui/x-charts/models';
import type { RangeBarSeriesType, RangeBarValueType } from '../../models';

export function getRangeBarLabel(options: {
  barLabel: NonNullable<RangeBarSeriesType['barLabel']>;
  value: RangeBarValueType | null;
  /**
   * The index of the data point in the series.
   */
  dataIndex: number;
  /**
   * The id of the series the element belongs to.
   */
  seriesId: SeriesId;
  height: number;
  width: number;
}): string | null | undefined {
  const { barLabel, value, dataIndex, seriesId, height, width } = options;

  if (barLabel === 'value') {
    return value ? `${value[0]} – ${value[1]}` : null;
  }

  return barLabel({ seriesId, dataIndex, value }, { bar: { height, width } });
}
