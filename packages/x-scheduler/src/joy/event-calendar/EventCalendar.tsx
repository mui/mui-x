'use client';
import * as React from 'react';
import clsx from 'clsx';
import '../index.css';
import './EventCalendar.css';
import { EventCalendarProps } from './EventCalendar.types';
import { WeekView } from '../week-view/WeekView';
import { ViewSwitcher } from '../view-switcher';

export const EventCalendar = React.forwardRef(function EventCalendar(
  props: EventCalendarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, onEventsChange, className, ...other } = props;

  return (
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
        <header className="EventCalendarToolbar">
          <ViewSwitcher />
        </header>
        <section
          // TODO: Add localization
          className="EventCalendarContent"
          aria-label="Calendar content"
        >
          <WeekView events={events} />
        </section>
      </div>
    </div>
  );
});
