'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useModernLayoutEffect } from '@base-ui-components/react/utils';
import { SchedulerValidDate } from '../../primitives/models';
import { EventCalendarProps } from './EventCalendar.types';
import { WeekView } from '../week-view/WeekView';
import { AgendaView } from '../agenda-view';
import { DayView } from '../day-view/DayView';
import { HeaderToolbar } from '../header-toolbar';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { TranslationsProvider } from '../internals/utils/TranslationsContext';
import { useLazyRef } from '../../base-ui-copy/utils/useLazyRef';
import { Store, useSelector } from '../../base-ui-copy/utils/store';
import { useEventCallback } from '../../base-ui-copy/utils/useEventCallback';
import { selectors, State } from './store';
import { EventCalendarStoreContext } from '../internals/hooks/useEventCalendarStore';
import { MonthView } from '../month-view';
import { DateNavigator } from '../date-navigator/DateNavigator';
import '../index.css';
import './EventCalendar.css';
import { useDateNavigation } from '../internals/hooks/useDateNavigation';
import { ResourceLegend } from '../internals/components/resource-legend/ResourceLegend';

const adapter = getAdapter();

export const EventCalendar = React.forwardRef(function EventCalendar(
  props: EventCalendarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    events: eventsProp,
    onEventsChange,
    resources: resourcesProp,
    translations,
    className,
    ...other
  } = props;

  const store = useLazyRef(
    () =>
      new Store<State>({
        events: eventsProp,
        resources: resourcesProp || [],
        visibleResources: new Map(),
        visibleDate: adapter.startOfDay(adapter.date()),
        currentView: 'week',
        views: ['week', 'day', 'month', 'agenda'],
      }),
  ).current;

  const currentView = useSelector(store, selectors.currentView);
  const visibleDate = useSelector(store, selectors.visibleDate);

  const setVisibleDate = useEventCallback((date: SchedulerValidDate) => {
    store.apply({ visibleDate: date });
  });

  const { onNextClick, onPreviousClick, onTodayClick } = useDateNavigation({
    visibleDate,
    setVisibleDate,
    view: currentView,
  });

  const handleDayHeaderClick = useEventCallback((day: SchedulerValidDate) => {
    store.apply({ visibleDate: day, currentView: 'day' });
  });

  useModernLayoutEffect(() => {
    store.apply({
      events: eventsProp,
      resources: resourcesProp || [],
    });
  }, [store, eventsProp, resourcesProp]);

  let content: React.ReactNode;
  switch (currentView) {
    case 'week':
      content = (
        <WeekView onDayHeaderClick={handleDayHeaderClick} onEventsChange={onEventsChange} />
      );
      break;
    case 'day':
      content = <DayView onEventsChange={onEventsChange} />;
      break;
    case 'month':
      content = (
        <MonthView onDayHeaderClick={handleDayHeaderClick} onEventsChange={onEventsChange} />
      );
      break;
    case 'agenda':
      content = <AgendaView onEventsChange={onEventsChange} />;
      break;
    default:
      content = null;
  }

  return (
    <EventCalendarStoreContext.Provider value={store}>
      <TranslationsProvider translations={translations}>
        <div className={clsx(className, 'EventCalendarRoot', 'joy')} ref={forwardedRef} {...other}>
          <aside className="EventCalendarSidePanel">
            <DateNavigator
              visibleDate={visibleDate}
              onNextClick={onNextClick}
              onPreviousClick={onPreviousClick}
              currentView={currentView}
            />
            <section
              className="EventCalendarMonthCalendarPlaceholder"
              // TODO: Add localization
              aria-label="Month calendar"
            >
              Month Calendar
            </section>
            <ResourceLegend />
          </aside>
          <div
            className={clsx(
              'EventCalendarMainPanel',
              currentView === 'month' && 'EventCalendarMainPanel--month',
            )}
          >
            <HeaderToolbar onTodayClick={onTodayClick} />
            <section
              // TODO: Add localization
              className="EventCalendarContent"
              aria-label="Calendar content"
            >
              {content}
            </section>
          </div>
        </div>
      </TranslationsProvider>
    </EventCalendarStoreContext.Provider>
  );
});
