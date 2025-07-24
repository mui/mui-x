import { SchedulerValidDate } from '../../primitives/models';
import { CalendarEvent, CalendarEventId } from '../models/events';
import { CalendarResource, CalendarResourceId } from '../models/resource';
import { SchedulerTranslations } from '../models/translations';

export interface EventCalendarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UseEventCalendarParameters {
  /**
   * Translation overrides for the component's texts.
   */
  translations?: Partial<SchedulerTranslations>;
}

export interface UseEventCalendarParameters {
  /**
   * The events to render in the calendar.
   */
  events: CalendarEvent[];
  /**
   * Callback fired when some event of the calendar change.
   */
  onEventsChange?: (value: CalendarEvent[]) => void;
  /**
   * The resources that can be assigned to events.
   */
  resources?: CalendarResource[];
  /**
   * The view currently displayed in the calendar.
   */
  view?: EventCalendarView;
  /**
   * The view initially displayed in the calendar.
   * To render a controlled calendar, use the `view` prop.
   * @default "week"
   */
  defaultView?: EventCalendarView;
  /**
   * Event handler called when the view changes.
   */
  onViewChange?: (view: EventCalendarView, event: React.UIEvent | Event) => void;
  /**
   * The date currently displayed in the calendar.
   */
  visibleDate?: SchedulerValidDate;
  /**
   * The date initially displayed in the calendar.
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
   * Whether the event start or end can be dragged to change its duration without changing this other date.
   * @default false
   */
  areEventsResizable?: boolean;
}

export interface EventCalendarInstance {
  /**
   * Sets the view of the calendar.
   */
  setView: (view: EventCalendarView, event: React.UIEvent | Event) => void;
  /**
   * Updates an event in the calendar.
   */
  updateEvent: (calendarEvent: CalendarEvent) => void;
  /**
   * Deletes an event from the calendar.
   */
  deleteEvent: (eventId: CalendarEventId) => void;
  /**
   * Goes to today's date without changing the view.
   */
  goToToday: (event: React.UIEvent) => void;
  /**
   * Goes to the previous visible date span based on the current view.
   */
  goToPreviousVisibleDate: (event: React.UIEvent) => void;
  /**
   * Goes to the next visible date span based on the current view.
   */
  goToNextVisibleDate: (event: React.UIEvent) => void;
  /**
   * Goes to a specific day and set the view to 'day'.
   */
  switchToDay: (day: SchedulerValidDate, event: React.UIEvent) => void;
  /**
   * Updates the visible resources.
   */
  setVisibleResources: (visibleResources: Map<CalendarResourceId, boolean>) => void;
}

export type EventCalendarView = 'week' | 'day' | 'month' | 'agenda';
