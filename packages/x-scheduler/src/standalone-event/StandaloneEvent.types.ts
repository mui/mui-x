import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import { StandaloneEvent as UnstyledStandaloneEvent } from '@mui/x-scheduler-internals/standalone-event';

export interface StandaloneEventProps extends Omit<
  UnstyledStandaloneEvent.Props,
  'renderDragPreview'
> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
