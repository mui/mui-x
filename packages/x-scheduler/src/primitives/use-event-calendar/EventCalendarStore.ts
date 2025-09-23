import { warn } from '@base-ui-components/utils/warn';
import {
  CalendarPreferences,
  CalendarView,
  CalendarViewConfig,
  SchedulerValidDate,
  CalendarPreferencesMenuConfig,
} from '../models';
import { Adapter } from '../utils/adapter/types';
import { SchedulerParametersToStateMapper, SchedulerStore } from '../utils/SchedulerStore';
import { EventCalendarState, EventCalendarParameters } from './EventCalendarStore.types';

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

const deriveStateFromParameters = (parameters: EventCalendarParameters) => ({
  views: parameters.views ?? DEFAULT_VIEWS,
});

const mapper: SchedulerParametersToStateMapper<EventCalendarState, EventCalendarParameters> = {
  getInitialState: (schedulerInitialState, parameters) => ({
    ...schedulerInitialState,
    ...deriveStateFromParameters(parameters),
    preferences: { ...DEFAULT_PREFERENCES, ...parameters.preferences },
    preferencesMenuConfig:
      parameters.preferencesMenuConfig === false
        ? parameters.preferencesMenuConfig
        : {
            ...DEFAULT_PREFERENCES_MENU_CONFIG,
            ...parameters.preferencesMenuConfig,
          },
    viewConfig: null,
    view: parameters.view ?? parameters.defaultView ?? DEFAULT_VIEW,
  }),
  updateStateFromParameters: (newSchedulerState, parameters, updateModel) => {
    const newState: Partial<EventCalendarState> = {
      ...newSchedulerState,
      ...deriveStateFromParameters(parameters),
    };

    updateModel(newState, 'view', 'defaultView');
    return newState;
  },
};

export class EventCalendarStore extends SchedulerStore<
  EventCalendarState,
  EventCalendarParameters
> {
  public constructor(parameters: EventCalendarParameters, adapter: Adapter) {
    super(parameters, adapter, 'Event Calendar', mapper);

    if (process.env.NODE_ENV !== 'production') {
      // Add listeners to assert the state validity (not applied in prod)
      this.subscribe((state) => {
        this.assertViewValidity(state.view);
        return null;
      });
    }
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
