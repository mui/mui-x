import { createSelector } from 'reselect';
import { ElementSize } from '../../models/elementSize';
import { GridContainerProps } from '../../models/gridContainerProps';
import { GridState } from '../features/core/gridState';

export const gridContainerSizesSelector = (state: GridState) => state.containerSizes;
export const gridViewportSizesSelector = (state: GridState) => state.viewportSizes;
export const gridScrollBarSizeSelector = (state: GridState) => state.scrollBar;

export const gridDataContainerSizesSelector = createSelector<
  GridState,
  GridContainerProps | null,
  ElementSize | null
>(gridContainerSizesSelector, (containerSizes) =>
  containerSizes == null ? null : containerSizes.dataContainerSizes,
);
export const gridDataContainerHeightSelector = createSelector<
  GridState,
  GridContainerProps | null,
  number
>(gridContainerSizesSelector, (containerSizes) =>
  containerSizes == null ? 0 : containerSizes.dataContainerSizes.height,
);
