import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { ChartSeriesConfig } from '../../models';

export type RawSerializeIdentifierFunction = <T extends { type: ChartSeriesType }>(
  seriesConfig: ChartSeriesConfig<ChartSeriesType>,
  identifier: T,
) => string;

/**
 * Serializes a series item identifier into a unique string using the appropriate serializer
 * from the provided series configuration.
 *
 * @param {ChartSeriesConfig<ChartSeriesType>} seriesConfig - The configuration object for chart series.
 * @param {SeriesItemIdentifier<ChartSeriesType>} identifier - The series item identifier to serialize.
 * @returns {string} A unique string representation of the identifier.
 * @throws Will throw an error if no serializer is found for the given series type.
 */
export const serializeIdentifier: RawSerializeIdentifierFunction = (seriesConfig, identifier) => {
  const serializer = seriesConfig[identifier.type]?.identifierSerializer;
  if (!serializer) {
    throw new Error(
      `MUI X Charts: No identifier serializer found for series type "${identifier.type}".`,
    );
  }
  // @ts-expect-error TS is not able to infer the correct type here
  return serializer(identifier);
};
