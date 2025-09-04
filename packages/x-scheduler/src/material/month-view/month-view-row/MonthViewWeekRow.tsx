'use client';
import * as React from 'react';
import { getAdapter } from '../../../primitives/utils/adapter/getAdapter';
import { DayGrid } from '../../../primitives/day-grid';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { MonthViewWeekRowProps } from './MonthViewWeekRow.types';
import { useAddRowPlacementToEventOccurrences } from '../../../primitives/use-row-event-occurrences';
import './MonthViewWeekRow.css';
import { MonthViewCell } from './MonthViewCell';

const adapter = getAdapter();

export default function MonthViewWeekRow(props: MonthViewWeekRowProps) {
  const { maxEvents, days, occurrencesMap, firstDayRef } = props;

  const translations = useTranslations();
  const daysWithEvents = useAddRowPlacementToEventOccurrences({ days, occurrencesMap });
  const weekNumber = adapter.getWeekNumber(days[0].value);

  const { start, end } = React.useMemo(
    () => ({
      start: days[0].value,
      end: adapter.endOfDay(days[days.length - 1].value),
    }),
    [days],
  );

  return (
    <DayGrid.Row key={weekNumber} start={start} end={end} className="MonthViewRow">
      <div
        className="MonthViewWeekNumberCell"
        role="rowheader"
        aria-label={translations.weekNumberAriaLabel(weekNumber)}
      >
        {weekNumber}
      </div>
      {daysWithEvents.map((day, dayIdx) => (
        <MonthViewCell
          ref={dayIdx === 0 ? firstDayRef : undefined}
          key={day.key}
          day={day}
          maxEvents={maxEvents}
        />
      ))}
    </DayGrid.Row>
  );
}
