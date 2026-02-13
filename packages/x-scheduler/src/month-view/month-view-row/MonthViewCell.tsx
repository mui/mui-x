'use client';
import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import Button from '@mui/material/Button';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import {
  eventCalendarOccurrencePlaceholderSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import {
  schedulerNowSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { DayGridEvent } from '../../internals/components/event/day-grid-event/DayGridEvent';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { MoreEventsPopoverTrigger } from '../../internals/components/more-events-popover/MoreEventsPopover';
import { formatMonthAndDayOfMonth } from '../../internals/utils/date-utils';
import { isOccurrenceAllDayOrMultipleDay } from '../../internals/utils/event-utils';
import { EventDialogTrigger } from '../../internals/components/event-dialog';
import { useEventDialogContext } from '../../internals/components/event-dialog/EventDialog';
import { useEventCalendarClasses } from '../../event-calendar/EventCalendarClassesContext';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';

const MonthViewCellRoot = styled(CalendarGrid.DayCell, {
  name: 'MuiEventCalendar',
  slot: 'MonthViewCell',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: 'repeat(var(--row-count), minmax(auto, 18px))',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.7, 0.5),
  fontSize: theme.typography.body2.fontSize,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
  '&:not(:first-of-type)': {
    borderInlineStart: `1px solid ${theme.palette.divider}`,
  },
  '&[data-weekend]': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
  '&[data-current]': {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  [`&[data-current] .${eventCalendarClasses.monthViewCellNumber}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  '&[data-other-month]': {
    color: theme.palette.text.disabled,
  },
  // Today button states
  [`&[data-current] > .${eventCalendarClasses.monthViewCellNumberButton} > .${eventCalendarClasses.monthViewCellNumber}`]:
    {
      backgroundColor: 'transparent',
    },
  [`&[data-current] > .${eventCalendarClasses.monthViewCellNumberButton}:hover > .${eventCalendarClasses.monthViewCellNumber}`]:
    {
      backgroundColor: 'transparent',
    },
  [`&[data-current] > .${eventCalendarClasses.monthViewCellNumberButton}:active > .${eventCalendarClasses.monthViewCellNumber}`]:
    {
      backgroundColor: 'transparent',
    },
  [`&[data-current] > .${eventCalendarClasses.monthViewCellNumberButton}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    marginTop: 1,
  },
  [`&[data-current] > .${eventCalendarClasses.monthViewCellNumberButton}:hover`]: {
    backgroundColor: theme.palette.primary.dark,
  },
  [`&[data-current] > .${eventCalendarClasses.monthViewCellNumberButton}:active`]: {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const MonthViewCellNumber = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'MonthViewCellNumber',
})(({ theme }) => ({
  gridRow: 1,
  justifySelf: 'end',
  alignSelf: 'flex-end',
  padding: theme.spacing(0, 0.5),
  borderRadius: theme.shape.borderRadius,
}));

const MonthViewCellNumberButton = styled('button', {
  name: 'MuiEventCalendar',
  slot: 'MonthViewCellNumberButton',
})(({ theme }) => ({
  gridRow: 1,
  justifySelf: 'end',
  width: 'fit-content',
  alignSelf: 'flex-end',
  borderRadius: theme.shape.borderRadius,
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  font: 'inherit',
  color: 'inherit',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:active': {
    backgroundColor: theme.palette.action.selected,
  },
  '&:focus-visible': {
    backgroundColor: theme.palette.action.focus,
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
  '&:focus-visible:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const MonthViewCellEvents = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MonthViewCellEvents',
})(({ theme }) => ({
  position: 'relative',
  display: 'grid',
  gap: theme.spacing(0.5),
}));

const MonthViewMoreEvents = styled(Button, {
  name: 'MuiEventCalendar',
  slot: 'MonthViewMoreEvents',
})(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: '18px',
  paddingInlineStart: theme.spacing(0.5),
  justifyContent: 'flex-start',
  textTransform: 'none',
}));

const MonthViewPlaceholderEventContainer = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MonthViewPlaceholderContainer',
})(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'repeat(var(--row-count), minmax(auto, 18px))',
  gap: theme.spacing(0.5),
}));

