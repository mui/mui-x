import { GridState } from '../core/gridState';

export const preferencePanelStateSelector = (state: GridState) => state.preferencePanel;
export const viewportSizeStateSelector = (state: GridState) => state.viewportSizes;
