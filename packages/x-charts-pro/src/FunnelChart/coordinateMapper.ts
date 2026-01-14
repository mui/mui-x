import { type D3Scale, isOrdinalScale } from '@mui/x-charts/internals';
import { type PositionGetter } from './curves/curve.types';

export const createPositionGetter: (
  scale: D3Scale,
  isCategoryDirection: boolean,
  gap: number,
  ordinalScaleData: readonly any[] | undefined,
) => PositionGetter =
  (scale, isCategoryDirection, gap, ordinalScaleData) =>
  (value, bandIndex, stackOffset, useBand) => {
    if (isOrdinalScale(scale)) {
      const position = scale(ordinalScaleData?.[bandIndex])!;
      return useBand ? position + scale.bandwidth() : position;
    }
    if (isCategoryDirection) {
      return scale(value + (stackOffset || 0))! + bandIndex * gap;
    }
    return scale(value)!;
  };
