import {
  EventCalendarParameters,
  EventCalendarStore,
} from '@mui/x-scheduler-headless/use-event-calendar';
import type { SchedulerPublicAPI } from '@mui/x-scheduler-headless/internals';
import { SchedulerTranslations } from '../models/translations';
import type { EventCalendarClasses } from './eventCalendarClasses';

export type EventCalendarApiRef<
  TEvent extends object = any,
  TResource extends object = any,
> = React.RefObject<Partial<SchedulerPublicAPI<EventCalendarStore<TEvent, TResource>>> | undefined>;

export interface EventCalendarProps<TEvent extends object, TResource extends object>
  extends React.HTMLAttributes<HTMLDivElement>, EventCalendarParameters<TEvent, TResource> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<EventCalendarClasses>;
  /**
   * Translation overrides for the component's texts.
   */
  translations?: Partial<SchedulerTranslations>;
  /**
   * The ref object that allows Event Calendar manipulation.
   * Can be instantiated with `useEventCalendarApiRef()`.
   */
  apiRef?: EventCalendarApiRef;
}
