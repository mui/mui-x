'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { getAdapter } from '../../../primitives/utils/adapter/getAdapter';
import { DayGrid } from '../../../primitives/day-grid';
import { useDayList } from '../../../primitives/use-day-list/useDayList';
import { useEventCalendarContext } from '../../internals/hooks/useEventCalendarContext';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { MonthViewWeekRowProps } from './MonthViewWeekRow.types';
import { selectors } from '../../../primitives/use-event-calendar';
import './MonthViewWeekRow.css';
import { MonthViewCell } from './MonthViewCell';

const adapter = getAdapter();

export default function MonthViewWeekRow(props: MonthViewWeekRowProps) {
  const { maxEvents, week, firstDayRef } = props;

  const { store } = useEventCalendarContext();
  const preferences = useStore(store, selectors.preferences);
  const translations = useTranslations();

  const getDayList = useDayList();
  const days = React.useMemo(
    () => getDayList({ date: week, amount: 'week', excludeWeekends: !preferences.showWeekends }),
    [getDayList, week, preferences.showWeekends],
  );

  const daysWithEvents = useStore(store, selectors.eventsToRenderGroupedByDay, {
    days,
    shouldOnlyRenderEventInOneCell: false,
  });

  const weekNumber = adapter.getWeekNumber(week);

  const { start, end } = React.useMemo(
    () => ({
      start: days[0],
      end: adapter.endOfDay(days[days.length - 1]),
    }),
    [days],
  );

  return (
    <DayGrid.Row
      key={weekNumber}
      start={start}
      end={end}
      className={clsx(
        'MonthViewRow',
        'MonthViewRowGrid',
        preferences.showWeekNumber ? 'WithWeekNumber' : undefined,
      )}
    >
      {preferences.showWeekNumber && (
        <div
          className="MonthViewWeekNumberCell"
          role="rowheader"
          aria-label={translations.weekNumberAriaLabel(weekNumber)}
        >
          {weekNumber}
        </div>
      )}
      {daysWithEvents.map(({ day, events, allDayEvents }, dayIdx) => (
        <MonthViewCell
          ref={dayIdx === 0 ? firstDayRef : undefined}
          key={day.toString()}
          day={day}
          dayIndexInRow={dayIdx}
          rowLength={days.length}
          events={events}
          allDayEvents={allDayEvents}
          maxEvents={maxEvents}
        />
      ))}
    </DayGrid.Row>
  );
}
