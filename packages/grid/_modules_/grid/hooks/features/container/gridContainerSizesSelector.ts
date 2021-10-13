import { createSelector } from 'reselect';
import { GridState } from '../../../models/gridState';

export const gridContainerSizesSelector = (state: GridState) => state.containerSizes;

export const gridViewportSizesSelector = (state: GridState) => state.viewportSizes;

export const gridScrollBarSizeSelector = (state: GridState) => state.scrollBar;

export const gridDataContainerSizesSelector = createSelector(
  gridContainerSizesSelector,
  (containerSizes) => (containerSizes == null ? null : containerSizes.dataContainerSizes),
);

export const gridDataContainerHeightSelector = createSelector(
  gridContainerSizesSelector,
  (containerSizes) => (containerSizes == null ? 0 : containerSizes.dataContainerSizes.height),
);
