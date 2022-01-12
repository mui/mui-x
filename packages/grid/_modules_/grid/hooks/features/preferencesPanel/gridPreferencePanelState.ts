import { GridPreferencePanelsValue } from './gridPreferencePanelsValue';

export interface GridPreferencePanelState {
  open: boolean;
  openedPanelValue?: GridPreferencePanelsValue;
}

export interface GridPreferencePanelInitialState extends GridPreferencePanelState {}
