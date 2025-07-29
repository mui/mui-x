'use client';
import * as React from 'react';
import { useModernLayoutEffect } from '@base-ui-components/react/utils';
import {
  EventCalendarInstance,
  EventCalendarView,
  UseEventCalendarParameters,
} from './EventCalendar.types';
import { useLazyRef } from '../../base-ui-copy/utils/useLazyRef';
import { Store } from '../../base-ui-copy/utils/store';
import { useEventCallback } from '../../base-ui-copy/utils/useEventCallback';
import { State } from './store';
import { useAssertModelConsistency } from '../internals/hooks/useAssertModelConsistency';
import { useAdapter } from '../../primitives/utils/adapter/useAdapter';
import { Adapter } from '../../primitives/utils/adapter/types';
import { SchedulerValidDate } from '../../primitives/models';
import { AGENDA_VIEW_DAYS_AMOUNT } from '../agenda-view';
import { useAssertStateValidity } from '../internals/hooks/useAssertStateValidity';

const DEFAULT_VIEWS: EventCalendarView[] = ['week', 'day', 'month', 'agenda'];

export function useEventCalendar(parameters: UseEventCalendarParameters) {
  const adapter = useAdapter();

  const defaultVisibleDateFallback = React.useRef(adapter.startOfDay(adapter.date())).current;

  const {
    events: eventsProp,
    onEventsChange,
    resources: resourcesProp,
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
  } = parameters;

  const store = useLazyRef(
    () =>
      new Store<State>({
        events: eventsProp,
        resources: resourcesProp || [],
        visibleResources: new Map(),
        visibleDate: visibleDateProp ?? defaultVisibleDate,
        view: viewProp ?? defaultView,
        views,
        areEventsDraggable,
        areEventsResizable,
        ampm,
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

  useModernLayoutEffect(() => {
    const partialState: Partial<State> = {
      events: eventsProp,
      resources: resourcesProp || [],
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

  const setView: EventCalendarInstance['setView'] = useEventCallback((view, event) => {
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

  const updateEvent: EventCalendarInstance['updateEvent'] = useEventCallback((calendarEvent) => {
    const updatedEvents = store.state.events.map((ev) =>
      ev.id === calendarEvent.id ? calendarEvent : ev,
    );
    onEventsChange?.(updatedEvents);
  });

  const deleteEvent: EventCalendarInstance['deleteEvent'] = useEventCallback((eventId) => {
    const updatedEvents = store.state.events.filter((ev) => ev.id !== eventId);
    onEventsChange?.(updatedEvents);
  });

  const goToToday: EventCalendarInstance['goToToday'] = useEventCallback((event) => {
    setVisibleDate(adapter.startOfDay(adapter.date()), event);
  });

  const goToPreviousVisibleDate: EventCalendarInstance['goToPreviousVisibleDate'] =
    useEventCallback((event) => {
      setVisibleDate(getNavigationDate({ adapter, store, delta: -1 }), event);
    });

  const goToNextVisibleDate: EventCalendarInstance['goToNextVisibleDate'] = useEventCallback(
    (event) => {
      setVisibleDate(getNavigationDate({ adapter, store, delta: 1 }), event);
    },
  );

  const switchToDay: EventCalendarInstance['switchToDay'] = useEventCallback(
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

  const setVisibleResources: EventCalendarInstance['setVisibleResources'] = useEventCallback(
    (visibleResources) => {
      store.set('visibleResources', visibleResources);
    },
  );

  const instanceRef = React.useRef<EventCalendarInstance>({
    setView,
    updateEvent,
    deleteEvent,
    goToToday,
    goToPreviousVisibleDate,
    goToNextVisibleDate,
    switchToDay,
    setVisibleResources,
  });
  const instance = instanceRef.current;

  const contextValue = React.useMemo(() => ({ store, instance }), [store, instance]);

  return { store, instance, contextValue };
}

function getNavigationDate({
  adapter,
  store,
  delta,
}: {
  adapter: Adapter;
  store: Store<State>;
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
