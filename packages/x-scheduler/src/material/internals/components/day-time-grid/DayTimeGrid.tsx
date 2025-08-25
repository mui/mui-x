'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useStore } from '@base-ui-components/utils/store';
import { SchedulerValidDate, CalendarEvent } from '../../../../primitives/models';
import { getEventWithLargestRowIndex } from '../../../../primitives/utils/event-utils';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { TimeGrid } from '../../../../primitives/time-grid';
import { DayGrid } from '../../../../primitives/day-grid';
import { DayTimeGridProps } from './DayTimeGrid.types';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import { isWeekend } from '../../../../primitives/utils/date-utils';
import { useTranslations } from '../../utils/TranslationsContext';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import { selectors } from '../../../../primitives/use-event-calendar';
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

  const handleEventChangeFromPrimitive = React.useCallback(
    (data: TimeGrid.Root.EventData) => {
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
            {daysWithEvents.map(({ day }) => (
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
                  const durationInDays = adapter.startOfDay(event.end).diff(day, 'days').days + 1;
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
                      key={`invisible-${event.key}-${day.toString()}`}
                      event={event}
                      eventResource={resourcesByIdMap.get(event.resource)}
                      variant="invisible"
                      ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
                      aria-hidden="true"
                      style={
                        {
                          '--grid-row': event.eventRowIndex,
                        } as React.CSSProperties
                      }
                    />
                  );
                })}
              </DayGrid.Cell>
            ))}
          </DayGrid.Row>
          <div className="ScrollablePlaceholder" />
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
                        : adapter.format(
                            adapter.setHours(visibleDate, hour),
                            ampm ? 'hoursMinutes12h' : 'hoursMinutes24h',
                          )}
                    </time>
                  </div>
                ))}
              </div>
              <div className="DayTimeGridGrid">
                {daysWithEvents.map(({ day, events: regularEvents }) => (
                  <TimeGrid.Column
                    key={day.day.toString()}
                    start={adapter.startOfDay(day)}
                    end={adapter.endOfDay(day)}
                    className="DayTimeGridColumn"
                    data-weekend={isWeekend(adapter, day) ? '' : undefined}
                  >
                    {regularEvents.map((event) => (
                      <EventPopoverTrigger
                        key={event.key}
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
  const event = useStore(store, selectors.getEventById, placeholder?.eventId ?? null);
  const resourcesByIdMap = useStore(store, selectors.resourcesByIdMap);

  const updatedEvent = React.useMemo(() => {
    if (!event || !placeholder) {
      return null;
    }

    return { ...event, start: placeholder.start, end: placeholder.end, readOnly: true };
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
    />
  );
}
