import { Store } from '@base-ui-components/utils/store';
import { warn } from '@base-ui-components/utils/warn';
import { selectors, State } from './store';
import {
  CalendarEvent,
  CalendarEventId,
  CalendarResourceId,
  CalendarSettings,
  CalendarView,
  SchedulerValidDate,
} from '../models';
import {
  EventCalendarContextValue,
  EventCalendarParameters,
  EventCalendarStore,
} from './useEventCalendar.types';
import { Adapter } from '../utils/adapter/types';

const DEFAULT_VIEWS: CalendarView[] = ['week', 'day', 'month', 'agenda'];
const DEFAULT_SETTINGS: CalendarSettings = { hideWeekends: false };
const EMPTY_ARRAY: any[] = [];
// TODO: Create a prop to allow users to customize the number of days in agenda view
export const AGENDA_VIEW_DAYS_AMOUNT = 12;

export class EventCalendarInstance {
  private store: EventCalendarStore;

  private parameters: EventCalendarParameters;

  private initialParameters: EventCalendarParameters;

  constructor(parameters: EventCalendarParameters, store: EventCalendarStore) {
    this.store = store;
    this.parameters = parameters;
    this.initialParameters = parameters;

    if (process.env.NODE_ENV !== 'production') {
      // Add listeners to assert the state validity (not applied in prod)
      this.store.subscribe((state) => {
        const views = selectors.views(state);
        const view = selectors.view(state);

        if (!views.includes(view)) {
          warn(
            [
              `Event Calendar: The current view "${view}" is not compatible with the available views: ${views.join(', ')}.`,
              'Please ensure that the current view is included in the views array.',
            ].join('\n'),
          );
        }

        return null;
      });
    }
  }

  public static createWithStore(parameters: EventCalendarParameters, adapter: Adapter) {
    const store = new Store<State>({
      adapter,
      events: parameters.events,
      resources: parameters.resources ?? EMPTY_ARRAY,
      visibleResources: new Map(),
      visibleDate:
        parameters.visibleDate ??
        parameters.defaultVisibleDate ??
        adapter.startOfDay(adapter.date()),
      view: parameters.view ?? parameters.defaultView ?? 'week',
      views: parameters.views ?? DEFAULT_VIEWS,
      areEventsDraggable: parameters.areEventsDraggable ?? false,
      areEventsResizable: parameters.areEventsResizable ?? false,
      ampm: parameters.ampm ?? true,
      settings: parameters.settings ?? DEFAULT_SETTINGS,
    });

    const instance = new EventCalendarInstance(parameters, store);

    const contextValue: EventCalendarContextValue = {
      store,
      instance,
    };

    function updater(newParameters: EventCalendarParameters, newAdapter: Adapter) {
      const partialState: Partial<State> = {
        adapter: newAdapter,
        events: newParameters.events,
        resources: newParameters.resources ?? EMPTY_ARRAY,
        views: newParameters.views ?? DEFAULT_VIEWS,
        areEventsDraggable: newParameters.areEventsDraggable ?? false,
        areEventsResizable: newParameters.areEventsResizable ?? false,
        ampm: newParameters.ampm ?? true,
      };
      if (newParameters.view !== undefined) {
        partialState.view = newParameters.view;
      }
      if (newParameters.visibleDate !== undefined) {
        partialState.visibleDate = newParameters.visibleDate;
      }

      instance.parameters = newParameters;
      store.apply(partialState);

      if (process.env.NODE_ENV !== 'production') {
        // Asserts the model validity (not applied in prod)
        const checkModel = ({
          controlledProp,
          defaultValueProp,
        }: {
          controlledProp: keyof EventCalendarParameters;
          defaultValueProp: keyof EventCalendarParameters;
        }) => {
          const defaultValue = newParameters[defaultValueProp];
          const isControlled = newParameters[controlledProp] !== undefined;
          const initialDefaultValue = instance.initialParameters[defaultValueProp];
          const initialIsControlled = instance.initialParameters[controlledProp] !== undefined;

          if (initialIsControlled !== isControlled) {
            warn(
              [
                `MUI X Scheduler: A component is changing the ${
                  initialIsControlled ? '' : 'un'
                }controlled ${controlledProp} state of Event Calendar to be ${initialIsControlled ? 'un' : ''}controlled.`,
                'Elements should not switch from uncontrolled to controlled (or vice versa).',
                `Decide between using a controlled or uncontrolled ${controlledProp} element for the lifetime of the component.`,
                "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
                'More info: https://fb.me/react-controlled-components',
              ].join('\n'),
            );
          }

          if (JSON.stringify(initialDefaultValue) !== JSON.stringify(defaultValue)) {
            warn(
              [
                `MUI X Scheduler: A component is changing the default ${controlledProp} state of an uncontrolled Event Calendar after being initialized. `,
                `To suppress this warning opt to use a controlled Event Calendar.`,
              ].join('\n'),
              'error',
            );
          }
        };

        checkModel({ controlledProp: 'view', defaultValueProp: 'defaultView' });
        checkModel({ controlledProp: 'visibleDate', defaultValueProp: 'defaultVisibleDate' });
      }
    }

    return { contextValue, updater };
  }

