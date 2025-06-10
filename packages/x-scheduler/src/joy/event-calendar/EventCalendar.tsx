'use client';
import * as React from 'react';
import clsx from 'clsx';
import { SchedulerValidDate } from '@mui/x-scheduler/primitives/utils/adapter/types';
import { EventCalendarProps } from './EventCalendar.types';
import { ViewType } from '../models/views';
import { WeekView } from '../week-view/WeekView';
import { DayView } from '../day-view/DayView';
import { HeaderToolbar } from '../header-toolbar';
import { TranslationsProvider } from '../utils/TranslationsContext';
import '../index.css';
import './EventCalendar.css';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';

const adapter = getAdapter();

export const EventCalendar = React.forwardRef(function EventCalendar(
  props: EventCalendarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, onEventsChange, translations, className, ...other } = props;

  const [view, setView] = React.useState<ViewType>('week');
  const [selectedDay, setSelectedDay] = React.useState<SchedulerValidDate>(adapter.date());

  const handleDayHeaderClick = React.useCallback(
    (day: SchedulerValidDate) => {
      setSelectedDay(day);
      setView('day');
    },
    [setSelectedDay, setView],
  );

  let content: React.ReactNode;
  switch (view) {
    case 'week':
      content = <WeekView events={events} onDayHeaderClick={handleDayHeaderClick} />;
      break;
    case 'day':
      content = <DayView events={events} day={selectedDay} />;
      break;
    case 'month':
      content = <div>TODO: Month view</div>;
      break;
    case 'agenda':
      content = <div>TODO: Agenda view</div>;
      break;
    default:
      content = null;
  }

  return (
    <TranslationsProvider translations={translations}>
      <div
        className={clsx(className, 'EventCalendarRoot', 'joy', 'light')}
        ref={forwardedRef}
        {...other}
      >
        <aside className="EventCalendarSidePanel">
          <span style={{ display: 'flex', alignItems: 'center', height: 42 }}>TODO: Time nav</span>
          <section
            className="EventCalendarMonthCalendarPlaceholder"
            // TODO: Add localization
            aria-label="Month calendar"
          >
            Month Calendar
          </section>
          <section
            // TODO: Add localization
            aria-label="Resource legend"
          >
            <span>TODO: Resource legend</span>
          </section>
        </aside>
        <div className="EventCalendarMainPanel">
          <HeaderToolbar onTodayClick={() => {}} selectedView={view} setSelectedView={setView} />
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
  );
});
