import {
  ComponentsProps,
  ComponentsOverrides as MuiComponentsOverrides,
} from '@mui/material/styles';

export interface SchedulerPremiumComponents<Theme = unknown> {
  MuiEventTimeline?: {
    defaultProps?: ComponentsProps['MuiEventTimeline'];
    styleOverrides?: MuiComponentsOverrides<Theme>['MuiEventTimeline'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends SchedulerPremiumComponents<Theme> {}
}
