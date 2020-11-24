import { PreferencePanelsValue } from './preferencesPanelValue';

export interface PreferencePanelState {
  open: boolean;
  openedPanelValue?: PreferencePanelsValue;
}
