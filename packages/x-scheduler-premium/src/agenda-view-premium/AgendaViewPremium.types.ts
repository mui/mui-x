import type { SxProps } from '@mui/system/styleFunctionSx';
import type { Theme } from '@mui/material/styles';
import type { EventCalendarPremiumParameters } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import type {
  EventCalendarSchedulerParametersOverrides,
  CollapsibleResourcesParameterKeys,
} from '@mui/x-scheduler-internals/use-event-calendar';
import type { AgendaViewProps } from '@mui/x-scheduler/agenda-view';

export interface StandaloneAgendaViewPremiumProps<TEvent extends object, TResource extends object>
  extends
    AgendaViewProps,
    Omit<
      EventCalendarPremiumParameters<TEvent, TResource>,
      keyof EventCalendarSchedulerParametersOverrides | CollapsibleResourcesParameterKeys
    >,
    EventCalendarSchedulerParametersOverrides {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
