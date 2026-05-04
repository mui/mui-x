'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import { warnOnce } from '@mui/x-internals/warning';
import Button from '@mui/material/Button';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import {
  eventCalendarOccurrencePlaceholderSelectors,
  eventCalendarOccurrencePositionSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import {
  schedulerNowSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';
import { DayGridEvent } from '../../internals/components/event/day-grid-event/DayGridEvent';
import { MoreEventsPopoverTrigger } from '../../internals/components/more-events-popover/MoreEventsPopover';
import { formatMonthAndDayOfMonth } from '../../internals/utils/date-utils';
import { isOccurrenceAllDayOrMultipleDay } from '../../internals/utils/event-utils';
import { EventDialogTrigger } from '../../internals/components/event-dialog';
import { useEventDialogContext } from '../../internals/components/event-dialog/EventDialog';
import { useEventCalendarStyledContext } from '../../event-calendar/EventCalendarStyledContext';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';
import { EventSkeleton } from '../../internals/components/event-skeleton';
import { getCellFocusBackground } from '../../internals/utils/tokens';

const MonthViewCellRoot = styled(CalendarGrid.DayCell, {
  name: 'MuiEventCalendar',
  slot: 'MonthViewCell',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: 'repeat(var(--row-count), minmax(auto, 18px))',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  fontSize: theme.typography.body2.fontSize,
  lineHeight: '18px',
  borderInlineStart: `1px solid transparent`,
  '&:not(:first-of-type)': {
    borderInlineStartColor: (theme.vars || theme).palette.divider,
  },
  '&[data-weekend]': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
    color: (theme.vars || theme).palette.text.primary,
  },
  '&[data-current]': {
    backgroundColor: theme.alpha((theme.vars || theme).palette.primary.light, 0.05),
  },
  [`&[data-current] .${eventCalendarClasses.monthViewCellNumber}`]: {
    backgroundColor: (theme.vars || theme).palette.primary.main,
    color: (theme.vars || theme).palette.primary.contrastText,
  },
  '&[data-other-month]': {
    color: (theme.vars || theme).palette.text.disabled,
  },
  '&:focus-visible': {
    outline: 'none',
    backgroundColor: getCellFocusBackground(theme),
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
    backgroundColor: (theme.vars || theme).palette.primary.main,
    color: (theme.vars || theme).palette.primary.contrastText,
    marginTop: 1,
  },
  [`&[data-current] > .${eventCalendarClasses.monthViewCellNumberButton}:hover`]: {
    backgroundColor: (theme.vars || theme).palette.primary.dark,
  },
  [`&[data-current] > .${eventCalendarClasses.monthViewCellNumberButton}:active`]: {
    backgroundColor: (theme.vars || theme).palette.primary.dark,
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
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
  '&:active': {
    backgroundColor: (theme.vars || theme).palette.action.selected,
  },
  '&:focus-visible': {
    backgroundColor: getCellFocusBackground(theme),
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: 2,
  },
  '&:focus-visible:hover': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
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
  color: (theme.vars || theme).palette.text.secondary,
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

interface MonthViewCellEventProps {
  occurrenceKey: string;
  firstLane: number;
  cellSpan: number;
  isInvisible: boolean;
}

/**
 * Leaf component for one event inside a month cell. Subscribes to a single occurrence
 * via `occurrenceByKey` so it re-renders only when that specific event changes.
 * `firstLane`/`cellSpan`/`isInvisible` are primitive props from the parent's day-layout
 * (reference-stable when the day's content is unchanged), so the `React.memo` skips
 * re-renders when only an unrelated day changed.
 */
const MonthViewCellEvent = React.memo(function MonthViewCellEvent(props: MonthViewCellEventProps) {
  const { occurrenceKey, firstLane, cellSpan, isInvisible } = props;
  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();
  const occurrence = useStore(
    store,
    eventCalendarOccurrencePositionSelectors.occurrenceByKey,
    occurrenceKey,
  );

  if (!occurrence) {
    return null;
  }

  if (isInvisible) {
    return (
      <DayGridEvent
        occurrence={occurrence}
        variant="invisible"
        firstLane={firstLane}
        cellSpan={cellSpan}
      />
    );
  }

  return (
    <EventDialogTrigger occurrence={occurrence}>
      <DayGridEvent
        occurrence={occurrence}
        variant={isOccurrenceAllDayOrMultipleDay(occurrence, adapter) ? 'filled' : 'compact'}
        firstLane={firstLane}
        cellSpan={cellSpan}
      />
    </EventDialogTrigger>
  );
});

export const MonthViewCell = React.forwardRef(function MonthViewCell(
  props: MonthViewCellProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { day, maxEvents } = props;

  // Context hooks
  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();
  const { classes, localeText } = useEventCalendarStyledContext();
  const { onOpen: startEditing } = useEventDialogContext();

  // Selector hooks
  const hasDayView = useStore(store, eventCalendarViewSelectors.hasDayView);
  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);
  const isCreatingAnEvent = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell,
    day.value,
  );
  const isToday = useStore(store, schedulerNowSelectors.isCurrentDay, day.value);
  const isLoading = useStore(store, schedulerOtherSelectors.isLoading);
  const dayLayout = useStore(
    store,
    eventCalendarOccurrencePositionSelectors.dayGridLayoutForDay,
    day.key,
  );
  const placeholder = CalendarGrid.usePlaceholderInDay(day, maxEvents);

  // Ref hooks
  const cellRef = React.useRef<HTMLDivElement | null>(null);
  const handleRef = useMergedRefs(ref, cellRef);

  const isCurrentMonth = adapter.isSameMonth(day.value, visibleDate);
  const isFirstDayOfMonth = adapter.isSameDay(day.value, adapter.startOfMonth(day.value));

  const orderedKeys = dayLayout?.orderedKeys ?? EMPTY_ARRAY;
  const visibleKeys =
    orderedKeys.length > maxEvents ? orderedKeys.slice(0, maxEvents - 1) : orderedKeys;
  const hiddenCount = orderedKeys.length - visibleKeys.length;

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
    startEditing(cellRef, placeholder.occurrence);
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
          tabIndex={-1}
        >
          {cellNumberContent}
        </MonthViewCellNumberButton>
      ) : (
        cellNumberContent
      )}
      <MonthViewCellEvents className={classes.monthViewCellEvents}>
        {isLoading && <EventSkeleton data-variant="day-grid" />}
        {!isLoading &&
          visibleKeys.map((occurrenceKey) => {
            const slot = dayLayout?.slotByKey.get(occurrenceKey);
            if (!slot) {
              if (process.env.NODE_ENV !== 'production') {
                warnOnce(
                  `MUI X Scheduler: occurrence "${occurrenceKey}" is in \`orderedKeys\` for day "${day.key}" ` +
                    'but missing from `slotByKey`. The event will not render. This is an internal bug — please file an issue.',
                );
              }
              return null;
            }
            return (
              <MonthViewCellEvent
                key={occurrenceKey}
                occurrenceKey={occurrenceKey}
                firstLane={slot.firstLane}
                cellSpan={slot.cellSpan}
                isInvisible={slot.isInvisible}
              />
            );
          })}
        {hiddenCount > 0 && (
          <MoreEventsPopoverTrigger day={day}>
            <MonthViewMoreEvents
              size="small"
              aria-label={localeText.hiddenEvents(hiddenCount)}
              className={classes.monthViewMoreEvents}
            >
              {localeText.hiddenEvents(hiddenCount)}
            </MonthViewMoreEvents>
          </MoreEventsPopoverTrigger>
        )}
        {placeholder != null && (
          <MonthViewPlaceholderEventContainer className={classes.monthViewPlaceholderContainer}>
            <DayGridEvent
              occurrence={placeholder.occurrence}
              variant="placeholder"
              firstLane={placeholder.firstLane}
              cellSpan={placeholder.cellSpan}
            />
          </MonthViewPlaceholderEventContainer>
        )}
      </MonthViewCellEvents>
    </MonthViewCellRoot>
  );
});

interface MonthViewCellProps {
  day: SchedulerProcessedDate;
  maxEvents: number;
}
