import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import {
  EventTimelinePremiumParameters,
  EventTimelinePremiumStore,
} from '@mui/x-scheduler-headless-premium/use-event-timeline-premium';
import type { SchedulerPublicAPI } from '@mui/x-scheduler-headless/internals';
import { EventTimelineLocaleText } from '@mui/x-scheduler/models';
import { EventTimelinePremiumClasses } from './eventTimelinePremiumClasses';

export type EventTimelinePremiumApiRef<
  TEvent extends object = any,
  TResource extends object = any,
> = React.RefObject<
  Partial<SchedulerPublicAPI<EventTimelinePremiumStore<TEvent, TResource>>> | undefined
>;

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
  /**
   * The ref object that allows Event Timeline manipulation.
   * Can be instantiated with `useEventTimelinePremiumApiRef()`.
   */
  apiRef?: EventTimelinePremiumApiRef;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
