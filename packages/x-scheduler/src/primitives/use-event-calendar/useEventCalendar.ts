'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { Store as BaseStore } from '@base-ui-components/utils/store';
import { warn } from '@base-ui-components/utils/warn';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { State } from './store';
import { useAssertModelConsistency } from '../utils/useAssertModelConsistency';
import { useAdapter } from '../utils/adapter/useAdapter';
import {
  CalendarEvent,
  CalendarEventId,
  CalendarResource,
  CalendarResourceId,
  CalendarSettings,
  CalendarView,
  CalendarViewConfig,
  SchedulerValidDate,
  TimelineView,
} from '../models';
import { useAssertStateValidity } from '../utils/useAssertStateValidity';

const DEFAULT_VIEWS: CalendarView[] = ['week', 'day', 'month', 'agenda'];
const DEFAULT_TIMELINE_VIEWS: TimelineView[] = ['time', 'days', 'weeks', 'months', 'years'];
const DEFAULT_SETTINGS: CalendarSettings = { hideWeekends: false };
const EMPTY_ARRAY: any[] = [];

export function useEventCalendar(
  parameters: useEventCalendar.Parameters,
): useEventCalendar.ReturnValue {
  const adapter = useAdapter();
  const defaultVisibleDateFallback = useRefWithInit(() =>
    adapter.startOfDay(adapter.date()),
  ).current;

  const {
    events: eventsProp,
    onEventsChange,
    resources: resourcesProp = EMPTY_ARRAY,
    view: viewProp,
    defaultView = 'week',
    calendarViews = DEFAULT_VIEWS,
    timelineViews = DEFAULT_TIMELINE_VIEWS,
    onViewChange,
    visibleDate: visibleDateProp,
    defaultVisibleDate = defaultVisibleDateFallback,
    onVisibleDateChange,
    areEventsDraggable = false,
    areEventsResizable = false,
    ampm = true,
    settings: settingsProp = DEFAULT_SETTINGS,
    enableTimeline = false,
  } = parameters;

  const store = useRefWithInit(
    () =>
      new BaseStore<State>({
        adapter,
        events: eventsProp,
        resources: resourcesProp,
        visibleResources: new Map(),
        visibleDate: visibleDateProp ?? defaultVisibleDate,
        view: viewProp ?? defaultView,
        calendarViews,
        timelineViews,
        areEventsDraggable,
        areEventsResizable,
        ampm,
        settings: settingsProp,
        viewConfig: null,
        enableTimeline,
        layoutMode: 'calendar',
      }),
  ).current;

  useAssertModelConsistency({
    componentName: 'Event Calendar',
    propName: 'view',
    controlled: viewProp,
    defaultValue: defaultView,
  });

  useAssertModelConsistency({
    componentName: 'Event Calendar',
    propName: 'visibleDate',
    controlled: visibleDateProp,
    defaultValue: defaultVisibleDate,
  });

  useAssertStateValidity(store);

  useIsoLayoutEffect(() => {
    const partialState: Partial<State> = {
      adapter,
      events: eventsProp,
      resources: resourcesProp,
      calendarViews,
      timelineViews,
      areEventsDraggable,
      areEventsResizable,
      ampm,
      enableTimeline,
    };
    if (viewProp !== undefined) {
      partialState.view = viewProp;
    }
    if (visibleDateProp !== undefined) {
      partialState.visibleDate = visibleDateProp;
    }

    store.apply(partialState);
  }, [
    store,
    adapter,
    eventsProp,
    resourcesProp,
    viewProp,
    visibleDateProp,
    areEventsDraggable,
    areEventsResizable,
    calendarViews,
    timelineViews,
    ampm,
    enableTimeline,
  ]);

  const setVisibleDate = useEventCallback(
    (visibleDate: SchedulerValidDate, event: React.UIEvent) => {
      if (visibleDateProp === undefined) {
        store.set('visibleDate', visibleDate);
      }

      onVisibleDateChange?.(visibleDate, event);
    },
  );

  const setView: useEventCalendar.Instance['setView'] = useEventCallback((view, event) => {
    if (
      !store.state.calendarViews.includes(view as CalendarView) &&
      !(enableTimeline && store.state.timelineViews.includes(view as TimelineView))
    ) {
      throw new Error(
        [
          `Event Calendar: The view "${view}" provided to the setView method is not compatible with the available calendarViews: ${calendarViews.join(', ')}.`,
          'Please ensure that the requested view is included in the calendarViews array.',
        ].join('\n'),
      );
    }

    if (viewProp === undefined) {
      store.set('view', view);
    }

    onViewChange?.(view, event);
  });

  const updateEvent: useEventCalendar.Instance['updateEvent'] = useEventCallback(
    (calendarEvent) => {
      const updatedEvents = store.state.events.map((ev) =>
        ev.id === calendarEvent.id ? calendarEvent : ev,
      );
      onEventsChange?.(updatedEvents);
    },
  );

  const deleteEvent: useEventCalendar.Instance['deleteEvent'] = useEventCallback((eventId) => {
    const updatedEvents = store.state.events.filter((ev) => ev.id !== eventId);
    onEventsChange?.(updatedEvents);
  });

  const goToToday: useEventCalendar.Instance['goToToday'] = useEventCallback((event) => {
    setVisibleDate(adapter.startOfDay(adapter.date()), event);
  });

  const goToPreviousVisibleDate: useEventCalendar.Instance['goToPreviousVisibleDate'] =
    useEventCallback((event) => {
      const siblingVisibleDateGetter = store.state.viewConfig?.siblingVisibleDateGetter;
      if (!siblingVisibleDateGetter) {
        warn(
          'MUI X Scheduler: No config found for the current view. Please use useInitializeView in your custom view.',
        );
        return;
      }

      setVisibleDate(siblingVisibleDateGetter(store.state.visibleDate, -1), event);
    });

  const goToNextVisibleDate: useEventCalendar.Instance['goToNextVisibleDate'] = useEventCallback(
    (event) => {
      const siblingVisibleDateGetter = store.state.viewConfig?.siblingVisibleDateGetter;
      if (!siblingVisibleDateGetter) {
        warn(
          'MUI X Scheduler: No config found for the current view. Please use useInitializeView in your custom view.',
        );
        return;
      }

      setVisibleDate(siblingVisibleDateGetter(store.state.visibleDate, 1), event);
    },
  );

  const switchToDay: useEventCalendar.Instance['switchToDay'] = useEventCallback(
    (visibleDate, event) => {
      if (!store.state.calendarViews.includes('day')) {
        throw new Error(
          'The "day" view is disabled on your Event Calendar. Please ensure that "day" is included in the calendarViews prop before using the switchToDay method.',
        );
      }
      setVisibleDate(visibleDate, event);
      setView('day', event);
    },
  );

  const setVisibleResources: useEventCalendar.Instance['setVisibleResources'] = useEventCallback(
    (visibleResources) => {
      store.set('visibleResources', visibleResources);
    },
  );

  const setSettings: useEventCalendar.Instance['setSettings'] = useEventCallback(
    (partialSettings, _) => {
      store.set('settings', {
        ...store.state.settings,
        ...partialSettings,
      });
    },
  );

  const setViewConfig: useEventCalendar.Instance['setViewConfig'] = useEventCallback((config) => {
    store.set('viewConfig', config);

    return () => store.set('viewConfig', null);
  });

  const setLayoutMode: useEventCalendar.Instance['setLayoutMode'] = useEventCallback(
    (layoutMode) => {
      if (!store.state.enableTimeline && layoutMode === 'timeline') {
        throw new Error(
          [
            `Event Calendar: The layout mode "${layoutMode}" is not enabled.`,
            'Please ensure that the timeline view is enabled in the calendar settings.',
          ].join('\n'),
        );
      }

      store.set('layoutMode', layoutMode);
      store.set('view', store.state.timelineViews[0]);
    },
  );

  const instanceRef = React.useRef<useEventCalendar.Instance>({
    setView,
    updateEvent,
    deleteEvent,
    goToToday,
    goToPreviousVisibleDate,
    goToNextVisibleDate,
    switchToDay,
    setVisibleResources,
    setSettings,
    setViewConfig,
    setLayoutMode,
  });
  const instance = instanceRef.current;

  return React.useMemo(() => ({ store, instance }), [store, instance]);
}

