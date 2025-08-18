'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useAdapter } from '../../../primitives/utils/adapter/useAdapter';
import { DayGrid } from '../../../primitives/day-grid';
import { useDayList } from '../../../primitives/use-day-list/useDayList';
import { useEventCalendarContext } from '../../internals/hooks/useEventCalendarContext';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { MonthViewWeekRowProps } from './MonthViewWeekRow.types';
import { selectors } from '../../../primitives/use-event-calendar';
import { MonthViewCell } from './MonthViewCell';
import './MonthViewWeekRow.css';

export default function MonthViewWeekRow(props: MonthViewWeekRowProps) {
  const { maxEvents, week, firstDayRef } = props;

  const adapter = useAdapter();
  const { store } = useEventCalendarContext();
  const settings = useStore(store, selectors.settings);

  const translations = useTranslations();

  const getDayList = useDayList();
  const days = React.useMemo(
    () => getDayList({ date: week, amount: 'week', excludeWeekends: settings.hideWeekends }),
    [getDayList, week, settings.hideWeekends],
  );

  const daysWithEvents = useStore(store, selectors.eventsToRenderGroupedByDay, {
    days,
    shouldOnlyRenderEventInOneCell: false,
  });

  const weekNumber = adapter.getWeekNumber(week);

  return (
    <DayGrid.Row key={weekNumber} className="MonthViewRow">
      <div
        className="MonthViewWeekNumberCell"
        role="rowheader"
        aria-label={translations.weekNumberAriaLabel(weekNumber)}
      >
        {weekNumber}
      </div>
      {daysWithEvents.map(({ day, events }, dayIdx) => (
        <MonthViewCell
          key={day.toString()}
          ref={dayIdx === 0 ? firstDayRef : undefined}
          day={day}
          events={events}
          maxEvents={maxEvents}
        />
      ))}
    </DayGrid.Row>
  );
}
