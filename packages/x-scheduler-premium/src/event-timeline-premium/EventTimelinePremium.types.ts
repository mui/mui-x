import { EventTimelinePremiumParameters } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium';
import { EventTimelineLocaleText } from '@mui/x-scheduler/models';
import { EventTimelinePremiumClasses } from './eventTimelinePremiumClasses';

export interface EventTimelinePremiumProps<TEvent extends object, TResource extends object>
  extends React.HTMLAttributes<HTMLDivElement>, EventTimelinePremiumParameters<TEvent, TResource> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<EventTimelinePremiumClasses>;
  /**
   * Set the locale text of the Event Timeline.
   * You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-scheduler/src/models/translations.ts)
   * in the GitHub repository.
   */
  localeText?: Partial<EventTimelineLocaleText>;
}
