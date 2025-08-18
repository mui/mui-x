'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { Store as BaseStore } from '@base-ui-components/utils/store';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { State } from './store';
import { useAssertModelConsistency } from '../utils/useAssertModelConsistency';
import { useAdapter } from '../utils/adapter/useAdapter';
import { Adapter } from '../utils/adapter/types';
import {
  CalendarEvent,
  CalendarEventId,
  CalendarResource,
  CalendarResourceId,
  CalendarSettings,
  CalendarView,
  SchedulerValidDate,
} from '../models';
import { useAssertStateValidity } from '../utils/useAssertStateValidity';

// TODO: Create a prop to allow users to customize the number of days in agenda view
export const AGENDA_VIEW_DAYS_AMOUNT = 12;

const DEFAULT_VIEWS: CalendarView[] = ['week', 'day', 'month', 'agenda'];
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
    views = DEFAULT_VIEWS,
    onViewChange,
    visibleDate: visibleDateProp,
    defaultVisibleDate = defaultVisibleDateFallback,
    onVisibleDateChange,
    areEventsDraggable = false,
    areEventsResizable = false,
    ampm = true,
    settings: settingsProp = DEFAULT_SETTINGS,
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
        views,
        areEventsDraggable,
        areEventsResizable,
        ampm,
        settings: settingsProp,
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
      views,
      areEventsDraggable,
      areEventsResizable,
      ampm,
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
    views,
    ampm,
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
    if (!store.state.views.includes(view)) {
      throw new Error(
        [
          `Event Calendar: The view "${view}" provided to the setView method is not compatible with the available views: ${views.join(', ')}.`,
          'Please ensure that the requested view is included in the views array.',
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
      setVisibleDate(getNavigationDate({ adapter, store, delta: -1 }), event);
    });

  const goToNextVisibleDate: useEventCalendar.Instance['goToNextVisibleDate'] = useEventCallback(
    (event) => {
      setVisibleDate(getNavigationDate({ adapter, store, delta: 1 }), event);
    },
  );

  const switchToDay: useEventCalendar.Instance['switchToDay'] = useEventCallback(
    (visibleDate, event) => {
      if (!store.state.views.includes('day')) {
        throw new Error(
          'The "day" view is disabled on your Event Calendar. Please ensure that "day" is included in the views prop before using the switchToDay method.',
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
  });
  const instance = instanceRef.current;

  return React.useMemo(() => ({ store, instance }), [store, instance]);
}

function getNavigationDate({
  adapter,
  store,
  delta,
}: {
  adapter: Adapter;
  store: useEventCalendar.Store;
  delta: number;
}) {
  const { view, visibleDate } = store.state;
  switch (view) {
    case 'day':
      return adapter.addDays(visibleDate, delta);
    case 'week':
      return adapter.addWeeks(adapter.startOfWeek(visibleDate), delta);
    case 'month':
      return adapter.addMonths(adapter.startOfMonth(visibleDate), delta);
    case 'agenda':
      return adapter.addDays(visibleDate, AGENDA_VIEW_DAYS_AMOUNT * delta);
    default:
      return visibleDate;
  }
}

export namespace useEventCalendar {
  export interface Parameters {
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
    setView: (view: CalendarView, event: React.UIEvent | Event) => void;
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
     * Set the settings of the calendar.
     */
    setSettings: (settings: Partial<CalendarSettings>, event: React.UIEvent | Event) => void;
  }

  export type Store = BaseStore<State>;
}
