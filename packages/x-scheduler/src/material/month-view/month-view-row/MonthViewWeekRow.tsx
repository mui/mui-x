'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { getAdapter } from '../../../primitives/utils/adapter/getAdapter';
import { CalendarGrid } from '../../../primitives/calendar-grid';
import { useEventCalendarStoreContext } from '../../../primitives/utils/useEventCalendarStoreContext';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { MonthViewWeekRowProps } from './MonthViewWeekRow.types';
import { useEventOccurrencesWithDayGridPosition } from '../../../primitives/use-event-occurrences-with-day-grid-position';
import { selectors } from '../../../primitives/use-event-calendar';
import { MonthViewCell } from './MonthViewCell';
import './MonthViewWeekRow.css';

const adapter = getAdapter();

export default function MonthViewWeekRow(props: MonthViewWeekRowProps) {
  const { maxEvents, days, occurrencesMap, firstDayRef } = props;

  const store = useEventCalendarStoreContext();
  const preferences = useStore(store, selectors.preferences);
  const translations = useTranslations();
  const occurrences = useEventOccurrencesWithDayGridPosition({ days, occurrencesMap });
  const weekNumber = adapter.getWeekNumber(days[0].value);

  const { start, end } = React.useMemo(
    () => ({
      start: days[0].value,
      end: adapter.endOfDay(days[days.length - 1].value),
    }),
    [days],
  );

  return (
    <CalendarGrid.DayRow
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
      {occurrences.days.map((day, dayIdx) => (
        <MonthViewCell
          ref={dayIdx === 0 ? firstDayRef : undefined}
          key={day.key}
          day={day}
          maxEvents={maxEvents}
          row={occurrences}
        />
      ))}
    </CalendarGrid.DayRow>
  );
}
