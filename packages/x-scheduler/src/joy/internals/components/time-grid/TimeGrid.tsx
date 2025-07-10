'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useForkRef, useModernLayoutEffect } from '@base-ui-components/react/utils';
import { SchedulerValidDate } from '../../../../primitives/models';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { TimeGrid as TimeGridPrimitive } from '../../../../primitives/time-grid';
import { TimeGridProps } from './TimeGrid.types';
import { CalendarEvent } from '../../../models/events';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';
import { isWeekend } from '../../utils/date-utils';
import { useTranslations } from '../../utils/TranslationsContext';
import { useSelector } from '../../../../base-ui-copy/utils/store';
import { useEventCalendarStore } from '../../hooks/useEventCalendarStore';
import { selectors } from '../../../event-calendar/store';
import { EventPopoverProvider } from '../../utils/EventPopoverProvider';
import './TimeGrid.css';

const adapter = getAdapter();

export const TimeGrid = React.forwardRef(function TimeGrid(
  props: TimeGridProps,
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
    <span className="TimeGridHeaderContent">
      {/* TODO: Add the 3 letter week day format to the adapter */}
      <span className="TimeGridHeaderDayName">{adapter.formatByString(day, 'ccc')}</span>
      <span className={clsx('TimeGridHeaderDayNumber', adapter.isSameDay(day, today) && 'Today')}>
        {adapter.format(day, 'dayOfMonth')}
      </span>
    </span>
  );

  return (
    <div ref={handleRef} className={clsx('TimeGridContainer', 'joy', className)} {...other}>
      <EventPopoverProvider containerRef={containerRef} onEventsChange={onEventsChange}>
        {({ onEventClick }) => (
          <TimeGridPrimitive.Root className="TimeGridRoot">
            <div ref={headerWrapperRef} className="TimeGridHeader">
              <div className="TimeGridGridRow TimeGridHeaderRow" role="row">
                <div className="TimeGridAllDayEventsCell" />
                {days.map((day) => (
                  <div
                    key={day.day.toString()}
                    id={`TimeGridHeaderCell-${day.day.toString()}`}
                    role="columnheader"
                    aria-label={`${adapter.format(day, 'weekday')} ${adapter.format(day, 'dayOfMonth')}`}
                  >
                    {onDayHeaderClick ? (
                      <button
                        type="button"
                        className="TimeGridHeaderButton"
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
                className={clsx('TimeGridGridRow', 'TimeGridAllDayEventsRow')}
                role="row"
                data-weekend={lastIsWeekend ? '' : undefined}
              >
                <div
                  className="TimeGridAllDayEventsCell TimeGridAllDayEventsHeaderCell"
                  role="columnheader"
                >
                  {translations.allDay}
                </div>
                {days.map((day) => (
                  <div
                    key={day.day.toString()}
                    className="TimeGridAllDayEventsCell"
                    aria-labelledby={`TimeGridHeaderCell-${day.day.toString()}`}
                    role="gridcell"
                    data-weekend={isWeekend(adapter, day) ? '' : undefined}
                  />
                ))}
              </div>
            </div>
            <div ref={bodyRef} className="TimeGridBody">
              <div className="TimeGridScrollableContent">
                <div className="TimeGridTimeAxis" aria-hidden="true">
                  {/* TODO: Handle DST days where there are not exactly 24 hours */}
                  {Array.from({ length: 24 }, (_, hour) => (
                    <div
                      key={hour}
                      className="TimeGridTimeAxisCell"
                      style={{ '--hour': hour } as React.CSSProperties}
                    >
                      <time className="TimeGridTimeAxisText">
                        {hour === 0
                          ? null
                          : adapter.formatByString(
                              adapter.setHours(adapter.startOfDay(today), hour),
                              'h:mm a',
                            )}
                      </time>
                    </div>
                  ))}
                </div>
                <div className="TimeGridGrid">
                  {days.map((day) => (
                    <TimeGridPrimitive.Column
                      key={day.day.toString()}
                      value={day}
                      className="TimeGridColumn"
                      data-weekend={isWeekend(adapter, day) ? '' : undefined}
                    >
                      {getEventsStartingInDay(day).map((event: CalendarEvent) => (
                        <TimeGridEvent
                          key={event.id}
                          event={event}
                          eventResource={resourcesByIdMap.get(event.resource)}
                          variant="regular"
                          ariaLabelledBy={`TimeGridHeaderCell-${day.day.toString()}`}
                          onEventClick={onEventClick}
                        />
                      ))}
                    </TimeGridPrimitive.Column>
                  ))}
                </div>
              </div>
            </div>
          </TimeGridPrimitive.Root>
        )}
      </EventPopoverProvider>
    </div>
  );
});
