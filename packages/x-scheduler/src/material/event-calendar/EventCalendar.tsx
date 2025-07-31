'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { EventCalendarProps } from './EventCalendar.types';
import { WeekView } from '../week-view/WeekView';
import { AgendaView } from '../agenda-view';
import { DayView } from '../day-view/DayView';
import { TranslationsProvider } from '../internals/utils/TranslationsContext';
import { selectors } from './store';
import { EventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { MonthView } from '../month-view';
import { HeaderToolbar } from '../internals/components/header-toolbar';
import { DateNavigator } from '../internals/components/date-navigator';
import { ResourceLegend } from '../internals/components/resource-legend';
import { useEventCalendar } from './useEventCalendar';
import '../index.css';
import './EventCalendar.css';

export const EventCalendar = React.forwardRef(function EventCalendar(
  props: EventCalendarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    events: eventsProp,
    onEventsChange,
    resources: resourcesProp,
    view: viewProp,
    defaultView,
    views,
    visibleDate: visibleDateProp,
    defaultVisibleDate,
    onVisibleDateChange,
    areEventsDraggable,
    areEventsResizable,
    ampm,
    translations,
    className,
    ...other
  } = props;

  const { store, contextValue } = useEventCalendar({
    events: eventsProp,
    onEventsChange,
    resources: resourcesProp,
    view: viewProp,
    defaultView,
    views,
    visibleDate: visibleDateProp,
    defaultVisibleDate,
    onVisibleDateChange,
    areEventsDraggable,
    areEventsResizable,
    ampm,
  });

  const view = useStore(store, selectors.view);

  let content: React.ReactNode;
  switch (view) {
    case 'week':
      content = <WeekView />;
      break;
    case 'day':
      content = <DayView />;
      break;
    case 'month':
      content = <MonthView />;
      break;
    case 'agenda':
      content = <AgendaView />;
      break;
    default:
      content = null;
  }

  return (
    <EventCalendarContext.Provider value={contextValue}>
      <TranslationsProvider translations={translations}>
        <div
          className={clsx(className, 'EventCalendarRoot', 'mui-x-scheduler')}
          ref={forwardedRef}
          {...other}
        >
          <aside className="EventCalendarSidePanel">
            <DateNavigator />
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
              view === 'month' && 'EventCalendarMainPanel--month',
            )}
          >
            <HeaderToolbar />
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
    </EventCalendarContext.Provider>
  );
});
