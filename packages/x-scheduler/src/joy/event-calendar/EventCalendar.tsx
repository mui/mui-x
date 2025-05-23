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
    <div className="mui light">
      <div className={clsx(className, 'EventCalendar')} ref={forwardedRef} {...other}>
        HELLO WORLD ({events.length} events loaded)
      </div>
    </div>
  );
});
