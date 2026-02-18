import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import { EventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';

export interface AgendaViewProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface StandaloneAgendaViewProps<TEvent extends object, TResource extends object>
  extends AgendaViewProps, EventCalendarParameters<TEvent, TResource> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