export namespace useEventCalendar {
  export interface Parameters {
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
     * The calendarViews available in the calendar.
     */
    calendarViews?: CalendarView[];
    /**
     * The calendarViews available in the timeline.
     * @default ['time', "weeks", "days", "months", "years"]
     */
    timelineViews?: TimelineView[];
    /**
     * Event handler called when the view changes.
     */
    onViewChange?: (view: CalendarView | TimelineView, event: React.UIEvent | Event) => void;
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
    /**
     * Whether the timeline view is enabled.
     */
    enableTimeline?: boolean;
  }

  export interface ReturnValue {
    /**
     * The store that holds the state of the calendar.
     */
    store: Store;
    /**
     * The instance methods to interact with the calendar.
     */
    instance: Instance;
  }

  export interface Instance {
    /**
     * Sets the view of the calendar.
     */
    setView: (view: CalendarView | TimelineView, event: React.UIEvent | Event) => void;
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
    /**
     * Updates some settings of the calendar.
     */
    setSettings: (settings: Partial<CalendarSettings>, event: React.UIEvent | Event) => void;
    /**
     * Sets the method used to determine the previous / next visible date.
     * Returns the cleanup function.
     */
    setViewConfig: (getter: CalendarViewConfig) => () => void;
    /**
     * Sets the current layout mode.
     */
    setLayoutMode: (layoutMode: 'calendar' | 'timeline') => void;
  }

  export type Store = BaseStore<State>;
}