  private setVisibleDate = (visibleDate: SchedulerValidDate, event: React.UIEvent) => {
    const { visibleDate: visibleDateProp, onVisibleDateChange } = this.parameters;
    if (visibleDateProp === undefined) {
      this.store.set('visibleDate', visibleDate);
    }

    onVisibleDateChange?.(visibleDate, event);
  };

  private getNavigationDate(delta: number) {
    const { adapter, view, visibleDate: visibleDateProp } = this.store.state;
    switch (view) {
      case 'day':
        return adapter.addDays(visibleDateProp, delta);
      case 'week':
        return adapter.addWeeks(adapter.startOfWeek(visibleDateProp), delta);
      case 'month':
        return adapter.addMonths(adapter.startOfMonth(visibleDateProp), delta);
      case 'agenda':
        return adapter.addDays(visibleDateProp, AGENDA_VIEW_DAYS_AMOUNT * delta);
      default:
        return visibleDateProp;
    }
  }

  /**
   * Sets the view of the calendar.
   */
  public setView = (view: CalendarView, event: React.UIEvent | Event) => {
    const { view: viewProp, onViewChange } = this.parameters;
    const views = this.store.state.views;
    if (!views.includes(view)) {
      throw new Error(
        [
          `Event Calendar: The view "${view}" provided to the setView method is not compatible with the available views: ${views.join(', ')}.`,
          'Please ensure that the requested view is included in the views array.',
        ].join('\n'),
      );
    }

    if (viewProp === undefined) {
      this.store.set('view', view);
    }

    onViewChange?.(view, event);
  };

  /**
   * Updates an event in the calendar.
   */
  public updateEvent = (calendarEvent: CalendarEvent) => {
    const { onEventsChange } = this.parameters;
    const updatedEvents = this.store.state.events.map((ev) =>
      ev.id === calendarEvent.id ? calendarEvent : ev,
    );
    onEventsChange?.(updatedEvents);
  };

  /**
   * Deletes an event from the calendar.
   */
  public deleteEvent = (eventId: CalendarEventId) => {
    const { onEventsChange } = this.parameters;
    const updatedEvents = this.store.state.events.filter((ev) => ev.id !== eventId);
    onEventsChange?.(updatedEvents);
  };

  /**
   * Goes to today's date without changing the view.
   */
  public goToToday = (event: React.UIEvent) => {
    const { adapter } = this.store.state;
    this.setVisibleDate(adapter.startOfDay(adapter.date()), event);
  };

  /**
   * Goes to the previous visible date span based on the current view.
   */
  public goToPreviousVisibleDate = (event: React.UIEvent) => {
    this.setVisibleDate(this.getNavigationDate(-1), event);
  };

  /**
   * Goes to the next visible date span based on the current view.
   */
  public goToNextVisibleDate = (event: React.UIEvent) => {
    this.setVisibleDate(this.getNavigationDate(1), event);
  };

  /**
   * Goes to a specific day and set the view to 'day'.
   */
  switchToDay = (visibleDate: SchedulerValidDate, event: React.UIEvent) => {
    if (!this.store.state.views.includes('day')) {
      throw new Error(
        'The "day" view is disabled on your Event Calendar. Please ensure that "day" is included in the views prop before using the switchToDay method.',
      );
    }
    this.setVisibleDate(visibleDate, event);
    this.setView('day', event);
  };

  /**
   * Updates the visible resources.
   */
  public setVisibleResources = (visibleResources: Map<CalendarResourceId, boolean>) => {
    this.store.set('visibleResources', visibleResources);
  };

  /**
   * Updates some settings of the calendar.
   */
  public setSettings = (
    partialSettings: Partial<CalendarSettings>,
    _event: React.UIEvent | Event,
  ) => {
    this.store.set('settings', {
      ...this.store.state.settings,
      ...partialSettings,
    });
  };
}
