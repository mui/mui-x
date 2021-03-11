import { GridState } from '../features/core/gridState';

export const gridContainerSizesSelector = (state: GridState) => state.containerSizes;
export const gridViewportSizesSelector = (state: GridState) => state.viewportSizes;
export const gridScrollBarSizeSelector = (state: GridState) => state.scrollBar;