export const MonthViewCell = React.forwardRef(function MonthViewCell(
  props: MonthViewCellProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { day, row, maxEvents } = props;

  // Context hooks
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const translations = useTranslations();
  const { onOpen: startEditing } = useEventDialogContext();
  const classes = useEventCalendarClasses();

  // Selector hooks
  const hasDayView = useStore(store, eventCalendarViewSelectors.hasDayView);
  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);
  const isCreatingAnEvent = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell,
    day.value,
  );
  const isToday = useStore(store, schedulerNowSelectors.isCurrentDay, day.value);
  const placeholder = CalendarGrid.usePlaceholderInDay(day.value, row);

  // Ref hooks
  const cellRef = React.useRef<HTMLDivElement | null>(null);
  const handleRef = useMergedRefs(ref, cellRef);

  const isCurrentMonth = adapter.isSameMonth(day.value, visibleDate);
  const isFirstDayOfMonth = adapter.isSameDay(day.value, adapter.startOfMonth(day.value));

  const visibleOccurrences =
    day.withPosition.length > maxEvents
      ? day.withPosition.slice(0, maxEvents - 1)
      : day.withPosition;
  const hiddenCount = day.withPosition.length - visibleOccurrences.length;

  const cellNumberContent = (
    <MonthViewCellNumber className={classes.monthViewCellNumber}>
      {isFirstDayOfMonth
        ? formatMonthAndDayOfMonth(day.value, adapter)
        : adapter.format(day.value, 'dayOfMonth')}
    </MonthViewCellNumber>
  );

  // Day number header + max events
  const rowCount = 1 + maxEvents;

  React.useEffect(() => {
    if (!isCreatingAnEvent || !placeholder || !cellRef.current) {
      return;
    }
    startEditing(cellRef, placeholder);
  }, [isCreatingAnEvent, placeholder, startEditing]);

  return (
    <MonthViewCellRoot
      className={classes.monthViewCell}
      ref={handleRef}
      key={day.key}
      value={day.value}
      data-current={isToday || undefined}
      data-other-month={!isCurrentMonth || undefined}
      data-weekend={isWeekend(adapter, day.value) || undefined}
      lockSurfaceType
      style={{ '--row-count': rowCount } as React.CSSProperties}
    >
      {hasDayView ? (
        <MonthViewCellNumberButton
          type="button"
          className={classes.monthViewCellNumberButton}
          onClick={(event) => store.switchToDay(day.value, event)}
          tabIndex={0}
        >
          {cellNumberContent}
        </MonthViewCellNumberButton>
      ) : (
        cellNumberContent
      )}
      <MonthViewCellEvents className={classes.monthViewCellEvents}>
        {visibleOccurrences.map((occurrence) => {
          if (occurrence.position.isInvisible) {
            return (
              <DayGridEvent key={occurrence.key} occurrence={occurrence} variant="invisible" />
            );
          }

          return (
            <EventDialogTrigger key={occurrence.key} occurrence={occurrence}>
              <DayGridEvent
                occurrence={occurrence}
                variant={
                  isOccurrenceAllDayOrMultipleDay(occurrence, adapter) ? 'filled' : 'compact'
                }
              />
            </EventDialogTrigger>
          );
        })}
        {hiddenCount > 0 && (
          <MoreEventsPopoverTrigger occurrences={day.withPosition} day={day}>
            <MonthViewMoreEvents
              size="small"
              aria-label={translations.hiddenEvents(hiddenCount)}
              className={classes.monthViewMoreEvents}
            >
              {translations.hiddenEvents(hiddenCount)}
            </MonthViewMoreEvents>
          </MoreEventsPopoverTrigger>
        )}
        {placeholder != null && (
          <MonthViewPlaceholderEventContainer className={classes.monthViewPlaceholderContainer}>
            <DayGridEvent occurrence={placeholder} variant="placeholder" />
          </MonthViewPlaceholderEventContainer>
        )}
      </MonthViewCellEvents>
    </MonthViewCellRoot>
  );
});

interface MonthViewCellProps {
  day: useEventOccurrencesWithDayGridPosition.DayData;
  row: useEventOccurrencesWithDayGridPosition.ReturnValue;
  maxEvents: number;
}
