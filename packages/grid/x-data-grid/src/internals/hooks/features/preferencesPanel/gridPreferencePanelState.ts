import { GridPreferencePanelsValue } from './gridPreferencePanelsValue';

export interface GridPreferencePanelState {
  open: boolean;
  openedPanelValue?: GridPreferencePanelsValue;
}

export type GridPreferencePanelInitialState = GridPreferencePanelState;
