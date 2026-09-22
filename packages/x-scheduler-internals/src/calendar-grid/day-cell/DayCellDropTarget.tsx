'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import {
  schedulerDayEventMoveKind,
  schedulerDayEventResizeKind,
  schedulerTimeEventMoveKind,
  schedulerExternalEventKind,
} from '../../internals/utils/schedulerDrag';
import { useAdapterContext } from '../../use-adapter-context';
import type { SchedulerEvent, TemporalSupportedObject } from '../../models';
import { mergeDateAndTime } from '../../internals/utils/date-utils';
import { SchedulerDropTarget } from '../../internals/utils/SchedulerDropTarget';

const acceptedKinds = [
  schedulerDayEventMoveKind,
  schedulerDayEventResizeKind,
  schedulerTimeEventMoveKind,
  schedulerExternalEventKind,
];

export function DayCellDropTarget(props: DayCellDropTarget.Props) {
  const { value, addPropertiesToDroppedEvent, render } = props;

  // Context hooks
  const adapter = useAdapterContext();

  // Feature hooks
  const getEventDropData: SchedulerDropTarget.GetEventDropData = useStableCallback(
    ({ source, getDataFromInside, getDataFromOutside }) => {
      // Move a Day Grid Event within the Day Grid
      if (schedulerDayEventMoveKind.matches(source)) {
        const data = source.dragData;
        if (!data) {
          return undefined;
        }
        const offset = adapter.differenceInDays(value, data.draggedDay);
        return getDataFromInside(
          data,
          offset === 0 ? data.start : adapter.addDays(data.start, offset),
          offset === 0 ? data.end : adapter.addDays(data.end, offset),
        );
      }

      // Resize a Day Grid Event
      if (schedulerDayEventResizeKind.matches(source)) {
        const data = source.dragData;
        if (!data) {
          return undefined;
        }
        if (data.side === 'start') {
          if (adapter.isAfter(value, adapter.endOfDay(data.end))) {
            return undefined;
          }

          let newStart: TemporalSupportedObject;
          if (adapter.isSameDay(value, data.end)) {
            newStart = adapter.startOfDay(data.end);
          } else {
            newStart = mergeDateAndTime(adapter, value, data.start);
          }
          return getDataFromInside(data, newStart, data.end);
        }

        if (data.side === 'end') {
          if (adapter.isBefore(value, adapter.startOfDay(data.start))) {
            return undefined;
          }

          let draggedDay: TemporalSupportedObject;
          if (adapter.isSameDay(value, data.start)) {
            draggedDay = adapter.endOfDay(data.start);
          } else {
            draggedDay = mergeDateAndTime(adapter, value, data.end);
          }

          return getDataFromInside(data, data.start, draggedDay);
        }
      }

      // Move a Time Grid Event into the Day Grid
      if (schedulerTimeEventMoveKind.matches(source)) {
        const data = source.dragData;
        if (!data) {
          return undefined;
        }
        const cursorDate = adapter.startOfDay(
          adapter.addMilliseconds(data.start, data.initialCursorPositionInEventMs),
        );
        const offset = adapter.differenceInDays(value, cursorDate);
        return getDataFromInside(
          data,
          offset === 0 ? data.start : adapter.addDays(data.start, offset),
          offset === 0 ? data.end : adapter.addDays(data.end, offset),
        );
      }

      // Move an Standalone Event into the Time Grid
      if (schedulerExternalEventKind.matches(source)) {
        const data = source.payload;
        return getDataFromOutside(data, value);
      }

      return undefined;
    },
  );

  return (
    <SchedulerDropTarget
      surfaceType="day-grid"
      getEventDropData={getEventDropData}
      accept={acceptedKinds}
      addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
      render={render}
    />
  );
}

export namespace DayCellDropTarget {
  export interface Props extends Parameters {
    render: React.ReactElement;
  }

  export interface Parameters {
    /**
     * The value of the cell.
     */
    value: TemporalSupportedObject;
    /**
     * Add properties to the event dropped in the cell before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }
}
