import type { SeriesItemIdentifier } from '../models';
import type { ChartSeriesType } from '../models/seriesType/config';

/**
 * Cleans an identifier by extracting only type, seriesId, and dataIndex properties.
 * This is the common cleaner for most series types (bar, line, pie, scatter, radar, etc.).
 */
export const identifierCleanerSeriesIdDataIndex = <
  T extends ChartSeriesType = ChartSeriesType,
  S extends SeriesItemIdentifier<T> = SeriesItemIdentifier<T>,
  I extends S = S,
>(
  identifier: I,
): S => {
  if ('dataIndex' in identifier) {
    // @ts-expect-error dataIndex exists check above
    return {
      type: identifier.type,
      seriesId: identifier.seriesId,
      dataIndex: identifier.dataIndex,
    };
  }

  // @ts-expect-error dataIndex does not exist
  return {
    type: identifier.type,
    seriesId: identifier.seriesId,
  };
};
