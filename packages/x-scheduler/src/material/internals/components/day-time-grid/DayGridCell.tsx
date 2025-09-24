'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { DayGrid } from '../../../../primitives/day-grid';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { isWeekend } from '../../../../primitives/utils/date-utils';
import { useEventOccurrencesWithDayGridPosition } from '../../../../primitives/use-event-occurrences-with-day-grid-position';
import { EventPopoverTrigger } from '../event-popover';
import { DayGridEvent } from '../event';
import { useEventCalendarStoreContext } from '../../../../primitives/utils/useEventCalendarStoreContext';
import { selectors } from '../../../../primitives/use-event-calendar';

import './DayTimeGrid.css';
import { useEventPopover } from '../event-popover/EventPopoverContext';

export function DayGridCell(props: DayGridCellProps) {
  const { day, row } = props;
  const adapter = useAdapter();
  const placeholder = DayGrid.usePlaceholderInDay(day.value, row);
  const store = useEventCalendarStoreContext();
  const cellRef = React.useRef<HTMLDivElement | null>(null);
  const rawPlaceholder = useStore(store, selectors.occurrencePlaceholder);
  const { startEditing } = useEventPopover();

  const onDoubleClick = () => {
    store.setOccurrencePlaceholder({
      eventId: null,
      occurrenceKey: 'create-placeholder',
      surfaceType: 'day-grid',
      start: adapter.startOfDay(day.value),
      end: adapter.endOfDay(day.value),
      originalStart: null,
    });
  };

  React.useEffect(() => {
    if (!placeholder || !rawPlaceholder) {
      return;
    }

    const isCreation = rawPlaceholder.eventId == null && rawPlaceholder.surfaceType === 'day-grid';
    if (!isCreation) {
      return;
    }
    startEditing({ currentTarget: cellRef.current } as unknown as React.MouseEvent, placeholder);
  }, [placeholder, rawPlaceholder, startEditing]);

  return (
    <DayGrid.Cell
      ref={cellRef}
      value={day.value}
      className="DayTimeGridAllDayEventsCell"
      style={
        {
          '--row-count': row.maxIndex,
        } as React.CSSProperties
      }
      aria-labelledby={`DayTimeGridHeaderCell-${adapter.getDate(day.value)} DayTimeGridAllDayEventsHeaderCell`}
      role="gridcell"
      data-weekend={isWeekend(adapter, day.value) ? '' : undefined}
      onDoubleClick={onDoubleClick}
    >
      <div className="DayTimeGridAllDayEventsCellEvents">
        {day.withPosition.map((occurrence) => {
          if (occurrence.position.isInvisible) {
            return (
              <DayGridEvent
                key={occurrence.key}
                occurrence={occurrence}
                variant="invisible"
                ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
              />
            );
          }

          return (
            <EventPopoverTrigger
              key={occurrence.key}
              occurrence={occurrence}
              render={
                <DayGridEvent
                  occurrence={occurrence}
                  variant="allDay"
                  ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
                />
              }
            />
          );
        })}
        {placeholder != null && (
          <div className="DayTimeGridAllDayEventContainer">
            <DayGridEvent
              occurrence={placeholder}
              variant="placeholder"
              ariaLabelledBy={`MonthViewHeaderCell-${day.key}`}
            />
          </div>
        )}
      </div>
    </DayGrid.Cell>
  );
}

interface DayGridCellProps {
  day: useEventOccurrencesWithDayGridPosition.DayData;
  row: useEventOccurrencesWithDayGridPosition.ReturnValue;
}
