export const getRadius = (
  edge: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left',
  {
    hasNegative,
    hasPositive,
    borderRadius,
    layout,
  }: {
    hasNegative: boolean;
    hasPositive: boolean;
    borderRadius?: number;
    layout?: 'vertical' | 'horizontal';
  },
) => {
  if (!borderRadius) {
    return 0;
  }

  const isVertical = layout === 'vertical';

  if (edge === 'top-left' && ((isVertical && hasPositive) || (!isVertical && hasNegative))) {
    return borderRadius;
  }

  if (edge === 'top-right' && ((isVertical && hasPositive) || (!isVertical && hasPositive))) {
    return borderRadius;
  }

  if (edge === 'bottom-right' && ((isVertical && hasNegative) || (!isVertical && hasPositive))) {
    return borderRadius;
  }

  if (edge === 'bottom-left' && ((isVertical && hasNegative) || (!isVertical && hasNegative))) {
    return borderRadius;
  }

  return 0;
};
