'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { EventCalendarProps } from './EventCalendar.types';
import { WeekView } from '../week-view/WeekView';
import { AgendaView } from '../agenda-view';
import { DayView } from '../day-view/DayView';
import { TranslationsProvider } from '../internals/utils/TranslationsContext';
import { EventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { MonthView } from '../month-view';
import { HeaderToolbar } from '../internals/components/header-toolbar';
import { DateNavigator } from '../internals/components/date-navigator';
import { ResourceLegend } from '../internals/components/resource-legend';
import { useEventCalendar, selectors } from '../../primitives/use-event-calendar';
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
    calendarViews,
    timelineViews,
    visibleDate: visibleDateProp,
    defaultVisibleDate,
    onVisibleDateChange,
    areEventsDraggable,
    areEventsResizable,
    ampm,
    enableTimeline,
    // TODO: Move inside useEventCalendar so that standalone view can benefit from it (#19293).
    translations,
    className,
    ...other
  } = props;

  const contextValue = useEventCalendar({
    events: eventsProp,
    onEventsChange,
    resources: resourcesProp,
    view: viewProp,
    defaultView,
    calendarViews,
    timelineViews,
    visibleDate: visibleDateProp,
    defaultVisibleDate,
    onVisibleDateChange,
    areEventsDraggable,
    areEventsResizable,
    ampm,
    enableTimeline,
  });

  const view = useStore(contextValue.store, selectors.view);
  const layoutMode = useStore(contextValue.store, selectors.layoutMode);

  let content: React.ReactNode;
  if (layoutMode === 'calendar') {
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
  } else {
    content = <div>Timeline View</div>;
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
