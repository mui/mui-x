'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useAdapter } from '../../primitives/utils/adapter/useAdapter';
import { SchedulerValidDate } from '../../primitives/utils/adapter/types';
import { TimeGrid } from '../../primitives/time-grid';
import { TimeGridEvent } from '../event/TimeGridEvent';
import { AgendaViewProps } from './AgendaView.types';
import { CalendarEvent } from '../models/events';
import { isWeekend } from '../utils/date-utils';
import { useTranslations } from '../utils/TranslationsContext';
import './AgendaView.css';

function getCurrentWeekDays(today: SchedulerValidDate) {
  const startOfWeek = today.startOf('week');
  return Array.from({ length: 7 }, (_, i) => startOfWeek.plus({ days: i }));
}

export const AgendaView = React.forwardRef(function AgendaView(
  props: AgendaViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, className, ...other } = props;

  const adapter = useAdapter();
  const translations = useTranslations();
  const today = adapter.date('2025-05-26');
  const currentWeekDays = getCurrentWeekDays(today);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const headerWrapperRef = React.useRef<HTMLDivElement>(null);

  const eventsByDay = React.useMemo(() => {
    const map = new Map();
    for (const event of events) {
      const dayKey = adapter.format(event.start, 'keyboardDate');
      if (!map.has(dayKey)) {
        map.set(dayKey, []);
      }
      map.get(dayKey).push(event);
    }
    return map;
  }, [adapter, events]);

  return (
    <div ref={forwardedRef} className={clsx('AgendaViewContainer', 'joy', className)} {...other}>
      hey
    </div>
  );
});
