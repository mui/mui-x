import type { SxProps } from '@mui/system/styleFunctionSx';
import type { Theme } from '@mui/material/styles';
import type {
  EventCalendarParameters,
  EventCalendarSchedulerParametersOverrides,
  CollapsibleResourcesParameterKeys,
} from '@mui/x-scheduler-internals/use-event-calendar';
import type { EventCalendarViewConfig } from '@mui/x-scheduler-internals/models';
import type { EventCalendarLocaleText } from '../models/translations';

export interface AgendaViewProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface StandaloneAgendaViewProps<TEvent extends object, TResource extends object>
  extends
    AgendaViewProps,
    Omit<
      EventCalendarParameters<TEvent, TResource>,
      | 'viewConfig'
      | keyof EventCalendarSchedulerParametersOverrides
      | CollapsibleResourcesParameterKeys
    >,
    EventCalendarSchedulerParametersOverrides {
  /**
   * Configuration applied to the view, keyed by the view name.
   * The `agenda` view does not support any configuration keys yet.
   */
  viewConfig?: Omit<EventCalendarViewConfig, 'day' | 'week'>;
  /**
   * Set the locale text of the view.
   * You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-scheduler/src/models/translations.ts)
   * in the GitHub repository.
   */
  localeText?: Partial<EventCalendarLocaleText>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
