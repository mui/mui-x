import { PinnedPosition } from '../components/cell/GridCell';

export const rtlFlipSide = (
  position: PinnedPosition | undefined,
  isRtl: boolean,
): 'left' | 'right' | undefined => {
  if (!position) return;
  if (!isRtl) {
    if (position === PinnedPosition.LEFT) {
      return 'left';
    }
    if (position === PinnedPosition.RIGHT) {
      return 'right';
    }
  } else {
    if (position === PinnedPosition.LEFT) {
      return 'right';
    }
    if (position === PinnedPosition.RIGHT) {
      return 'left';
    }
  }
  return;
};
