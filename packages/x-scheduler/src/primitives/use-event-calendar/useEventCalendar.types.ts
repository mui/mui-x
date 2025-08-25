import { Store } from '@base-ui-components/utils/store';
import { State } from './store';
import {
  CalendarEvent,
  CalendarResource,
  CalendarSettings,
  CalendarView,
  SchedulerValidDate,
} from '../models';
import type { EventCalendarInstance } from './EventCalendarInstance';

export type EventCalendarStore = Store<State>;

export interface EventCalendarParameters {
  /**
   * The events currently available in the calendar.
   */
  events: CalendarEvent[];
  /**
   * Callback fired when some event of the calendar change.
   */
  onEventsChange?: (value: CalendarEvent[]) => void;
  /**
   * The resources the events can be assigned to.
   */
  resources?: CalendarResource[];
  /**
   * The view currently displayed in the calendar.
   */
  view?: CalendarView;
  /**
   * The view initially displayed in the calendar.
   * To render a controlled calendar, use the `view` prop.
   * @default "week"
   */
  defaultView?: CalendarView;
  /**
   * The views available in the calendar.
   * @default ["week", "day", "month", "agenda"]
   */
  views?: CalendarView[];
  /**
   * Event handler called when the view changes.
   */
  onViewChange?: (view: CalendarView, event: React.UIEvent | Event) => void;
  /**
   * The date currently used to determine the visible date range in each view.
   */
  visibleDate?: SchedulerValidDate;
  /**
   * The date initially used to determine the visible date range in each view.
   * To render a controlled calendar, use the `visibleDate` prop.
   * @default today
   */
  defaultVisibleDate?: SchedulerValidDate;
  /**
   * Event handler called when the visible date changes.
   */
  onVisibleDateChange?: (visibleDate: SchedulerValidDate, event: React.UIEvent) => void;
  /**
   * Whether the event can be dragged to change its start and end dates without changing the duration.
   * @default false
   */
  areEventsDraggable?: boolean;
  /**
   * Whether the event start or end can be dragged to change its duration without changing its other date.
   * @default false
   */
  areEventsResizable?: boolean;
  /**
   * Whether the component should display the time in 12-hour format with AM/PM meridiem.
   * @default true
   */
  ampm?: boolean;
  /**
   * Settings for the calendar.
   * @default { hideWeekends: false }
   */
  settings?: CalendarSettings;
}

export interface EventCalendarContextValue {
  /**
   * The store that holds the state of the calendar.
   */
  store: Store<State>;
  /**
   * The instance methods to interact with the calendar.
   */
  instance: EventCalendarInstance;
}
