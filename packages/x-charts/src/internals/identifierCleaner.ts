import type { SeriesId, SeriesItemIdentifier } from '../models';
import type { ChartSeriesType } from '../models/seriesType/config';

/**
 * Cleans an identifier by extracting only type, seriesId, and dataIndex properties.
 * This is the common cleaner for most series types (bar, line, pie, scatter, radar, etc.).
 */
export const identifierCleanerSeriesIdDataIndex = <T extends ChartSeriesType>(identifier: {
  type: T;
  seriesId: SeriesId;
  dataIndex?: number;
}): SeriesItemIdentifier<T> => {
  // @ts-expect-error we need to trust the output type here, since T is generic
  return {
    type: identifier.type,
    seriesId: identifier.seriesId,
    dataIndex: identifier.dataIndex,
  };
};
