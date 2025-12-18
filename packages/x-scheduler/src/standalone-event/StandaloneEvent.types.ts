import { StandaloneEvent as HeadlessStandaloneEvent } from '@mui/x-scheduler-headless/standalone-event';

export interface StandaloneEventProps extends Omit<
  HeadlessStandaloneEvent.Props,
  'renderDragPreview'
> {}
