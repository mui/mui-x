import {
  ComponentsProps,
  ComponentsOverrides as MuiComponentsOverrides,
} from '@mui/material/styles';

export interface SchedulerComponents<Theme = unknown> {
  MuiEventCalendar?: {
    defaultProps?: ComponentsProps['MuiEventCalendar'];
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiEventCalendar'];
  };
  MuiEventDialog?: {
    defaultProps?: ComponentsProps['MuiEventDialog'];
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiEventDialog'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends SchedulerComponents<Theme> {}
}
