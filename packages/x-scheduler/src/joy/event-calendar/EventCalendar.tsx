'use client';
import * as React from 'react';
import clsx from 'clsx';
import '../index.css';
import './EventCalendar.css';
import { EventCalendarProps } from './EventCalendar.types';

export const EventCalendar = React.forwardRef(function EventCalendar(
  props: EventCalendarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, onEventsChange, className, ...other } = props;

  return (
    <div
      className={clsx(className, 'EventCalendarRoot', 'mui', 'light')}
      ref={forwardedRef}
      {...other}
    >
      <aside className="EventCalendarSidePanel">
        <span style={{ height: 72, paddingTop: 18 }}>TODO: Time nav</span>
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
          <span style={{ height: 200, paddingTop: 24 }}>TODO: Resource legend</span>
        </section>
      </aside>
      <div className="EventCalendarMainPanel">
        <header className="EventCalendarToolbar">
          <span>TODO: View switch</span>
        </header>
        <section
          className="EventCalendarContent"
          // TODO: Add localization
          aria-label="Calendar content"
        >
          Content: {events.length} events loaded
        </section>
      </div>
    </div>
  );
});
