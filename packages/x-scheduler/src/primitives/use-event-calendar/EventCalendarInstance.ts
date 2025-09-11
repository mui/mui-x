import { Store } from '@base-ui-components/utils/store';
import { warn } from '@base-ui-components/utils/warn';
import { selectors, State } from './store';
import {
  CalendarEvent,
  CalendarEventId,
  CalendarResourceId,
  CalendarPreferences,
  CalendarView,
  CalendarViewConfig,
  SchedulerValidDate,
  CalendarPreferencesMenuConfig,
  CalendarEventColor,
} from '../models';
import {
  EventCalendarParameters,
  EventCalendarStore,
  UpdateRecurringEventParameters,
} from './useEventCalendar.types';
import { Adapter } from '../utils/adapter/types';
import { applyRecurringUpdateFollowing } from '../utils/recurrence-utils';

export const DEFAULT_VIEWS: CalendarView[] = ['week', 'day', 'month', 'agenda'];
export const DEFAULT_VIEW: CalendarView = 'week';
export const DEFAULT_PREFERENCES: CalendarPreferences = {
  showWeekends: true,
  showWeekNumber: false,
};
export const DEFAULT_PREFERENCES_MENU_CONFIG: CalendarPreferencesMenuConfig = {
  toggleWeekendVisibility: true,
  toggleWeekNumberVisibility: true,
};
const EMPTY_ARRAY: any[] = [];
export const DEFAULT_EVENT_COLOR: CalendarEventColor = 'jade';

export class EventCalendarInstance {
  private store: EventCalendarStore;

  private parameters: EventCalendarParameters;

  private initialParameters: EventCalendarParameters | null = null;

  private constructor(parameters: EventCalendarParameters, store: EventCalendarStore) {
    this.store = store;
    this.parameters = parameters;

    if (process.env.NODE_ENV !== 'production') {
      this.initialParameters = parameters;
      // Add listeners to assert the state validity (not applied in prod)
      this.store.subscribe((state) => {
        this.assertViewValidity(state.view);
        return null;
      });
    }
  }

  /**
   * Returns the properties of the state that are derived from the parameters.
   * This do not contain state properties that don't update whenever the parameters update.
   */
  private static getPartialStateFromParameters(
    parameters: EventCalendarParameters,
    adapter: Adapter,
  ): Pick<
    State,
    | 'adapter'
    | 'events'
    | 'resources'
    | 'views'
    | 'areEventsDraggable'
    | 'areEventsResizable'
    | 'ampm'
    | 'eventColor'
    | 'showCurrentTimeIndicator'
  > {
    return {
      adapter,
      events: parameters.events,
      resources: parameters.resources ?? EMPTY_ARRAY,
      views: parameters.views ?? DEFAULT_VIEWS,
      areEventsDraggable: parameters.areEventsDraggable ?? false,
      areEventsResizable: parameters.areEventsResizable ?? false,
      ampm: parameters.ampm ?? true,
      eventColor: parameters.eventColor ?? DEFAULT_EVENT_COLOR,
      showCurrentTimeIndicator: parameters.showCurrentTimeIndicator ?? true,
    };
  }

