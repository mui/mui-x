import type {
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
  // Internal shared components: only `styleOverrides` is themeable, since their props
  // are controlled by the host product (for example the skeleton's `data-variant`).
  MuiEventSkeleton?: {
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiEventSkeleton'];
  };
  MuiEventErrorContainer?: {
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiEventErrorContainer'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends SchedulerComponents<Theme> {}
}
