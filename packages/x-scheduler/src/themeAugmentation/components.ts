import { ComponentsProps, ComponentsOverrides as MuiComponentsOverrides } from '@mui/material/styles';

export interface SchedulerComponents<Theme = unknown> {
  MuiEventCalendar?: {
    defaultProps?: ComponentsProps['MuiEventCalendar'];
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiEventCalendar'];
  };
  MuiEventDraggableDialog?: {
    defaultProps?: ComponentsProps['MuiEventDraggableDialog'];
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiEventDraggableDialog'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends SchedulerComponents<Theme> {}
}
