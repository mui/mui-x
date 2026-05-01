import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import { StandaloneEvent as HeadlessStandaloneEvent } from '@mui/x-scheduler-headless/standalone-event';

export interface StandaloneEventProps extends Omit<
  HeadlessStandaloneEvent.Props,
  'renderDragPreview'
> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
