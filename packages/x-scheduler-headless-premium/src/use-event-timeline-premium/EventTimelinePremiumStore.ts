import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';
import {
  DEFAULT_SCHEDULER_PREFERENCES,
  SchedulerParametersToStateMapper,
  SchedulerStore,
} from '@mui/x-scheduler-headless/internals';
import { createChangeEventDetails } from '@mui/x-scheduler-headless/base-ui-copy';
import { TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { EventTimelinePremiumPreferences, EventTimelinePremiumView } from '../models';
import {
  EventTimelinePremiumState,
  EventTimelinePremiumParameters,
} from './EventTimelinePremiumStore.types';
import { EventTimelinePremiumLazyLoadingPlugin } from './plugins/EventTimelinePremiumLazyLoadingPlugin';

export const DEFAULT_VIEWS: EventTimelinePremiumView[] = [
  'time',
  'days',
  'weeks',
  'months',
  'years',
];
export const DEFAULT_VIEW: EventTimelinePremiumView = 'time';

const deriveStateFromParameters = <TEvent extends object, TResource extends object>(
  parameters: EventTimelinePremiumParameters<TEvent, TResource>,
) => ({
  views: parameters.views ?? DEFAULT_VIEWS,
});

export const DEFAULT_PREFERENCES: EventTimelinePremiumPreferences = DEFAULT_SCHEDULER_PREFERENCES;

const mapper: SchedulerParametersToStateMapper<
  EventTimelinePremiumState,
  EventTimelinePremiumParameters<any, any>
> = {
  getInitialState: (schedulerInitialState, parameters) => ({
    ...schedulerInitialState,
    ...deriveStateFromParameters(parameters),
    view: parameters.view ?? parameters.defaultView ?? DEFAULT_VIEW,
    preferences: parameters.preferences ?? parameters.defaultPreferences ?? EMPTY_OBJECT,
  }),
  updateStateFromParameters: (newSchedulerState, parameters, updateModel) => {
    const newState: Partial<EventTimelinePremiumState> = {
      ...newSchedulerState,
      ...deriveStateFromParameters(parameters),
    };

    updateModel(newState, 'view', 'defaultView');
    updateModel(newState, 'preferences', 'defaultPreferences');

    return newState;
  },
};

export class EventTimelinePremiumStore<
  TEvent extends object,
  TResource extends object,
> extends SchedulerStore<
  TEvent,
  TResource,
  EventTimelinePremiumState,
  EventTimelinePremiumParameters<TEvent, TResource>
> {
  private previousVisibleRangeKey: string | null = null;

  public constructor(
    parameters: EventTimelinePremiumParameters<TEvent, TResource>,
    adapter: Adapter,
  ) {
    super(parameters, adapter, 'EventTimelinePremium', mapper);

    if (process.env.NODE_ENV !== 'production') {
      // Add listeners to assert the state validity (not applied in prod)
      this.subscribe((state) => {
        this.assertViewValidity(state.view);
        return null;
      });
    }

    this.lazyLoading = new EventTimelinePremiumLazyLoadingPlugin(this);

    // Emit viewConfigChanged event for lazy loading
    // Use a simple string selector to avoid object reference comparison issues
    this.registerStoreEffect(
      (state) => {
        const range = this.getVisibleRangeForView(state.view, state.visibleDate, state.adapter);
        return `${state.adapter.getTime(range.start)}|${state.adapter.getTime(range.end)}`;
      },
      (_previousRangeKey, nextRangeKey) => {
        if (this.previousVisibleRangeKey === nextRangeKey) {
          return;
        }

        this.emitViewConfigChanged(nextRangeKey);
      },
    );

    // Emit initial viewConfigChanged event for lazy loading on mount
    // registerStoreEffect only fires on state changes, so we need to trigger the initial load manually
    // Note: For initial loading, we call emitViewConfigChanged synchronously during the registerStoreEffect
    // initialization, not via queueMicrotask, to avoid interfering with direct queueDataFetchForRange calls
  }

  /**
   * Calculate the visible range based on the current view and visible date.
   */
  private getVisibleRangeForView(
    view: EventTimelinePremiumView,
    visibleDate: TemporalSupportedObject,
    adapter: Adapter,
  ): { start: TemporalSupportedObject; end: TemporalSupportedObject } {
    switch (view) {
      case 'time':
        // Single day view - show the current day
        return {
          start: adapter.startOfDay(visibleDate),
          end: adapter.endOfDay(visibleDate),
        };
      case 'days':
        // Days view - show 14 days centered on the visible date
        return {
          start: adapter.addDays(adapter.startOfDay(visibleDate), -7),
          end: adapter.addDays(adapter.endOfDay(visibleDate), 7),
        };
      case 'weeks':
        // Weeks view - show 6 weeks (a month and buffer)
        return {
          start: adapter.startOfWeek(adapter.addWeeks(visibleDate, -2)),
          end: adapter.endOfWeek(adapter.addWeeks(visibleDate, 4)),
        };
      case 'months':
        // Months view - show 12 months (a year)
        return {
          start: adapter.startOfMonth(adapter.addMonths(visibleDate, -6)),
          end: adapter.endOfMonth(adapter.addMonths(visibleDate, 6)),
        };
      case 'years':
        // Years view - show 5 years
        return {
          start: adapter.startOfYear(adapter.addYears(visibleDate, -2)),
          end: adapter.endOfYear(adapter.addYears(visibleDate, 2)),
        };
      default:
        return {
          start: adapter.startOfDay(visibleDate),
          end: adapter.endOfDay(visibleDate),
        };
    }
  }

  /**
   * Generate visible days array for the viewConfigChanged event.
   */
  private generateVisibleDays(
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
    adapter: Adapter,
  ): Array<{ key: string; value: TemporalSupportedObject }> {
    const days: Array<{ key: string; value: TemporalSupportedObject }> = [];
    let current = adapter.startOfDay(start);
    const endDate = adapter.startOfDay(end);

    while (adapter.isBefore(current, endDate) || adapter.isEqual(current, endDate)) {
      days.push({
        key: String(adapter.getTime(current)),
        value: current,
      });
      current = adapter.addDays(current, 1);

      // Safety limit to prevent infinite loops
      if (days.length > 1000) {
        break;
      }
    }

    return days;
  }

  /**
   * Emit viewConfigChanged event for lazy loading.
   */
  private emitViewConfigChanged(rangeKey: string) {
    const range = this.getVisibleRangeForView(
      this.state.view,
      this.state.visibleDate,
      this.state.adapter,
    );
    const visibleDays = this.generateVisibleDays(range.start, range.end, this.state.adapter);

    this.publishEvent(
      'viewConfigChanged',
      {
        visibleDays,
        isInitialLoad: this.previousVisibleRangeKey == null,
      },
      null,
    );
    this.previousVisibleRangeKey = rangeKey;
  }

  /**
   * Public method to emit initial viewConfigChanged event.
   * Called by the lazy loading plugin to trigger initial data load.
   */
  public emitInitialViewConfigChanged() {
    const range = this.getVisibleRangeForView(
      this.state.view,
      this.state.visibleDate,
      this.state.adapter,
    );
    const rangeKey = `${this.state.adapter.getTime(range.start)}|${this.state.adapter.getTime(range.end)}`;

    // Only emit if not already emitted
    if (this.previousVisibleRangeKey === null) {
      this.emitViewConfigChanged(rangeKey);
    }
  }

  private assertViewValidity(view: EventTimelinePremiumView) {
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

  /**
   * Sets the view of the timeline.
   */
  public setView = (view: EventTimelinePremiumView, event: Event) => {
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
}
