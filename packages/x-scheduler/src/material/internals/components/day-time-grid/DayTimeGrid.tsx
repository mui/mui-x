'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useForkRef, useModernLayoutEffect } from '@base-ui-components/react/utils';
import { SchedulerValidDate } from '../../../../primitives/models';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { TimeGrid } from '../../../../primitives/time-grid';
import { DayGrid } from '../../../../primitives/day-grid';
import { DayTimeGridProps } from './DayTimeGrid.types';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import { isWeekend } from '../../utils/date-utils';
import { useTranslations } from '../../utils/TranslationsContext';
import { useSelector } from '../../../../base-ui-copy/utils/store';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import { selectors } from '../../../event-calendar/store';
import { CalendarEvent } from '../../../models/events';
import { EventPopoverProvider, EventPopoverTrigger } from '../event-popover';
import './DayTimeGrid.css';
import { DayGridEvent } from '../event';

const adapter = getAdapter();

export const DayTimeGrid = React.forwardRef(function DayTimeGrid(
  props: DayTimeGridProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { days, className, ...other } = props;

  const translations = useTranslations();
  const today = adapter.date();
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const allDayHeaderWrapperRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useForkRef(forwardedRef, containerRef);

  const { store, instance } = useEventCalendarContext();
  const resourcesByIdMap = useSelector(store, selectors.resourcesByIdMap);
  const visibleDate = useSelector(store, selectors.visibleDate);
  const hasDayView = useSelector(store, selectors.hasDayView);
  const daysWithEvents = useSelector(store, selectors.eventsToRenderGroupedByDay, {
    days,
    shouldOnlyRenderEventInOneCell: false,
  });

  interface EventsWithPosition extends CalendarEvent {
    eventRowIndex: number;
  }

  const dayWithEventsGroupedByCategory = React.useMemo(() => {
    return daysWithEvents.map(({ day, rowStartsAt, events }) => {
      let eventRowIndex = rowStartsAt;
      const regularEvents: CalendarEvent[] = [];
      const allDayEvents: EventsWithPosition[] = [];
      for (const event of events) {
        if (event.allDay) {
          allDayEvents.push({ ...event, eventRowIndex });
          eventRowIndex += 1;
        } else {
          regularEvents.push(event);
        }
      }

      return {
        day,
        allDayEvents,
        regularEvents,
      };
    });
  }, [daysWithEvents]);

  const handleEventChangeFromPrimitive = React.useCallback(
    (data: TimeGrid.Root.EventData) => {
      const updatedEvent: CalendarEvent = {
        ...selectors.getEventById(store.state, data.id)!,
        start: data.start,
        end: data.end,
      };

      instance.updateEvent(updatedEvent);
    },
    [instance, store],
  );

  useModernLayoutEffect(() => {
    const body = bodyRef.current;
    const allDayHeader = allDayHeaderWrapperRef.current;
    if (!body || !allDayHeader) {
      return;
    }
    const hasScroll = body.scrollHeight > body.clientHeight;
    allDayHeader.style.setProperty('--has-scroll', hasScroll ? '1' : '0');
  }, [daysWithEvents]);

  const lastIsWeekend = isWeekend(adapter, days[days.length - 1]);

  const renderHeaderContent = (day: SchedulerValidDate) => (
    <span className="DayTimeGridHeaderContent">
      {/* TODO: Add the 3 letter week day format to the adapter */}
      <span className="DayTimeGridHeaderDayName">{adapter.formatByString(day, 'ccc')}</span>
      <span
        className={clsx('DayTimeGridHeaderDayNumber', adapter.isSameDay(day, today) && 'Today')}
      >
        {adapter.format(day, 'dayOfMonth')}
      </span>
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
            {dayWithEventsGroupedByCategory.map(({ day }) => (
              <div
                key={day.toString()}
                id={`DayTimeGridHeaderCell-${day.toString()}`}
                role="columnheader"
                aria-label={`${adapter.format(day, 'weekday')} ${adapter.format(day, 'dayOfMonth')}`}
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
          role="row"
          data-weekend={lastIsWeekend ? '' : undefined}
        >
          <div
            className="DayTimeGridAllDayEventsCell DayTimeGridAllDayEventsHeaderCell"
            role="columnheader"
          >
            {translations.allDay}
          </div>
          <DayGrid.Row
            className="DayTimeGridAllDayEventsRow"
            role="row"
            style={{ '--column-count': days.length } as React.CSSProperties}
          >
            {dayWithEventsGroupedByCategory.map(({ day, allDayEvents }, dayIndex) => (
              <DayGrid.Cell
                key={day.toString()}
                className="DayTimeGridAllDayEventsCell"
                style={
                  {
                    '--row-count': allDayEvents[allDayEvents.length - 1]?.eventRowIndex || 1,
                  } as React.CSSProperties
                }
                aria-labelledby={`DayTimeGridHeaderCell-${adapter.getDate(day)}`}
                role="gridcell"
                data-weekend={isWeekend(adapter, day) ? '' : undefined}
              >
                {allDayEvents.map((event) => {
                  const durationInDays = adapter.startOfDay(event.end).diff(day, 'days').days + 1;
                  const gridColumnSpan = Math.min(durationInDays, days.length - dayIndex); // Don't exceed available columns
                  const shouldRenderEvent = adapter.isSameDay(event.start, day) || dayIndex === 0;

                  return shouldRenderEvent ? (
                    <EventPopoverTrigger
                      key={event.id}
                      event={event}
                      render={
                        <DayGridEvent
                          event={event}
                          eventResource={resourcesByIdMap.get(event.resource)}
                          variant="allDay"
                          ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
                          style={
                            {
                              '--grid-row': event.eventRowIndex,
                              '--grid-column-span': gridColumnSpan,
                            } as React.CSSProperties
                          }
                        />
                      }
                    />
                  ) : (
                    <DayGridEvent
                      event={event}
                      eventResource={resourcesByIdMap.get(event.resource)}
                      variant="invisible"
                      ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
                      aria-hidden="true"
                    />
                  );
                })}
              </DayGrid.Cell>
            ))}
          </DayGrid.Row>
        </DayGrid.Root>
        <TimeGrid.Root className="DayTimeGridRoot" onEventChange={handleEventChangeFromPrimitive}>
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
                    <time className="DayTimeGridTimeAxisText">
                      {hour === 0
                        ? null
                        : adapter.formatByString(adapter.setHours(visibleDate, hour), 'h:mm a')}
                    </time>
                  </div>
                ))}
              </div>
              <div className="DayTimeGridGrid">
                {dayWithEventsGroupedByCategory.map(({ day, regularEvents }) => (
                  <TimeGrid.Column
                    key={day.toString()}
                    value={day}
                    className="DayTimeGridColumn"
                    data-weekend={isWeekend(adapter, day) ? '' : undefined}
                  >
                    {regularEvents.map((event) => (
                      <EventPopoverTrigger
                        key={event.id}
                        event={event}
                        render={
                          <TimeGridEvent
                            event={event}
                            eventResource={resourcesByIdMap.get(event.resource)}
                            variant="regular"
                            ariaLabelledBy={`DayTimeGridHeaderCell-${adapter.getDate(day)}`}
                          />
                        }
                      />
                    ))}
                    <TimeGridEventPlaceholder day={day} />
                  </TimeGrid.Column>
                ))}
              </div>
            </div>
          </TimeGrid.ScrollableContent>
        </TimeGrid.Root>
      </EventPopoverProvider>
    </div>
  );
});

function TimeGridEventPlaceholder({ day }: { day: SchedulerValidDate }) {
  const placeholder = TimeGrid.useColumnPlaceholder();
  const { store } = useEventCalendarContext();
  const event = useSelector(store, selectors.getEventById, placeholder?.id ?? null);
  const resourcesByIdMap = useSelector(store, selectors.resourcesByIdMap);

  const updatedEvent = React.useMemo(() => {
    if (!event || !placeholder) {
      return null;
    }

    return { ...event, start: placeholder.start, end: placeholder.end };
  }, [event, placeholder]);

  if (!updatedEvent) {
    return null;
  }

  return (
    <TimeGridEvent
      event={updatedEvent}
      eventResource={resourcesByIdMap.get(updatedEvent.resource)}
      variant="regular"
      ariaLabelledBy={`DayTimeGridHeaderCell-${adapter.getDate(day)}`}
      readOnly
    />
  );
}
