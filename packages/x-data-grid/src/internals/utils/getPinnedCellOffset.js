import { PinnedColumnPosition } from '../constants';
export const getPinnedCellOffset = (pinnedPosition, computedWidth, columnIndex, columnPositions, columnsTotalWidth, scrollbarWidth) => {
    let pinnedOffset;
    switch (pinnedPosition) {
        case PinnedColumnPosition.LEFT:
            pinnedOffset = columnPositions[columnIndex];
            break;
        case PinnedColumnPosition.RIGHT:
            pinnedOffset =
                columnsTotalWidth - columnPositions[columnIndex] - computedWidth + scrollbarWidth;
            break;
        default:
            pinnedOffset = undefined;
            break;
    }
    // XXX: fix this properly
    if (Number.isNaN(pinnedOffset)) {
        pinnedOffset = undefined;
    }
    return pinnedOffset;
};
