'use client';
import * as React from 'react';
import clsx from 'clsx';
import '../index.css';
import './EventCalendar.css';
import { EventCalendarProps } from './EventCalendar.types';
import { WeekView } from '../week-view/WeekView';

export const EventCalendar = React.forwardRef(function EventCalendar(
  props: EventCalendarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, onEventsChange, className, ...other } = props;

  return (
    <div
      className={clsx('mui', 'light', 'joy', 'EventCalendar', className)}
      ref={forwardedRef}
      {...other}
    >
      <WeekView events={events} />
    </div>
  );
});
