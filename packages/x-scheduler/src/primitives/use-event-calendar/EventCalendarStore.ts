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
  CalendarResource,
} from '../models';
import { EventCalendarParameters, UpdateRecurringEventParameters } from './useEventCalendar.types';
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
export const DEFAULT_RESOURCES: CalendarResource[] = [];
export const DEFAULT_EVENT_COLOR: CalendarEventColor = 'jade';

export class EventCalendarStore extends Store<State> {
  private parameters: EventCalendarParameters;

  private initialParameters: EventCalendarParameters | null = null;

  private constructor(initialState: State, parameters: EventCalendarParameters) {
    super(initialState);
    this.parameters = parameters;

    if (process.env.NODE_ENV !== 'production') {
      this.initialParameters = parameters;
      // Add listeners to assert the state validity (not applied in prod)
      this.subscribe((state) => {
        this.assertViewValidity(state.view);
        return null;
      });
    }
  }

  /**
   * Converts an array of visible resource IDs to the internal Map format.
   * Resources not in the array are marked as hidden.
   */
  private static convertVisibleResourcesArrayToMap(
    visibleResourceIds: CalendarResourceId[],
    allResources: CalendarResource[],
  ): Map<CalendarResourceId, boolean> {
    const visibleResourcesSet = new Set(visibleResourceIds);
    const visibleResourcesMap = new Map<CalendarResourceId, boolean>();
    
    for (const resource of allResources) {
      if (!visibleResourcesSet.has(resource.id)) {
        visibleResourcesMap.set(resource.id, false);
      }
    }
    
    return visibleResourcesMap;
  }

