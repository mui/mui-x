import type { SxProps } from '@mui/system/styleFunctionSx';
import type { Theme } from '@mui/material/styles';
import type {
  EventCalendarParameters,
  EventCalendarSchedulerParametersOverrides,
} from '@mui/x-scheduler-internals/use-event-calendar';
import type { EventCalendarViewConfig } from '@mui/x-scheduler-internals/models';

export interface AgendaViewProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface StandaloneAgendaViewProps<TEvent extends object, TResource extends object>
  extends
    AgendaViewProps,
    Omit<
      EventCalendarParameters<TEvent, TResource>,
      'viewConfig' | keyof EventCalendarSchedulerParametersOverrides
    >,
    EventCalendarSchedulerParametersOverrides {
  /**
   * Configuration applied to the view, keyed by the view name.
   * The `agenda` view does not support any configuration keys yet.
   */
  viewConfig?: Omit<EventCalendarViewConfig, 'day' | 'week'>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
