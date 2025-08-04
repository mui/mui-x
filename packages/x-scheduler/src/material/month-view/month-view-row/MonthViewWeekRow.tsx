'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { SchedulerValidDate } from '../../../primitives/models';
import { getAdapter } from '../../../primitives/utils/adapter/getAdapter';
import { DayGrid } from '../../../primitives/day-grid';
import { useDayList } from '../../../primitives/use-day-list/useDayList';
import { useEventCalendarContext } from '../../internals/hooks/useEventCalendarContext';
import { DayGridEvent } from '../../internals/components/event/day-grid-event/DayGridEvent';
import { isWeekend } from '../../internals/utils/date-utils';
import { EventPopoverTrigger } from '../../internals/components/event-popover';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { MonthViewWeekRowProps } from './MonthViewWeekRow.types';
import { selectors } from '../../../primitives/use-event-calendar';
import './MonthViewWeekRow.css';

const adapter = getAdapter();

export default function MonthViewWeekRow(props: MonthViewWeekRowProps) {
  const { maxEvents, week, firstDayRef } = props;

  const { store, instance } = useEventCalendarContext();
  const resourcesByIdMap = useStore(store, selectors.resourcesByIdMap);
  const hasDayView = useStore(store, selectors.hasDayView);
  const visibleDate = useStore(store, selectors.visibleDate);
  const today = adapter.date();
  const translations = useTranslations();

  const getDayList = useDayList();
  const days = React.useMemo(() => getDayList({ date: week, amount: 7 }), [getDayList, week]);

  const daysWithEvents = useStore(store, selectors.eventsToRenderGroupedByDay, {
    days,
    shouldOnlyRenderEventInOneCell: false,
  });

  const weekNumber = adapter.getWeekNumber(week);

  const renderCellNumberContent = (day: SchedulerValidDate) => {
    const isFirstDayOfMonth = adapter.isSameDay(day, adapter.startOfMonth(day));
    return (
      <span className="MonthViewCellNumber">
        {isFirstDayOfMonth
          ? adapter.formatByString(day, adapter.formats.shortDate)
          : adapter.formatByString(day, adapter.formats.dayOfMonth)}
      </span>
    );
  };

  return (
    <DayGrid.Row key={weekNumber} className="MonthViewRow">
      <div
        className="MonthViewWeekNumberCell"
        role="rowheader"
        aria-label={translations.weekNumberAriaLabel(weekNumber)}
      >
        {weekNumber}
      </div>
      {daysWithEvents.map(({ day, events }, dayIdx) => {
        const isCurrentMonth = adapter.isSameMonth(day, visibleDate);
        const isToday = adapter.isSameDay(day, today);

        const visibleEvents = events.slice(0, maxEvents);
        const hiddenCount = events.length - maxEvents;
        return (
          <DayGrid.Cell
            ref={dayIdx === 0 ? firstDayRef : undefined}
            key={day.toString()}
            className={clsx(
              'MonthViewCell',
              !isCurrentMonth && 'OtherMonth',
              isToday && 'Today',
              isWeekend(adapter, day) && 'Weekend',
            )}
          >
            {hasDayView ? (
              <button
                type="button"
                className="MonthViewCellNumberButton"
                onClick={(event) => instance.switchToDay(day, event)}
                tabIndex={0}
              >
                {renderCellNumberContent(day)}
              </button>
            ) : (
              renderCellNumberContent(day)
            )}
            {visibleEvents.map((event) => (
              <EventPopoverTrigger
                key={event.id}
                event={event}
                render={
                  <DayGridEvent
                    event={event}
                    eventResource={resourcesByIdMap.get(event.resource)}
                    variant="compact"
                    ariaLabelledBy={`MonthViewHeaderCell-${day.toString()}`}
                  />
                }
              />
            ))}
            {hiddenCount > 0 && events.length > 0 && (
              <p className="MonthViewMoreEvents">{translations.hiddenEvents(hiddenCount)}</p>
            )}
          </DayGrid.Cell>
        );
      })}
    </DayGrid.Row>
  );
}
