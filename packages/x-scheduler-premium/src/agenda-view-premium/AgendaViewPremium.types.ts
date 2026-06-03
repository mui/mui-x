import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import { EventCalendarPremiumParameters } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import { EventCalendarSchedulerParametersOverrides } from '@mui/x-scheduler-internals/use-event-calendar';
import { AgendaViewProps } from '@mui/x-scheduler/agenda-view';

export interface StandaloneAgendaViewPremiumProps<TEvent extends object, TResource extends object>
  extends
    AgendaViewProps,
    Omit<
      EventCalendarPremiumParameters<TEvent, TResource>,
      keyof EventCalendarSchedulerParametersOverrides
    >,
    EventCalendarSchedulerParametersOverrides {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
