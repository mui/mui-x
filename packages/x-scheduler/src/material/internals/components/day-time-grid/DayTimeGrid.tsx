'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useStore } from '@base-ui-components/utils/store';
import { useOnEveryMinuteStart } from '../../../../primitives/utils/useOnEveryMinuteStart';
import {
  SchedulerValidDate,
  CalendarEvent,
  CalendarPrimitiveEventData,
} from '../../../../primitives/models';
import { getEventWithLargestRowIndex } from '../../../../primitives/utils/event-utils';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { TimeGrid } from '../../../../primitives/time-grid';
import { DayGrid } from '../../../../primitives/day-grid';
import { DayTimeGridProps } from './DayTimeGrid.types';
import { diffIn, isWeekend } from '../../../../primitives/utils/date-utils';
import { useTranslations } from '../../utils/TranslationsContext';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import { selectors } from '../../../../primitives/use-event-calendar';
import { EventPopoverProvider, EventPopoverTrigger } from '../event-popover';
import { DayGridEvent } from '../event';
import { TimeGridColumn } from './TimeGridColumn';
import './DayTimeGrid.css';

const adapter = getAdapter();

export const DayTimeGrid = React.forwardRef(function DayTimeGrid(
  props: DayTimeGridProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { days, className, ...other } = props;

  const translations = useTranslations();
  const [now, setNow] = React.useState(() => adapter.date());
  useOnEveryMinuteStart(() => setNow(adapter.date()));
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const allDayHeaderWrapperRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

  const { store, instance } = useEventCalendarContext();
  const resourcesByIdMap = useStore(store, selectors.resourcesByIdMap);
  const visibleDate = useStore(store, selectors.visibleDate);
  const hasDayView = useStore(store, selectors.hasDayView);
  const daysWithEvents = useStore(store, selectors.eventsToRenderGroupedByDay, {
    days,
    shouldOnlyRenderEventInOneCell: false,
  });
  const ampm = useStore(store, selectors.ampm);
  const showCurrentTimeIndicator = useStore(store, selectors.showCurrentTimeIndicator);
  const timeFormat = ampm ? 'hoursMinutes12h' : 'hoursMinutes24h';

  const isTodayInView = React.useMemo(
    () => !adapter.isBeforeDay(now, days[0]) && !adapter.isAfterDay(now, days[days.length - 1]),
    [days, now],
  );

  const handleEventChangeFromTimeGridPrimitive = React.useCallback(
    (data: CalendarPrimitiveEventData) => {
      const updatedEvent: CalendarEvent = {
        ...selectors.getEventById(store.state, data.eventId)!,
        start: data.start,
        end: data.end,
      };

      instance.updateEvent(updatedEvent);
    },
    [instance, store],
  );

  useIsoLayoutEffect(() => {
    const body = bodyRef.current;
    const allDayHeader = allDayHeaderWrapperRef.current;
    if (!body || !allDayHeader) {
      return;
    }
    const hasScroll = body.scrollHeight > body.clientHeight;
    allDayHeader.style.setProperty('--has-scroll', hasScroll ? '1' : '0');
  }, [daysWithEvents]);

  const lastIsWeekend = isWeekend(adapter, days[days.length - 1]);

  const shouldHideHour = (hour: number) => {
    if (!isTodayInView || !showCurrentTimeIndicator) {
      return false;
    }
    const slotCenter = adapter.setMinutes(adapter.setHours(now, hour), 0);
    return Math.abs(diffIn(adapter, now, slotCenter, 'minutes')) <= 25;
  };

  const renderHeaderContent = (day: SchedulerValidDate) => (
    <span className="DayTimeGridHeaderContent">
      {/* TODO: Add the 3 letter week day format to the adapter */}
      <span className="DayTimeGridHeaderDayName">{adapter.formatByString(day, 'ccc')}</span>
      <span className="DayTimeGridHeaderDayNumber">{adapter.format(day, 'dayOfMonth')}</span>
    </span>
  );

  return (
    <div
      ref={handleRef}
      className={clsx('DayTimeGridContainer', 'mui-x-scheduler', className)}
      {...other}
    >
      <EventPopoverProvider containerRef={containerRef}>
        <div className="DayTimeGridHeader">
          <div className="DayTimeGridGridRow DayTimeGridHeaderRow" role="row">
            <div className="DayTimeGridAllDayEventsCell" />
            {daysWithEvents.map(({ day }) => (
              <div
                key={day.toString()}
                id={`DayTimeGridHeaderCell-${day.toString()}`}
                role="columnheader"
                aria-label={`${adapter.format(day, 'weekday')} ${adapter.format(day, 'dayOfMonth')}`}
                data-current={adapter.isSameDay(day, now) ? '' : undefined}
              >
                {hasDayView ? (
                  <button
                    type="button"
                    className="DayTimeGridHeaderButton"
                    onClick={(event) => instance.switchToDay(day, event)}
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
        <DayGrid.Root
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
          <DayGrid.Row
            className="DayTimeGridAllDayEventsRow"
            role="row"
            style={{ '--column-count': days.length } as React.CSSProperties}
          >
            {daysWithEvents.map(({ day, allDayEvents }, dayIndex) => (
              <DayGrid.Cell
                key={day.toString()}
                className="DayTimeGridAllDayEventsCell"
                style={
                  {
                    '--row-count': getEventWithLargestRowIndex(allDayEvents),
                  } as React.CSSProperties
                }
                aria-labelledby={`DayTimeGridHeaderCell-${adapter.getDate(day)} DayTimeGridAllDayEventsHeaderCell`}
                role="gridcell"
                data-weekend={isWeekend(adapter, day) ? '' : undefined}
              >
                {allDayEvents.map((event) => {
                  const durationInDays = diffIn(adapter, event.end, day, 'days') + 1;
                  const gridColumnSpan = Math.min(durationInDays, days.length - dayIndex); // Don't exceed available columns
                  const shouldRenderEvent = adapter.isSameDay(event.start, day) || dayIndex === 0;

                  return shouldRenderEvent ? (
                    <EventPopoverTrigger
                      key={`${event.key}-${day.toString()}`}
                      event={event}
                      render={
                        <DayGridEvent
                          event={event}
                          eventResource={resourcesByIdMap.get(event.resource)}
                          variant="allDay"
                          ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
                          gridRow={event.eventRowIndex}
                          columnSpan={gridColumnSpan}
                        />
                      }
                    />
                  ) : (
                    <DayGridEvent
                      key={`invisible-${event.key}-${day.toString()}`}
                      event={event}
                      eventResource={resourcesByIdMap.get(event.resource)}
                      variant="invisible"
                      ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
                      aria-hidden="true"
                      gridRow={event.eventRowIndex}
                    />
                  );
                })}
              </DayGrid.Cell>
            ))}
          </DayGrid.Row>
          <div className="ScrollablePlaceholder" />
        </DayGrid.Root>
        <TimeGrid.Root
          className="DayTimeGridRoot"
          onEventChange={handleEventChangeFromTimeGridPrimitive}
        >
          <TimeGrid.ScrollableContent ref={bodyRef} className="DayTimeGridBody">
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
                {daysWithEvents.map(({ day, events }, index) => (
                  <TimeGridColumn
                    key={day.toString()}
                    day={day}
                    events={events}
                    isToday={adapter.isSameDay(day, now)}
                    index={index}
                    showCurrentTimeIndicator={showCurrentTimeIndicator && isTodayInView}
                  />
                ))}
              </div>
            </div>
          </TimeGrid.ScrollableContent>
        </TimeGrid.Root>
      </EventPopoverProvider>
    </div>
  );
});
