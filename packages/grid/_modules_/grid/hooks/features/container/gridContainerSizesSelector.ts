/* eslint-disable @typescript-eslint/naming-convention */
import { GridState } from '../../../models/gridState';

export const unstable_gridContainerSizesSelector = (state: GridState) => state.containerSizes;

export const unstable_gridViewportSizesSelector = (state: GridState) => state.viewportSizes;

export const unstable_gridScrollBarSizeSelector = (state: GridState) => state.scrollBar;