  /**
   * Converts the internal Map format to an array of visible resource IDs.
   */
  private static convertVisibleResourcesMapToArray(
    visibleResourcesMap: Map<CalendarResourceId, boolean>,
    allResources: CalendarResource[],
  ): CalendarResourceId[] {
    return allResources
      .filter((resource) => 
        !visibleResourcesMap.has(resource.id) || visibleResourcesMap.get(resource.id) === true
      )
      .map((resource) => resource.id);
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
      resources: parameters.resources ?? DEFAULT_RESOURCES,
      views: parameters.views ?? DEFAULT_VIEWS,
      areEventsDraggable: parameters.areEventsDraggable ?? false,
      areEventsResizable: parameters.areEventsResizable ?? false,
      ampm: parameters.ampm ?? true,
      eventColor: parameters.eventColor ?? DEFAULT_EVENT_COLOR,
      showCurrentTimeIndicator: parameters.showCurrentTimeIndicator ?? true,
    };
  }

  public static create(parameters: EventCalendarParameters, adapter: Adapter): EventCalendarStore {
    const resources = parameters.resources ?? DEFAULT_RESOURCES;
    
    // Initialize visible resources from props
    let initialVisibleResourcesMap: Map<CalendarResourceId, boolean>;
    if (parameters.visibleResources !== undefined) {
      // Controlled mode
      initialVisibleResourcesMap = EventCalendarStore.convertVisibleResourcesArrayToMap(
        parameters.visibleResources,
        resources,
      );
    } else if (parameters.defaultVisibleResources !== undefined) {
      // Uncontrolled mode with default value
      initialVisibleResourcesMap = EventCalendarStore.convertVisibleResourcesArrayToMap(
        parameters.defaultVisibleResources,
        resources,
      );
    } else {
      // Uncontrolled mode with all resources visible by default
      initialVisibleResourcesMap = new Map();
    }

    const initialState: State = {
      // Store elements that should not be updated when the parameters change.
      visibleResources: initialVisibleResourcesMap,
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
      ...EventCalendarStore.getPartialStateFromParameters(parameters, adapter),
    };

    return new EventCalendarStore(initialState, parameters);
  }

  private assertViewValidity(view: CalendarView) {
    const views = this.state.views;
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
    const { adapter } = this.state;
    const hasChange = !adapter.isEqual(this.state.visibleDate, visibleDate);

    if (hasChange) {
      if (visibleDateProp === undefined) {
        this.set('visibleDate', visibleDate);
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

    const hasVisibleDateChange = visibleDate !== this.state.visibleDate;
    const hasViewChange = view !== this.state.view;
    if (!hasVisibleDateChange && !hasViewChange) {
      return;
    }

    this.assertViewValidity(view);

    const canSetVisibleDate = visibleDateProp === undefined && hasVisibleDateChange;
    const canSetView = viewProp === undefined && hasViewChange;

    if (canSetVisibleDate || canSetView) {
      this.apply({
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
    const siblingVisibleDateGetter = this.state.viewConfig?.siblingVisibleDateGetter;
    if (!siblingVisibleDateGetter) {
      warn(
        'Event Calendar: No config found for the current view. Please use useInitializeView in your custom view.',
      );
      return;
    }

    this.setVisibleDate(siblingVisibleDateGetter(this.state.visibleDate, delta), event);
  };

  /**
   * Updates the state of the calendar based on the new parameters provided to the root component.
   */
  public updateStateFromParameters = (parameters: EventCalendarParameters, adapter: Adapter) => {
    const partialState: Partial<State> = EventCalendarStore.getPartialStateFromParameters(
      parameters,
      adapter,
    );

    const initialParameters = this.initialParameters;

    function updateModel(
      controlledProp: 'view' | 'visibleDate' | 'visibleResources',
      defaultValueProp: 'defaultView' | 'defaultVisibleDate' | 'defaultVisibleResources',
    ) {
      if (parameters[controlledProp] !== undefined) {
        if (controlledProp === 'visibleResources') {
          // Convert array to Map format for visible resources
          const resources = parameters.resources ?? DEFAULT_RESOURCES;
          partialState[controlledProp] = EventCalendarStore.convertVisibleResourcesArrayToMap(
            parameters[controlledProp] as CalendarResourceId[],
            resources,
          ) as any;
        } else {
          partialState[controlledProp] = parameters[controlledProp] as any;
        }
      }

      if (process.env.NODE_ENV !== 'production') {
        const defaultValue = parameters[defaultValueProp];
        const isControlled = parameters[controlledProp] !== undefined;
        const initialDefaultValue = initialParameters?.[defaultValueProp];
        const initialIsControlled = initialParameters?.[controlledProp] !== undefined;

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
    updateModel('visibleResources', 'defaultVisibleResources');
    this.apply(partialState);
  };

  /**
   * Sets the view of the calendar.
   */
  public setView = (view: CalendarView, event: React.UIEvent | Event) => {
    const { view: viewProp, onViewChange } = this.parameters;
    if (view !== this.state.view) {
      this.assertViewValidity(view);
      if (viewProp === undefined) {
        this.set('view', view);
      }
      onViewChange?.(view, event);
    }
  };

  /**
   * Updates an event in the calendar.
   */
  public updateEvent = (calendarEvent: Partial<CalendarEvent> & Pick<CalendarEvent, 'id'>) => {
    const original = selectors.event(this.state, calendarEvent.id);
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
    const updatedEvents = this.state.events.map((ev) =>
      ev.id === calendarEvent.id ? { ...ev, ...calendarEvent } : ev,
    );
    onEventsChange?.(updatedEvents);
  };

  /**
   * Updates a recurring event in the calendar.
   */
  public updateRecurringEvent = (params: UpdateRecurringEventParameters) => {
    const { adapter, events } = this.state;
    const { onEventsChange } = this.parameters;
    const { eventId, occurrenceStart, changes, scope } = params;

    const original = selectors.event(this.state, eventId);
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
    const updatedEvents = this.state.events.filter((ev) => ev.id !== eventId);
    onEventsChange?.(updatedEvents);
  };

  /**
   * Goes to today's date without changing the view.
   */
  public goToToday = (event: React.UIEvent) => {
    const { adapter } = this.state;
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
    const { visibleResources: visibleResourcesProp, onVisibleResourcesChange } = this.parameters;
    const hasChange = this.state.visibleResources !== visibleResources;

    if (hasChange) {
      if (visibleResourcesProp === undefined) {
        this.set('visibleResources', visibleResources);
      }
      
      if (onVisibleResourcesChange) {
        const visibleResourcesArray = EventCalendarStore.convertVisibleResourcesMapToArray(
          visibleResources,
          this.state.resources,
        );
        onVisibleResourcesChange(visibleResourcesArray);
      }
    }
  };

  /**
   * Updates some preferences of the calendar.
   */
  public setPreferences = (
    partialPreferences: Partial<CalendarPreferences>,
    _event: React.UIEvent | Event,
  ) => {
    this.set('preferences', {
      ...this.state.preferences,
      ...partialPreferences,
    });
  };

  /**
   * Sets the method used to determine the previous / next visible date.
   * Returns the cleanup function.
   */
  public setViewConfig = (config: CalendarViewConfig) => {
    this.set('viewConfig', config);
    return () => this.set('viewConfig', null);
  };
}
