'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { eventCalendarPreferenceSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { MonthViewWeekRowProps } from './MonthViewWeekRow.types';
import { MonthViewCell } from './MonthViewCell';
import { useEventCalendarClasses } from '../../event-calendar/EventCalendarClassesContext';

const FIXED_CELL_WIDTH = 28;

const MonthViewRow = styled(CalendarGrid.DayRow, {
  name: 'MuiEventCalendar',
  slot: 'MonthViewRow',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
  '&[data-show-week-number]': {
    gridTemplateColumns: `${FIXED_CELL_WIDTH}px repeat(auto-fit, minmax(0, 1fr))`,
  },
  '&:not(:last-child)': {
    borderBlockEnd: `1px solid ${theme.palette.divider}`,
  },
}));

const MonthViewWeekNumberCell = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MonthViewWeekNumberCell',
})(({ theme }) => ({
  padding: theme.spacing(1, 0),
  textAlign: 'center',
  fontSize: theme.typography.caption.fontSize,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

export default function MonthViewWeekRow(props: MonthViewWeekRowProps) {
  const { maxEvents, days, occurrencesMap, firstDayRef } = props;

  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const showWeekNumber = useStore(store, eventCalendarPreferenceSelectors.showWeekNumber);
  const translations = useTranslations();
  const classes = useEventCalendarClasses();
  const occurrences = useEventOccurrencesWithDayGridPosition({ days, occurrencesMap });
  const weekNumber = adapter.getWeekNumber(days[0].value);

  const { start, end } = React.useMemo(
    () => ({
      start: days[0].value,
      end: adapter.endOfDay(days[days.length - 1].value),
    }),
    [adapter, days],
  );

  return (
    <MonthViewRow
      className={classes.monthViewRow}
      key={weekNumber}
      start={start}
      end={end}
      data-show-week-number={showWeekNumber || undefined}
    >
      {showWeekNumber && (
        <MonthViewWeekNumberCell
          className={classes.monthViewWeekNumberCell}
          role="rowheader"
          aria-label={translations.weekNumberAriaLabel(weekNumber)}
        >
          {weekNumber}
        </MonthViewWeekNumberCell>
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
    </MonthViewRow>
  );
}
