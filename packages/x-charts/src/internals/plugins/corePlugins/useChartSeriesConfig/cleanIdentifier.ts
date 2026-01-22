import type { SeriesItemIdentifier } from '../../../../models';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { ChartSeriesConfig } from '../../models';

/**
 * Cleans a series item identifier by extracting only the relevant properties
 * using the appropriate cleaner from the provided series configuration.
 *
 * @param {ChartSeriesConfig<ChartSeriesType>} seriesConfig - The configuration object for chart series.
 * @param {object} identifier - The series item identifier to clean.
 * @returns {object} A cleaned identifier object with only the properties relevant to the series type.
 * @throws Will throw an error if no cleaner is found for the given series type.
 */
export const cleanIdentifier = <T extends ChartSeriesType, U extends { type: T }>(
  seriesConfig: ChartSeriesConfig<T>,
  identifier: U,
): SeriesItemIdentifier<T> => {
  const cleaner = seriesConfig[identifier.type]?.identifierCleaner;
  if (!cleaner) {
    throw new Error(
      `MUI X Charts: No identifier cleaner found for series type "${identifier.type}".`,
    );
  }
  // @ts-expect-error identifierCleaner expects the full object,
  // but this function accepts a partial one in order to be able to clean all identifiers.
  return cleaner(identifier);
};
