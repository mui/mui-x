'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useStore } from '@base-ui-components/utils/store';
import { useEventOccurrencesGroupedByDay } from '@mui/x-scheduler-headless/use-event-occurrences-grouped-by-day';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';
import { CalendarProcessedDate } from '@mui/x-scheduler-headless/models';
import { useAdapter, diffIn, isWeekend } from '@mui/x-scheduler-headless/use-adapter';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { DayTimeGridProps } from './DayTimeGrid.types';
import { useTranslations } from '../../utils/TranslationsContext';
import { EventPopoverProvider } from '../event-popover';
import { TimeGridColumn } from './TimeGridColumn';
import { DayGridCell } from './DayGridCell';
import './DayTimeGrid.css';

export const DayTimeGrid = React.forwardRef(function DayTimeGrid(
  props: DayTimeGridProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { days, className, ...other } = props;

  const adapter = useAdapter();
  const translations = useTranslations();
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const allDayHeaderWrapperRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

  const store = useEventCalendarStoreContext();
  const visibleDate = useStore(store, selectors.visibleDate);
  const hasDayView = useStore(store, selectors.hasDayView);
  const now = useStore(store, selectors.nowUpdatedEveryMinute);
  const isMultiDayEvent = useStore(store, selectors.isMultiDayEvent);
  const ampm = useStore(store, selectors.ampm);
  const showCurrentTimeIndicator = useStore(store, selectors.showCurrentTimeIndicator);
  const timeFormat = ampm ? 'hoursMinutes12h' : 'hoursMinutes24h';

  const occurrencesMap = useEventOccurrencesGroupedByDay({ days, renderEventIn: 'every-day' });
  const occurrences = useEventOccurrencesWithDayGridPosition({
    days,
    occurrencesMap,
    shouldAddPosition: isMultiDayEvent,
  });

  const { start, end } = React.useMemo(
    () => ({
      start: days[0].value,
      end: adapter.endOfDay(days[days.length - 1].value),
    }),
    [adapter, days],
  );

  const isTodayInView = React.useMemo(
    () =>
      !adapter.isBeforeDay(now, days[0].value) &&
      !adapter.isAfterDay(now, days[days.length - 1].value),
    [adapter, days, now],
  );

  useIsoLayoutEffect(() => {
    const body = bodyRef.current;
    const allDayHeader = allDayHeaderWrapperRef.current;
    if (!body || !allDayHeader) {
      return;
    }
    const hasScroll = body.scrollHeight > body.clientHeight;
    allDayHeader.style.setProperty('--has-scroll', hasScroll ? '1' : '0');
  }, [occurrencesMap]);

  const lastIsWeekend = isWeekend(adapter, days[days.length - 1].value);

  const shouldHideHour = (hour: number) => {
    if (!isTodayInView || !showCurrentTimeIndicator) {
      return false;
    }
    const slotCenter = adapter.setMinutes(adapter.setHours(now, hour), 0);
    return Math.abs(diffIn(adapter, now, slotCenter, 'minutes')) <= 25;
  };

  const renderHeaderContent = (day: CalendarProcessedDate) => (
    <span className="DayTimeGridHeaderContent">
      {/* TODO: Add the 3 letter week day format to the adapter */}
      <span className="DayTimeGridHeaderDayName">{adapter.formatByString(day.value, 'ccc')}</span>
      <span className="DayTimeGridHeaderDayNumber">{adapter.format(day.value, 'dayOfMonth')}</span>
    </span>
  );

  return (
    <CalendarGrid.Root
      ref={handleRef}
      className={clsx('DayTimeGridContainer', 'mui-x-scheduler', className)}
      {...other}
    >
      <EventPopoverProvider containerRef={containerRef}>
        <div className="DayTimeGridHeader">
          <div className="DayTimeGridGridRow DayTimeGridHeaderRow" role="row">
            <div className="DayTimeGridAllDayEventsCell" />
            {days.map((day) => (
              <div
                key={day.key}
                id={`DayTimeGridHeaderCell-${day.key}`}
                role="columnheader"
                aria-label={`${adapter.format(day.value, 'weekday')} ${adapter.format(day.value, 'dayOfMonth')}`}
                data-current={adapter.isSameDay(day.value, now) ? '' : undefined}
              >
                {hasDayView ? (
                  <button
                    type="button"
                    className="DayTimeGridHeaderButton"
                    onClick={(event) => store.switchToDay(day.value, event)}
                    tabIndex={0}
                  >
                    {renderHeaderContent(day)}
                  </button>
                ) : (
                  renderHeaderContent(day)
                )}
              </div>
            ))}
          </div>
        </div>
        <div
          ref={allDayHeaderWrapperRef}
          className={clsx('DayTimeGridGridRow', 'DayTimeGridAllDayEventsGrid')}
          data-weekend={lastIsWeekend ? '' : undefined}
        >
          <div
            className="DayTimeGridAllDayEventsCell DayTimeGridAllDayEventsHeaderCell"
            id="DayTimeGridAllDayEventsHeaderCell"
            role="columnheader"
          >
            {translations.allDay}
          </div>
          <CalendarGrid.DayRow
            start={start}
            end={end}
            className="DayTimeGridAllDayEventsRow"
            role="row"
            style={{ '--column-count': days.length } as React.CSSProperties}
          >
            {occurrences.days.map((day) => (
              <DayGridCell key={day.key} day={day} row={occurrences} />
            ))}
          </CalendarGrid.DayRow>
          <div className="ScrollablePlaceholder" />
        </div>
        <div className="DayTimeGridRoot">
          <CalendarGrid.ScrollableContent ref={bodyRef} className="DayTimeGridBody">
            <div className="DayTimeGridScrollableContent">
              <div className="DayTimeGridTimeAxis" aria-hidden="true">
                {/* TODO: Handle DST days where there are not exactly 24 hours */}
                {Array.from({ length: 24 }, (_, hour) => (
                  <div
                    key={hour}
                    className="DayTimeGridTimeAxisCell"
                    style={{ '--hour': hour } as React.CSSProperties}
                  >
                    <time
                      className={clsx(
                        'DayTimeGridTimeAxisText',
                        shouldHideHour(hour) ? 'HiddenHourLabel' : undefined,
                      )}
                    >
                      {hour === 0
                        ? null
                        : adapter.format(adapter.setHours(visibleDate, hour), timeFormat)}
                    </time>
                  </div>
                ))}
              </div>
              <div className="DayTimeGridGrid">
                {occurrences.days.map((day, index) => (
                  <TimeGridColumn
                    key={day.key}
                    day={day}
                    isToday={adapter.isSameDay(day.value, now)}
                    index={index}
                    showCurrentTimeIndicator={showCurrentTimeIndicator && isTodayInView}
                  />
                ))}
              </div>
            </div>
          </CalendarGrid.ScrollableContent>
        </div>
      </EventPopoverProvider>
    </CalendarGrid.Root>
  );
});
