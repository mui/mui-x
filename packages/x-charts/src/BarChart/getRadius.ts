type GetRadiusData = {
  hasNegative: boolean;
  hasPositive: boolean;
  borderRadius?: number;
  layout?: 'vertical' | 'horizontal';
};

type GetRadiusCorner = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

/**
 * Returns if the corner should have a radius or not based on the layout and the data.
 * @param {GetRadiusCorner} corner The corner to check.
 * @param {GetRadiusData} cornerData The data for the corner.
 * @returns {number} The radius for the corner.
 */
export const getRadius = (
  corner: GetRadiusCorner,
  { hasNegative, hasPositive, borderRadius, layout }: GetRadiusData,
): number => {
  if (!borderRadius) {
    return 0;
  }

  const isVertical = layout === 'vertical';

  if (corner === 'top-left' && ((isVertical && hasPositive) || (!isVertical && hasNegative))) {
    return borderRadius;
  }

  if (corner === 'top-right' && ((isVertical && hasPositive) || (!isVertical && hasPositive))) {
    return borderRadius;
  }

  if (corner === 'bottom-right' && ((isVertical && hasNegative) || (!isVertical && hasPositive))) {
    return borderRadius;
  }

  if (corner === 'bottom-left' && ((isVertical && hasNegative) || (!isVertical && hasNegative))) {
    return borderRadius;
  }

  return 0;
};
