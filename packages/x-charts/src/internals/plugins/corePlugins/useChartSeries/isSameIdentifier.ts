import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { ChartSeriesConfig } from '../../models';

export const isSameIdentifier = <T extends ChartSeriesType, U extends { type: T }>(
  seriesConfig: ChartSeriesConfig<T>,
  a: U | undefined | null,
  b: U | undefined | null,
): boolean => {
  // Nullish values or different series types are never equal regardless of the series config
  if (!a || !b || a.type !== b.type) {
    return false;
  }

  // We already checked that a and b are the same type
  const seriesType = a.type;
  const identifierCompare = seriesConfig[seriesType].identifierCompare;
  // @ts-expect-error identifierSerializer expects the full object,
  // but this function accepts a partial one in order be able to serialize all identifiers.
  return identifierCompare(a, b);
};