  public static create(parameters: EventCalendarParameters, adapter: Adapter) {
    const store = new Store<State>({
      // Store elements that should not be updated when the parameters change.
      visibleResources: new Map(),
      preferences: { ...DEFAULT_PREFERENCES, ...parameters.preferences },
      preferencesMenuConfig:
        parameters.preferencesMenuConfig === false
          ? parameters.preferencesMenuConfig
          : {
              ...DEFAULT_PREFERENCES_MENU_CONFIG,
              ...parameters.preferencesMenuConfig,
            },
      viewConfig: null,
      // Store elements that should only be updated when their controlled prop changes.
      visibleDate:
        parameters.visibleDate ??
        parameters.defaultVisibleDate ??
        adapter.startOfDay(adapter.date()),
      view: parameters.view ?? parameters.defaultView ?? DEFAULT_VIEW,
      // Store elements that should be synchronized when the parameters change.
      ...EventCalendarInstance.getPartialStateFromParameters(parameters, adapter),
    });

    const instance = new EventCalendarInstance(parameters, store);

    function updater(newParameters: EventCalendarParameters, newAdapter: Adapter) {
      const partialState: Partial<State> = EventCalendarInstance.getPartialStateFromParameters(
        newParameters,
        newAdapter,
      );

      function updateModel(
        controlledProp: 'view' | 'visibleDate',
        defaultValueProp: 'defaultView' | 'defaultVisibleDate',
      ) {
        if (newParameters[controlledProp] !== undefined) {
          partialState[controlledProp] = newParameters[controlledProp] as any;
        }

        if (process.env.NODE_ENV !== 'production') {
          const defaultValue = newParameters[defaultValueProp];
          const isControlled = newParameters[controlledProp] !== undefined;
          const initialDefaultValue = instance.initialParameters?.[defaultValueProp];
          const initialIsControlled = instance.initialParameters?.[controlledProp] !== undefined;

          if (initialIsControlled !== isControlled) {
            warn(
              [
                `Event Calendar: A component is changing the ${
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
                `Event Calendar: A component is changing the default ${controlledProp} state of an uncontrolled Event Calendar after being initialized. `,
                `To suppress this warning opt to use a controlled Event Calendar.`,
              ].join('\n'),
              'error',
            );
          }
        }
      }

      updateModel('view', 'defaultView');
      updateModel('visibleDate', 'defaultVisibleDate');
      store.apply(partialState);
    }

    return { store, instance, updater, contextValue: { store, instance } };
  }

  private assertViewValidity(view: CalendarView) {
    const views = this.store.state.views;
    if (!views.includes(view)) {
      throw new Error(
        [
          `Event Calendar: The component tried to switch to the "${view}" view but it is not compatible with the available views: ${views.join(', ')}.`,
          'Please ensure that the requested view is included in the views array.',
        ].join('\n'),
      );
    }
  }

  private setVisibleDate = (visibleDate: SchedulerValidDate, event: React.UIEvent) => {
    const { visibleDate: visibleDateProp, onVisibleDateChange } = this.parameters;
    const { adapter } = this.store.state;
    const hasChange = !adapter.isEqual(this.store.state.visibleDate, visibleDate);

    if (hasChange) {
      if (visibleDateProp === undefined) {
        this.store.set('visibleDate', visibleDate);
      }
      onVisibleDateChange?.(visibleDate, event);
    }
  };

  private setVisibleDateAndView = (
    visibleDate: SchedulerValidDate,
    view: CalendarView,
    event: React.UIEvent,
  ) => {
    const {
      visibleDate: visibleDateProp,
      view: viewProp,
      onVisibleDateChange,
      onViewChange,
    } = this.parameters;

    const hasVisibleDateChange = visibleDate !== this.store.state.visibleDate;
    const hasViewChange = view !== this.store.state.view;
    if (!hasVisibleDateChange && !hasViewChange) {
      return;
    }

    this.assertViewValidity(view);

    const canSetVisibleDate = visibleDateProp === undefined && hasVisibleDateChange;
    const canSetView = viewProp === undefined && hasViewChange;

    if (canSetVisibleDate || canSetView) {
      this.store.apply({
        ...(canSetVisibleDate ? { visibleDate } : {}),
        ...(canSetView ? { view } : {}),
      });
    }

    if (hasVisibleDateChange) {
      onVisibleDateChange?.(visibleDate, event);
    }
    if (hasViewChange) {
      onViewChange?.(view, event);
    }
  };

  private setSiblingVisibleDate = (delta: 1 | -1, event: React.UIEvent) => {
    const siblingVisibleDateGetter = this.store.state.viewConfig?.siblingVisibleDateGetter;
    if (!siblingVisibleDateGetter) {
      warn(
        'Event Calendar: No config found for the current view. Please use useInitializeView in your custom view.',
      );
      return;
    }

    this.setVisibleDate(siblingVisibleDateGetter(this.store.state.visibleDate, delta), event);
  };

  /**
   * Sets the view of the calendar.
   */
  public setView = (view: CalendarView, event: React.UIEvent | Event) => {
    const { view: viewProp, onViewChange } = this.parameters;
    if (view !== this.store.state.view) {
      this.assertViewValidity(view);
      if (viewProp === undefined) {
        this.store.set('view', view);
      }
      onViewChange?.(view, event);
    }
  };

  /**
   * Updates an event in the calendar.
   */
  public updateEvent = (calendarEvent: CalendarEvent) => {
    const original = selectors.event(this.store.state, calendarEvent.id);
    if (!original) {
      throw new Error(
        `Event Calendar: the original event was not found (id="${calendarEvent.id}").`,
      );
    }
    if (original?.rrule) {
      throw new Error(
        'Event Calendar: this event is recurring. Use updateRecurringEvent(...) instead.',
      );
    }

    const { onEventsChange } = this.parameters;
    const updatedEvents = this.store.state.events.map((ev) =>
      ev.id === calendarEvent.id ? calendarEvent : ev,
    );
    onEventsChange?.(updatedEvents);
  };

  /**
   * Updates a recurring event in the calendar.
   */
  public updateRecurringEvent = (params: UpdateRecurringEventParameters) => {
    const { adapter, events } = this.store.state;
    const { onEventsChange } = this.parameters;
    const { eventId, occurrenceStart, changes, scope } = params;

    const original = selectors.event(this.store.state, eventId);
    if (!original) {
      throw new Error(`Event Calendar: the original event was not found (id="${eventId}").`);
    }
    if (!original.rrule) {
      throw new Error(
        'Event Calendar: the original event is not recurring. Use updateEvent(...) instead.',
      );
    }

    let updatedEvents: CalendarEvent[] = [];

    switch (scope) {
      case 'this-and-following': {
        updatedEvents = applyRecurringUpdateFollowing(
          adapter,
          events,
          original,
          occurrenceStart,
          changes,
        );
        break;
      }

      case 'all': {
        // TODO: Issue #19441 - Allow to edit recurring series => all events.
        throw new Error('Event Calendar: scope="all" not implemented yet.');
      }

      case 'only-this': {
        // TODO: Issue #19440 - Allow to edit recurring series => this event only.
        throw new Error('Event Calendar: scope="only-this" not implemented yet.');
      }

      default: {
        throw new Error(`Event Calendar: scope="${scope}" is not supported.`);
      }
    }

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
  public goToPreviousVisibleDate = (event: React.UIEvent) => this.setSiblingVisibleDate(-1, event);

  /**
   * Goes to the next visible date span based on the current view.
   */
  public goToNextVisibleDate = (event: React.UIEvent) => this.setSiblingVisibleDate(1, event);

  /**
   * Goes to a specific day and set the view to 'day'.
   */
  public switchToDay = (visibleDate: SchedulerValidDate, event: React.UIEvent) => {
    this.setVisibleDateAndView(visibleDate, 'day', event);
  };

  /**
   * Updates the visible resources.
   */
  public setVisibleResources = (visibleResources: Map<CalendarResourceId, boolean>) => {
    if (this.store.state.visibleResources !== visibleResources) {
      this.store.set('visibleResources', visibleResources);
    }
  };

  /**
   * Updates some preferences of the calendar.
   */
  public setPreferences = (
    partialPreferences: Partial<CalendarPreferences>,
    _event: React.UIEvent | Event,
  ) => {
    this.store.set('preferences', {
      ...this.store.state.preferences,
      ...partialPreferences,
    });
  };

  /**
   * Sets the method used to determine the previous / next visible date.
   * Returns the cleanup function.
   */
  public setViewConfig = (config: CalendarViewConfig) => {
    this.store.set('viewConfig', config);
    return () => this.store.set('viewConfig', null);
  };
}
