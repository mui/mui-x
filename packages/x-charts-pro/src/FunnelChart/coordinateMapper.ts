import { D3Scale, isOrdinalScale } from '@mui/x-charts/internals';
import { PositionGetter } from './curves/curve.types';

export const createPositionGetter: (
  scale: D3Scale,
  isCategoryDirection: boolean,
  gap: number,
) => PositionGetter =
  (scale, isCategoryDirection, gap) => (value, bandIndex, bandIdentifier, stackOffset, useBand) => {
    if (isOrdinalScale(scale)) {
      const position = scale(bandIdentifier)!;
      return useBand ? position + scale.bandwidth() : position;
    }
    if (isCategoryDirection) {
      return scale(value + (stackOffset || 0))! + bandIndex * gap;
    }
    return scale(value)!;
  };
