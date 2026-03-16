import type { SeriesId } from '../models';
import type { ChartSeriesType } from '../models/seriesType/config';

/**
 * Cleans an identifier by extracting only type, seriesId, and dataIndex properties.
 * This is the common cleaner for most series types (bar, line, pie, scatter, radar, etc.).
 *
 * The generic constraint ensures this can only be used for series types whose
 * identifier actually includes `dataIndex`. Series types with different identifier
 * properties (like heatmap's xIndex/yIndex) must provide their own cleaner.
 */
export const identifierCleanerSeriesIdDataIndex = <
  T extends { type: ChartSeriesType; seriesId: SeriesId; dataIndex?: number },
>(
  identifier: T,
): Pick<T, 'type' | 'seriesId' | 'dataIndex'> => {
  return {
    type: identifier.type,
    seriesId: identifier.seriesId,
    dataIndex: identifier.dataIndex,
  };
};
