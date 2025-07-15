'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useForkRef, useModernLayoutEffect } from '@base-ui-components/react/utils';
import { SchedulerValidDate } from '../../../../primitives/models';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { TimeGrid } from '../../../../primitives/time-grid';
import { DayTimeGridProps } from './DayTimeGrid.types';
import { CalendarEvent } from '../../../models/events';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import { isWeekend } from '../../utils/date-utils';
import { useTranslations } from '../../utils/TranslationsContext';
import { useSelector } from '../../../../base-ui-copy/utils/store';
import { useEventCalendarStore } from '../../hooks/useEventCalendarStore';
import { selectors } from '../../../event-calendar/store';
import { EventPopoverProvider } from '../../utils/EventPopoverProvider';
import './DayTimeGrid.css';

const adapter = getAdapter();

export const DayTimeGrid = React.forwardRef(function DayTimeGrid(
  props: DayTimeGridProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { days, className, onDayHeaderClick, onEventsChange, ...other } = props;

  const translations = useTranslations();
  const today = adapter.date();
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const headerWrapperRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useForkRef(forwardedRef, containerRef);

  const store = useEventCalendarStore();
  const getEventsStartingInDay = useSelector(store, selectors.getEventsStartingInDay);
  const resourcesByIdMap = useSelector(store, selectors.resourcesByIdMap);
  const visibleDate = useSelector(store, selectors.visibleDate);

  useModernLayoutEffect(() => {
    const body = bodyRef.current;
    const header = headerWrapperRef.current;
    if (!body || !header) {
      return;
    }
    const hasScroll = body.scrollHeight > body.clientHeight;
    header.style.setProperty('--has-scroll', hasScroll ? '1' : '0');
  }, [getEventsStartingInDay]);

  const lastIsWeekend = isWeekend(adapter, days[days.length - 1]);

  const handleHeaderClick = React.useCallback(
    (day: SchedulerValidDate) => (event: React.MouseEvent) => {
      onDayHeaderClick?.(day, event);
    },
    [onDayHeaderClick],
  );

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
    <div ref={handleRef} className={clsx('DayTimeGridContainer', 'joy', className)} {...other}>
      <EventPopoverProvider containerRef={containerRef} onEventsChange={onEventsChange}>
        {({ onEventClick }) => (
          <TimeGrid.Root className="DayTimeGridRoot">
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
                    {onDayHeaderClick ? (
                      <button
                        type="button"
                        className="DayTimeGridHeaderButton"
                        onClick={handleHeaderClick(day)}
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
            <div ref={bodyRef} className="DayTimeGridBody">
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
                  {days.map((day) => (
                    <TimeGrid.Column
                      key={day.day.toString()}
                      value={day}
                      className="DayTimeGridColumn"
                      data-weekend={isWeekend(adapter, day) ? '' : undefined}
                    >
                      {getEventsStartingInDay(day).map((event: CalendarEvent) => (
                        <TimeGridEvent
                          key={event.id}
                          event={event}
                          eventResource={resourcesByIdMap.get(event.resource)}
                          variant="regular"
                          ariaLabelledBy={`DayTimeGridHeaderCell-${day.day.toString()}`}
                          onEventClick={onEventClick}
                        />
                      ))}
                    </TimeGrid.Column>
                  ))}
                </div>
              </div>
            </div>
          </TimeGrid.Root>
        )}
      </EventPopoverProvider>
    </div>
  );
});
