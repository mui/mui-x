'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridColumnContext } from './TimeGridColumnContext';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { CalendarPrimitiveEventData, SchedulerValidDate } from '../../models';
import { useTimeGridRootContext } from '../root/TimeGridRootContext';
import {
  addRoundedOffsetToDate,
  createDateFromPositionInCollectionOld,
  getOffsetMsInCollection,
  EVENT_DRAG_PRECISION_MINUTE,
  getCursorPositionRelativeToElement,
  isDraggingTimeGridEvent,
  isDraggingTimeGridEventResizeHandler,
} from '../../utils/drag-utils';

export const TimeGridColumn = React.forwardRef(function TimeGridColumn(
  componentProps: TimeGridColumn.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const adapter = useAdapter();

  const {
    // Rendering props
    className,
    render,
    // Internal props
    start,
    end,
    columnId = null,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const ref = React.useRef<HTMLDivElement>(null);
  const { onEventChange, setPlaceholder } = useTimeGridRootContext();

  const contextValue: TimeGridColumnContext = React.useMemo(
    () => ({
      start,
      end,
      ref,
    }),
    [start, end],
  );

  const props = React.useMemo(() => ({ role: 'gridcell' }), []);

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, ref],
    props: [props, elementProps],
  });

  React.useEffect(() => {
    const domElement = ref.current;
    if (!domElement) {
      return () => {};
    }

    function getEventDropData({
      data,
      input,
    }: {
      data: Record<string, unknown>;
      input: { clientY: number };
    }): CalendarPrimitiveEventData | undefined {
      const position = getCursorPositionRelativeToElement({ ref, input });

      // Move event
      if (isDraggingTimeGridEvent(data)) {
        // TODO: Avoid JS Date conversion
        const eventDuration =
          (adapter.toJsDate(data.end).getTime() - adapter.toJsDate(data.start).getTime()) /
          (60 * 1000);

        const cursorOffsetMs = getOffsetMsInCollection({
          adapter,
          collectionStart: start,
          collectionEnd: end,
          position: position.y / domElement!.offsetHeight,
        });

        const newStartDate = addRoundedOffsetToDate({
          adapter,
          date: start,
          offsetMs: cursorOffsetMs - data.initialCursorPositionInEventMs,
        });

        const newEndDate = adapter.addMinutes(newStartDate, eventDuration);

        return { start: newStartDate, end: newEndDate, eventId: data.id, columnId };
      }

      // Resize event
      if (isDraggingTimeGridEventResizeHandler(data)) {
        const cursorPositionPx = position.y - data.position.y;
        const cursorDate = createDateFromPositionInCollectionOld({
          adapter,
          collectionStart: start,
          collectionEnd: end,
          position: cursorPositionPx / domElement!.offsetHeight,
        });

        if (data.side === 'start') {
          const maxStartDate = adapter.addMinutes(data.end, -EVENT_DRAG_PRECISION_MINUTE);

          // Ensure the new start date is not after or too close to the end date.
          const newStartDate = adapter.isBefore(cursorDate, maxStartDate)
            ? cursorDate
            : maxStartDate;

          return {
            start: newStartDate,
            end: data.end,
            eventId: data.id,
            columnId,
          };
        }

        const minEndDate = adapter.addMinutes(data.start, EVENT_DRAG_PRECISION_MINUTE);

        // Ensure the new end date is not before or too close to the start date.
        const newEndDate = adapter.isAfter(cursorDate, minEndDate) ? cursorDate : minEndDate;

        return {
          start: data.start,
          end: newEndDate,
          eventId: data.id,
          columnId,
        };
      }

      return undefined;
    }

    return dropTargetForElements({
      element: domElement,
      canDrop: (arg) =>
        isDraggingTimeGridEvent(arg.source.data) ||
        isDraggingTimeGridEventResizeHandler(arg.source.data),
      onDrag: ({ source: { data }, location }) => {
        const newPlaceholder = getEventDropData({
          data,
          input: location.current.input,
        });

        if (newPlaceholder) {
          setPlaceholder(newPlaceholder);
        }
      },
      onDragStart: ({ source: { data } }) => {
        if (isDraggingTimeGridEvent(data) || isDraggingTimeGridEventResizeHandler(data)) {
          setPlaceholder({ eventId: data.id, start: data.start, end: data.end, columnId });
        }
      },
      onDrop: ({ source: { data }, location }) => {
        const newEvent = getEventDropData({
          data,
          input: location.current.input,
        });

        if (newEvent) {
          onEventChange(newEvent);
          setPlaceholder(null);
        }
      },
    });
  }, [adapter, onEventChange, setPlaceholder, start, end, columnId]);

  return (
    <TimeGridColumnContext.Provider value={contextValue}>{element}</TimeGridColumnContext.Provider>
  );
});

export namespace TimeGridColumn {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The data and time at which the column starts.
     */
    start: SchedulerValidDate;
    /**
     * The data and time at which the column ends.
     */
    end: SchedulerValidDate;
    /**
     * A unique identifier for the column.
     * This is used to identify the column when dragging events if several columns represent the same time range.
     * @default null
     */
    columnId?: string;
  }
}
