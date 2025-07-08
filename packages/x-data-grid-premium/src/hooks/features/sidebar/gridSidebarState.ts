import { GridSidebarValue } from './gridSidebarInterfaces';

export interface GridSidebarState {
  open: boolean;
  sidebarId?: string;
  labelId?: string;
  openedValue?: GridSidebarValue;
}

export type GridSidebarInitialState = GridSidebarState;
