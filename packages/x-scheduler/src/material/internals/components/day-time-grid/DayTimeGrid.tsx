'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useStore } from '@base-ui-components/utils/store';
import { SchedulerValidDate, CalendarEvent } from '../../../../primitives/models';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { TimeGrid } from '../../../../primitives/time-grid';
import { DayTimeGridProps } from './DayTimeGrid.types';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import { isWeekend } from '../../utils/date-utils';
import { useTranslations } from '../../utils/TranslationsContext';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import { selectors } from '../../../../primitives/use-event-calendar';
import { EventPopoverProvider, EventPopoverTrigger } from '../event-popover';
import './DayTimeGrid.css';

const adapter = getAdapter();

export const DayTimeGrid = React.forwardRef(function DayTimeGrid(
  props: DayTimeGridProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { days, className, ...other } = props;

  const translations = useTranslations();
  const today = adapter.date();
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const headerWrapperRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

  const { store, instance } = useEventCalendarContext();
  const getEventsStartingInDay = useStore(store, selectors.getEventsStartingInDay);
  const resourcesByIdMap = useStore(store, selectors.resourcesByIdMap);
  const visibleDate = useStore(store, selectors.visibleDate);
  const hasDayView = useStore(store, selectors.hasDayView);
  const ampm = useStore(store, selectors.ampm);

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

  useIsoLayoutEffect(() => {
    const body = bodyRef.current;
    const header = headerWrapperRef.current;
    if (!body || !header) {
      return;
    }
    const hasScroll = body.scrollHeight > body.clientHeight;
    header.style.setProperty('--has-scroll', hasScroll ? '1' : '0');
  }, [getEventsStartingInDay]);

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
        <TimeGrid.Root className="DayTimeGridRoot" onEventChange={handleEventChangeFromPrimitive}>
          <div ref={headerWrapperRef} className="DayTimeGridHeader">
            <div className="DayTimeGridGridRow DayTimeGridHeaderRow" role="row">
              <div className="DayTimeGridAllDayEventsCell" />
              {days.map((day) => (
                <div
                  key={day.day.toString()}
                  id={`DayTimeGridHeaderCell-${day.day.toString()}`}
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
            <div
              className={clsx('DayTimeGridGridRow', 'DayTimeGridAllDayEventsRow')}
              role="row"
              data-weekend={lastIsWeekend ? '' : undefined}
            >
              <div
                className="DayTimeGridAllDayEventsCell DayTimeGridAllDayEventsHeaderCell"
                role="columnheader"
              >
                {translations.allDay}
              </div>
              {days.map((day) => (
                <div
                  key={day.day.toString()}
                  className="DayTimeGridAllDayEventsCell"
                  aria-labelledby={`DayTimeGridHeaderCell-${day.day.toString()}`}
                  role="gridcell"
                  data-weekend={isWeekend(adapter, day) ? '' : undefined}
                />
              ))}
            </div>
          </div>
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
                {days.map((day) => (
                  <TimeGrid.Column
                    key={day.day.toString()}
                    value={day}
                    className="DayTimeGridColumn"
                    data-weekend={isWeekend(adapter, day) ? '' : undefined}
                  >
                    {getEventsStartingInDay(day).map((event) => (
                      <EventPopoverTrigger
                        key={event.id}
                        event={event}
                        nativeButton={false}
                        render={
                          <TimeGridEvent
                            event={event}
                            eventResource={resourcesByIdMap.get(event.resource)}
                            variant="regular"
                            ariaLabelledBy={`DayTimeGridHeaderCell-${day.day.toString()}`}
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
  const event = useStore(store, selectors.getEventById, placeholder?.id ?? null);
  const resourcesByIdMap = useStore(store, selectors.resourcesByIdMap);

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
      ariaLabelledBy={`DayTimeGridHeaderCell-${day.day.toString()}`}
      readOnly
    />
  );
}
