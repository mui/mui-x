import type { VisibilityMap } from './useChartVisibilityManager.types';

export const buildIdentifier = (separator: string, ids: string | (string | number)[]) => {
  if (typeof ids === 'string') {
    return ids;
  }
  return ids.filter(Boolean).join(separator);
};

export const isIdentifierVisible = (
  visibilityMap: VisibilityMap,
  separator: string,
  identifier: string | (string | number)[],
) => {
  if (Array.isArray(identifier)) {
    identifier = buildIdentifier(separator, identifier);
  }

  return visibilityMap?.[identifier] === true;
};
