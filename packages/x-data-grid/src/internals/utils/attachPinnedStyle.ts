import { rtlFlipSide } from '../../utils/rtlFlipSide';
import { PinnedColumnPosition } from '../constants';

export function attachPinnedStyle(
  style: React.CSSProperties,
  isRtl: boolean,
  pinnedPosition: PinnedColumnPosition | undefined,
  pinnedOffset?: number,
) {
  const side = rtlFlipSide(pinnedPosition, isRtl);
  if (!side || pinnedOffset === undefined) {
    return style;
  }
  style[side] = pinnedOffset;
  return style;
}
