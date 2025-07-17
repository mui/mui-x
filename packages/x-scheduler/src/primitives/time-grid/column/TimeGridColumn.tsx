'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridColumnContext } from './TimeGridColumnContext';
import { TimeGridColumnPlaceholderContext } from './TimeGridColumnPlaceholderContext';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { SchedulerValidDate } from '../../models';
import { mergeDateAndTime } from '../../utils/date-utils';
import { useTimeGridRootContext } from '../root/TimeGridRootContext';
import { TimeGridEvent } from '../event';
import {
  EVENT_DRAG_PRECISION_MINUTE,
  getCursorPositionRelativeToElement,
  isDraggingTimeGridEvent,
} from '../../utils/drag-utils';
import { Adapter } from '../../utils/adapter/types';

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
    value,
    startTime,
    endTime,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const ref = React.useRef<HTMLDivElement>(null);
  const { onEventChange, setPlaceholder, placeholder } = useTimeGridRootContext();

  const columnStart = React.useMemo(
    () =>
      startTime == null ? adapter.startOfDay(value) : mergeDateAndTime(adapter, value, startTime),
    [adapter, value, startTime],
  );

  const columnEnd = React.useMemo(
    () => (endTime == null ? adapter.endOfDay(value) : mergeDateAndTime(adapter, value, endTime)),
    [adapter, value, endTime],
  );

  const columnPlaceholder = React.useMemo(() => {
    if (placeholder == null) {
      return null;
    }

    if (
      adapter.isBefore(placeholder.start, columnStart) ||
      adapter.isAfter(placeholder.end, columnEnd)
    ) {
      return null;
    }

    return placeholder;
  }, [adapter, columnStart, columnEnd, placeholder]);

  const contextValue: TimeGridColumnContext = React.useMemo(
    () => ({
      start: columnStart,
      end: columnEnd,
    }),
    [columnStart, columnEnd],
  );

  const placeholderContextValue: TimeGridColumnPlaceholderContext = React.useMemo(
    () => ({
      placeholder: columnPlaceholder,
    }),
    [columnPlaceholder],
  );

  const props = React.useMemo(() => ({ role: 'gridcell' }), []);

  const state: TimeGridColumn.State = React.useMemo(() => ({}), []);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref],
    props: [props, elementProps],
  });

  React.useEffect(() => {
    return dropTargetForElements({
      element: ref.current!,
      canDrop: (arg) => isDraggingTimeGridEvent(arg.source.data),
      getData: () => ({ type: 'column' }),
      onDrag: ({ source: { data }, location }) => {
        if (!isDraggingTimeGridEvent(data)) {
          return;
        }

        const { start, end } = getEventDropDates({
          adapter,
          ref,
          data,
          columnValue: value,
          input: location.current.input,
        });

        setPlaceholder({ start, end, id: data.id });
      },
      onDrop: ({ source: { data }, location }) => {
        if (!isDraggingTimeGridEvent(data)) {
          return;
        }

        const { start, end } = getEventDropDates({
          adapter,
          ref,
          data,
          columnValue: value,
          input: location.current.input,
        });

        onEventChange({ start, end, id: data.id });
        setPlaceholder(null);
      },
    });
  }, [adapter, onEventChange, setPlaceholder, value]);

  return (
    <TimeGridColumnContext.Provider value={contextValue}>
      <TimeGridColumnPlaceholderContext.Provider value={placeholderContextValue}>
        {element}
      </TimeGridColumnPlaceholderContext.Provider>
    </TimeGridColumnContext.Provider>
  );
});

export namespace TimeGridColumn {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The value of the column.
     */
    value: SchedulerValidDate;
    /**
     * The start time of the column.
     * The date part is ignored, only the time part is used.
     * @defaultValue 00:00:00
     */
    startTime?: SchedulerValidDate;
    /**
     * The end time of the column.
     * The date part is ignored, only the time part is used.
     * @defaultValue 23:59:59
     */
    endTime?: SchedulerValidDate;
  }
}

function getEventDropDates({
  adapter,
  data,
  input,
  ref,
  columnValue,
}: {
  adapter: Adapter;
  data: TimeGridEvent.EventDragData;
  input: { clientY: number };
  ref: React.RefObject<HTMLElement | null>;
  columnValue: SchedulerValidDate;
}) {
  if (!ref.current) {
    return { start: data.start, end: data.end };
  }

  const position = getCursorPositionRelativeToElement({ ref, input });
  const eventTopPosition = position.y - data.position.y;

  const newStartMinuteInDay =
    Math.round(
      ((eventTopPosition / ref.current.offsetHeight) * 1440) / EVENT_DRAG_PRECISION_MINUTE,
    ) * EVENT_DRAG_PRECISION_MINUTE;

  // TODO: Avoid JS Date conversion
  const eventDuration =
    (adapter.toJsDate(data.end).getTime() - adapter.toJsDate(data.start).getTime()) / (60 * 1000);

  const newStartDate = adapter.setMinutes(
    adapter.setHours(columnValue, Math.floor(newStartMinuteInDay / 60)),
    newStartMinuteInDay % 60,
  );

  const newEndDate = adapter.addMinutes(newStartDate, eventDuration);

  return { start: newStartDate, end: newEndDate };
}
