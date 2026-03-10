import type { SeriesId, SeriesItemIdentifierWithType } from '../models';
import type { ChartSeriesType } from '../models/seriesType/config';

/**
 * Cleans an identifier by extracting only type, seriesId, and dataIndex properties.
 * This is the common cleaner for most series types (bar, line, pie, scatter, radar, etc.).
 */
export const identifierCleanerSeriesIdDataIndex = <SeriesType extends ChartSeriesType>(identifier: {
  type: SeriesType;
  seriesId: SeriesId;
  dataIndex?: number;
}): SeriesItemIdentifierWithType<SeriesType> => {
  // @ts-expect-error we need to trust the output type here, since SeriesType is generic
  return {
    type: identifier.type,
    seriesId: identifier.seriesId,
    dataIndex: identifier.dataIndex,
  };
};
