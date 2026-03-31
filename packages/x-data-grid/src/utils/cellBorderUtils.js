import { PinnedColumnPosition } from '../internals/constants';
export const shouldCellShowRightBorder = (pinnedPosition, indexInSection, sectionLength, showCellVerticalBorderRootProp, gridHasFiller, pinnedColumnsSectionSeparatorRootProp) => {
    const isSectionLastCell = indexInSection === sectionLength - 1;
    if (pinnedColumnsSectionSeparatorRootProp?.startsWith('border') &&
        pinnedPosition === PinnedColumnPosition.LEFT &&
        isSectionLastCell) {
        return true;
    }
    if (showCellVerticalBorderRootProp) {
        if (pinnedPosition === PinnedColumnPosition.LEFT) {
            return true;
        }
        if (pinnedPosition === PinnedColumnPosition.RIGHT) {
            return !isSectionLastCell;
        }
        // pinnedPosition === undefined, middle section
        return !isSectionLastCell || gridHasFiller;
    }
    return false;
};
export const shouldCellShowLeftBorder = (pinnedPosition, indexInSection, showCellVerticalBorderRootProp, pinnedColumnsSectionSeparatorRootProp) => {
    if (pinnedColumnsSectionSeparatorRootProp?.startsWith('border')) {
        return pinnedPosition === PinnedColumnPosition.RIGHT && indexInSection === 0;
    }
    return (showCellVerticalBorderRootProp &&
        pinnedPosition === PinnedColumnPosition.RIGHT &&
        indexInSection === 0);
};
