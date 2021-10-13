import { GridState } from '../../../models/gridState';

export const gridPreferencePanelStateSelector = (state: GridState) => state.preferencePanel;
export const gridViewportSizeStateSelector = (state: GridState) => state.viewportSizes;
