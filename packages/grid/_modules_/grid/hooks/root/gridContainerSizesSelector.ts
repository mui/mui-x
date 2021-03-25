import { createSelector } from 'reselect';
import { GridContainerProps } from '../../models/gridContainerProps';
import { GridState } from '../features/core/gridState';

export const gridContainerSizesSelector = (state: GridState) => state.containerSizes;
export const gridViewportSizesSelector = (state: GridState) => state.viewportSizes;
export const gridScrollBarSizeSelector = (state: GridState) => state.scrollBar;

export const gridDataContainerHeightSelector = createSelector<
  GridState,
  GridContainerProps | null,
  number
>(gridContainerSizesSelector, (containerSizes) =>
  containerSizes == null ? 0 : containerSizes.dataContainerSizes.height,
);
