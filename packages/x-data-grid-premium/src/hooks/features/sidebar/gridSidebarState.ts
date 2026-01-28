import type { GridSidebarValue } from './gridSidebarInterfaces';

export interface GridSidebarState {
  open: boolean;
  sidebarId?: string;
  labelId?: string;
  value?: GridSidebarValue;
}

export type GridSidebarInitialState = GridSidebarState;
