import { warn } from '@base-ui-components/utils/warn';
import {
  CalendarPreferences,
  CalendarView,
  CalendarViewConfig,
  SchedulerValidDate,
  CalendarPreferencesMenuConfig,
  CalendarEventColor,
  CalendarResource,
} from '../models';
import { Adapter } from '../utils/adapter/types';
import { SchedulerStore } from '../utils/SchedulerStore';
import { EventCalendarState, EventCalendarStoreParameters } from './EventCalendarStore.types';

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

export class EventCalendarStore extends SchedulerStore<
  EventCalendarState,
  EventCalendarStoreParameters
> {
  private constructor(initialState: EventCalendarState, parameters: EventCalendarStoreParameters) {
    super(initialState, parameters);

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
   * Returns the properties of the state that are derived from the parameters.
   * This do not contain state properties that don't update whenever the parameters update.
   */
  protected static getPartialStateFromParameters(
    parameters: EventCalendarStoreParameters,
    adapter: Adapter,
  ) {
    return {
      ...SchedulerStore.getPartialStateFromParameters(parameters, adapter),
      views: parameters.views ?? DEFAULT_VIEWS,
    };
  }

  public static create(
    parameters: EventCalendarStoreParameters,
    adapter: Adapter,
  ): EventCalendarStore {
    const initialState: EventCalendarState = {
      ...SchedulerStore.getInitialState(parameters, adapter),
      // Store elements that should not be updated when the parameters change.
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
  public updateStateFromParameters = (
    parameters: EventCalendarStoreParameters,
    adapter: Adapter,
  ) => {
    const partialState: Partial<EventCalendarState> =
      EventCalendarStore.getPartialStateFromParameters(parameters, adapter);

    const initialParameters = this.initialParameters;

    function updateModel(
      controlledProp: 'view' | 'visibleDate',
      defaultValueProp: 'defaultView' | 'defaultVisibleDate',
    ) {
      if (parameters[controlledProp] !== undefined) {
        partialState[controlledProp] = parameters[controlledProp] as any;
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
