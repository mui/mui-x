import type { VisibilityMap } from './useChartVisibilityManager.types';

export const VISIBILITY_SEPARATOR = '-';

export const buildIdentifier = (ids: string | (string | number)[]) => {
  if (typeof ids === 'string') {
    return ids;
  }
  return ids.filter(Boolean).join(VISIBILITY_SEPARATOR);
};

export const isIdentifierVisible = (
  visibilityMap: VisibilityMap,
  identifier: string | (string | number)[],
) => {
  if (Array.isArray(identifier)) {
    identifier = buildIdentifier(identifier);
  }

  const state = visibilityMap?.[identifier];

  return state !== false;
};
