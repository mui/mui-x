'use client';
import * as React from 'react';
import { DayGrid } from '../../../../primitives/day-grid';
import { useAdapter } from '../../../../primitives/utils/adapter/useAdapter';
import { isWeekend } from '../../../../primitives/utils/date-utils';
import { useEventOccurrencesWithDayGridPosition } from '../../../../primitives/use-event-occurrences-with-day-grid-position';
import { EventPopoverTrigger } from '../event-popover';
import { DayGridEvent } from '../event';
import './DayTimeGrid.css';

export function DayGridCell(props: DayGridCellProps) {
  const { day, row } = props;
  const adapter = useAdapter();
  const placeholder = DayGrid.usePlaceholderInDay(day.value, row);

  return (
    <DayGrid.Cell
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
              variant="dragPlaceholder"
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
