import type { SeriesId, SeriesItemIdentifierWithType } from '../models';
import type { SeriesTypeWithDataIndex } from '../models/seriesType/config';

/**
 * Cleans an identifier by extracting only type, seriesId, and dataIndex properties.
 * This is the common cleaner for most series types (bar, line, pie, scatter, radar, etc.).
 *
 * The generic constraint ensures this can only be used for series types whose
 * identifier actually includes `dataIndex`. Series types with different identifier
 * properties (like heatmap's xIndex/yIndex) must provide their own cleaner.
 */
export const identifierCleanerSeriesIdDataIndex = <
  SeriesType extends SeriesTypeWithDataIndex,
>(identifier: {
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
