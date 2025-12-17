import type { VisibilityIdentifier, VisibilityMap } from './useChartVisibilityManager.types';

export const VISIBILITY_SEPARATOR = '-';

export const buildIdentifier = (ids: (VisibilityIdentifier | undefined)[]): string => {
  if (ids.length === 1 && (typeof ids[0] === 'string' || typeof ids[0] === 'number')) {
    return String(ids[0]);
  }

  return ids.filter((v) => v !== undefined && v !== null).join(VISIBILITY_SEPARATOR);
};

export const isIdentifierVisible = (
  visibilityMap: VisibilityMap | undefined,
  identifiers: (VisibilityIdentifier | undefined)[],
) => {
  const id = buildIdentifier(identifiers);

  const state = visibilityMap?.[id];

  return state !== false;
};
