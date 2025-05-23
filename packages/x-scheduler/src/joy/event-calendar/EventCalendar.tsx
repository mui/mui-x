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
      <div className="EventCalendarSidePanel">
        <span style={{ height: 72, paddingTop: 18 }}>TODO: Time nav</span>
        <div className="EventCalendarMonthCalendarPlaceholder">Month Calendar</div>
        <span style={{ height: 200, paddingTop: 24 }}>TODO: Resource legend</span>
      </div>
      <div className="EventCalendarMainPanel">
        <div className="EventCalendarToolbar">
          <span>TODO: View switch</span>
        </div>
        <div className="EventCalendarContent">Content: {events.length} events loaded</div>
      </div>
    </div>
  );
});
