import { warn } from '@base-ui/utils/warn';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import {
  EventCalendarPreferences,
  CalendarView,
  EventCalendarViewConfig,
  TemporalSupportedObject,
  EventCalendarPreferencesMenuConfig,
} from '../models';
import { Adapter } from '../use-adapter/useAdapter.types';
import {
  DEFAULT_SCHEDULER_PREFERENCES,
  SchedulerParametersToStateMapper,
  SchedulerStore,
} from '../internals/utils/SchedulerStore';
import { EventCalendarState, EventCalendarParameters } from './EventCalendarStore.types';
import { createChangeEventDetails } from '../base-ui-copy/utils/createBaseUIEventDetails';
import { EventCalendarLazyLoadingPlugin } from './plugins/EventCalendarLazyLoadingPlugin';

export const DEFAULT_VIEWS: CalendarView[] = ['week', 'day', 'month', 'agenda'];
export const DEFAULT_VIEW: CalendarView = 'week';

export const DEFAULT_EVENT_CALENDAR_PREFERENCES: EventCalendarPreferences = {
  ...DEFAULT_SCHEDULER_PREFERENCES,
  showWeekends: true,
  showWeekNumber: false,
  showEmptyDaysInAgenda: true,
  isSidePanelOpen: true,
};
export const DEFAULT_PREFERENCES_MENU_CONFIG: EventCalendarPreferencesMenuConfig = {
  toggleWeekendVisibility: true,
  toggleWeekNumberVisibility: true,
  toggleEmptyDaysInAgenda: true,
  toggleAmpm: true,
};

const deriveStateFromParameters = <TEvent extends object, TResource extends object>(
  parameters: EventCalendarParameters<TEvent, TResource>,
) => ({
  views: parameters.views ?? DEFAULT_VIEWS,
});

const mapper: SchedulerParametersToStateMapper<
  EventCalendarState,
  EventCalendarParameters<any, any>
> = {
  getInitialState: (schedulerInitialState, parameters) => ({
    ...schedulerInitialState,
    ...deriveStateFromParameters(parameters),
    preferences: parameters.preferences ?? parameters.defaultPreferences ?? EMPTY_OBJECT,
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
    updateModel(newState, 'preferences', 'defaultPreferences');
    return newState;
  },
};

export class EventCalendarStore<
  TEvent extends object,
  TResource extends object,
> extends SchedulerStore<
  TEvent,
  TResource,
  EventCalendarState,
  EventCalendarParameters<TEvent, TResource>
> {
  public constructor(parameters: EventCalendarParameters<TEvent, TResource>, adapter: Adapter) {
    super(parameters, adapter, 'Event Calendar', mapper);

    if (process.env.NODE_ENV !== 'production') {
      // Add listeners to assert the state validity (not applied in prod)
      this.subscribe((state) => {
        this.assertViewValidity(state.view);
        return null;
      });
    }

    this.lazyLoading = new EventCalendarLazyLoadingPlugin<TEvent, TResource>(this);
  }

  private assertViewValidity(view: CalendarView) {
    const views = this.state.views;
    if (!views.includes(view)) {
      throw new Error(
        [
          `MUI: The component tried to switch to the "${view}" view but it is not compatible with the available views: ${views.join(', ')}.`,
          'Please ensure that the requested view is included in the views array.',
        ].join('\n'),
      );
    }
  }

  private setVisibleDateAndView = (
    visibleDate: TemporalSupportedObject,
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
    const eventDetails = createChangeEventDetails('none', event.nativeEvent);

    if (hasVisibleDateChange) {
      onVisibleDateChange?.(visibleDate, eventDetails);
    }
    if (hasViewChange) {
      onViewChange?.(view, eventDetails);
    }

    if (eventDetails.isCanceled) {
      return;
    }

    const canSetVisibleDate = visibleDateProp === undefined && hasVisibleDateChange;
    const canSetView = viewProp === undefined && hasViewChange;
    if (canSetVisibleDate || canSetView) {
      this.update({
        ...(canSetVisibleDate ? { visibleDate } : undefined),
        ...(canSetView ? { view } : undefined),
      });
    }
  };

  private setSiblingVisibleDate = (delta: 1 | -1, event: React.UIEvent) => {
    const siblingVisibleDateGetter = this.state.viewConfig?.siblingVisibleDateGetter;
    if (!siblingVisibleDateGetter) {
      warn(
        'MUI: No config found for the current view. Please use useInitializeView in your custom view.',
      );
      return;
    }

    this.setVisibleDate(siblingVisibleDateGetter({ delta, state: this.state }), event);
  };

  /**
   * Sets the view of the calendar.
   */
  public setView = (view: CalendarView, event: Event) => {
    const { view: viewProp, onViewChange } = this.parameters;
    if (view !== this.state.view) {
      this.assertViewValidity(view);

      const eventDetails = createChangeEventDetails('none', event);
      onViewChange?.(view, eventDetails);

      if (!eventDetails.isCanceled && viewProp === undefined) {
        this.set('view', view);
      }
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
  public switchToDay = (visibleDate: TemporalSupportedObject, event: React.UIEvent) => {
    this.setVisibleDateAndView(visibleDate, 'day', event);
  };

  /**
   * Updates some preferences of the calendar.
   */
  public setPreferences = (partialPreferences: Partial<EventCalendarPreferences>, event: Event) => {
    const { preferences: preferencesProp, onPreferencesChange } = this.parameters;

    const updated = {
      ...this.state.preferences,
      ...partialPreferences,
    };

    const eventDetails = createChangeEventDetails('none', event);
    onPreferencesChange?.(updated, eventDetails);

    if (!eventDetails.isCanceled && preferencesProp === undefined) {
      this.set('preferences', updated);
    }
  };

  /**
   * Sets the method used to determine the previous / next visible date.
   * Returns the cleanup function.
   */
  public setViewConfig = (config: EventCalendarViewConfig) => {
    this.set('viewConfig', config);
    return () => this.set('viewConfig', null);
  };
}
