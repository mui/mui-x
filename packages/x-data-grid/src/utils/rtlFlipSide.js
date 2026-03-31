import { PinnedColumnPosition } from '../internals/constants';
export const rtlFlipSide = (position, isRtl) => {
    if (!position) {
        return undefined;
    }
    if (!isRtl) {
        if (position === PinnedColumnPosition.LEFT) {
            return 'left';
        }
        if (position === PinnedColumnPosition.RIGHT) {
            return 'right';
        }
    }
    else {
        if (position === PinnedColumnPosition.LEFT) {
            return 'right';
        }
        if (position === PinnedColumnPosition.RIGHT) {
            return 'left';
        }
    }
    return undefined;
};
