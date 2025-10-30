'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useAdapter, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import {
  eventCalendarOccurrencePlaceholderSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { DayGridEvent } from '../../internals/components/event/day-grid-event/DayGridEvent';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { EventPopoverTrigger } from '../../internals/components/event-popover';
import { MoreEventsPopoverTrigger } from '../../internals/components/more-events-popover/MoreEventsPopover';
import { useEventPopoverContext } from '../../internals/components/event-popover/EventPopover';
import './MonthViewWeekRow.css';

export const MonthViewCell = React.forwardRef(function MonthViewCell(
  props: MonthViewCellProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { day, row, maxEvents } = props;

  // Context hooks
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const translations = useTranslations();
  const { open: startEditing } = useEventPopoverContext();

  // Selector hooks
  const hasDayView = useStore(store, eventCalendarViewSelectors.hasDayView);
  const visibleDate = useStore(store, selectors.visibleDate);
  const isCreatingAnEvent = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.isCreatingInDayCell,
    day.value,
  );
  const placeholder = CalendarGrid.usePlaceholderInDay(day.value, row);

  // Ref hooks
  const cellRef = React.useRef<HTMLDivElement | null>(null);
  const handleRef = useMergedRefs(ref, cellRef);

  const isCurrentMonth = adapter.isSameMonth(day.value, visibleDate);
  const isFirstDayOfMonth = adapter.isSameDay(day.value, adapter.startOfMonth(day.value));
  const isToday = React.useMemo(() => adapter.isSameDay(day.value, adapter.date()), [adapter, day]);

  const visibleOccurrences =
    day.withPosition.length > maxEvents
      ? day.withPosition.slice(0, maxEvents - 1)
      : day.withPosition;
  const hiddenCount = day.withPosition.length - visibleOccurrences.length;

  const cellNumberContent = (
    <span className="MonthViewCellNumber">
      {isFirstDayOfMonth
        ? adapter.formatByString(day.value, adapter.formats.shortDate)
        : adapter.formatByString(day.value, adapter.formats.dayOfMonth)}
    </span>
  );

  // Day number header + max events
  const rowCount = 1 + maxEvents;

  const handleDoubleClick = () => {
    if (!selectors.canCreateNewEvent(store.state)) {
      return;
    }

    store.setOccurrencePlaceholder({
      type: 'creation',
      surfaceType: 'day-grid',
      start: adapter.startOfDay(day.value),
      end: adapter.endOfDay(day.value),
      lockSurfaceType: true,
    });
  };

  React.useEffect(() => {
    if (!isCreatingAnEvent || !placeholder || !cellRef.current) {
      return;
    }
    startEditing(cellRef.current, placeholder);
  }, [isCreatingAnEvent, placeholder, startEditing]);

  return (
    <CalendarGrid.DayCell
      ref={handleRef}
      key={day.key}
      value={day.value}
      data-current={isToday ? '' : undefined}
      className={clsx(
        'MonthViewCell',
        !isCurrentMonth && 'OtherMonth',
        isToday && 'Today',
        isWeekend(adapter, day.value) && 'Weekend',
      )}
      style={{ '--row-count': rowCount } as React.CSSProperties}
      onDoubleClick={handleDoubleClick}
    >
      {hasDayView ? (
        <button
          type="button"
          className="MonthViewCellNumberButton"
          onClick={(event) => store.switchToDay(day.value, event)}
          tabIndex={0}
        >
          {cellNumberContent}
        </button>
      ) : (
        cellNumberContent
      )}
      <div className="MonthViewCellEvents">
        {visibleOccurrences.map((occurrence) => {
          if (occurrence.position.isInvisible) {
            return (
              <DayGridEvent key={occurrence.key} occurrence={occurrence} variant="invisible" />
            );
          }

          return (
            <EventPopoverTrigger
              key={occurrence.key}
              occurrence={occurrence}
              render={
                <DayGridEvent
                  occurrence={occurrence}
                  variant={occurrence.allDay ? 'allDay' : 'compact'}
                />
              }
            />
          );
        })}
        {hiddenCount > 0 && (
          <MoreEventsPopoverTrigger
            occurrences={day.withPosition}
            day={day}
            nativeButton={true}
            render={
              <button
                type="button"
                aria-label={translations.hiddenEvents(hiddenCount)}
                className={clsx('MonthViewMoreEvents', 'Button--small', 'NeutralTextButton')}
              >
                {translations.hiddenEvents(hiddenCount)}
              </button>
            }
          />
        )}
        {placeholder != null && (
          <div className="MonthViewPlaceholderEventContainer">
            <DayGridEvent occurrence={placeholder} variant="placeholder" />
          </div>
        )}
      </div>
    </CalendarGrid.DayCell>
  );
});

interface MonthViewCellProps {
  day: useEventOccurrencesWithDayGridPosition.DayData;
  row: useEventOccurrencesWithDayGridPosition.ReturnValue;
  maxEvents: number;
}
