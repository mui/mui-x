'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridColumnContext } from './TimeGridColumnContext';
import { getAdapter } from '../../utils/adapter/getAdapter';
import { SchedulerValidDate } from '../../models';
import { mergeDateAndTime } from '../../utils/date-utils';
import { useTimeGridRootContext } from '../root/TimeGridRootContext';
import { TimeGridEvent } from '../event';
import { getCursorPositionRelativeToElement } from '../../utils/drag-utils';
import { TimeGridRoot } from '../root';

const adapter = getAdapter();

export const TimeGridColumn = React.forwardRef(function TimeGridColumn(
  componentProps: TimeGridColumn.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    value,
    startTime,
    endTime,
    children,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const ref = React.useRef<HTMLDivElement>(null);
  const { onEventChange, setPlaceholder, placeholder } = useTimeGridRootContext();

  const contextValue: TimeGridColumnContext = React.useMemo(
    () => ({
      start:
        startTime == null ? adapter.startOfDay(value) : mergeDateAndTime(adapter, value, startTime),
      end: endTime == null ? adapter.endOfDay(value) : mergeDateAndTime(adapter, value, endTime),
    }),
    [value, startTime, endTime],
  );

  const columnPlaceholder = React.useMemo(() => {
    if (placeholder == null) {
      return null;
    }

    if (
      adapter.isBefore(placeholder.start, contextValue.start) ||
      adapter.isAfter(placeholder.end, contextValue.end)
    ) {
      return null;
    }

    return placeholder;
  }, [contextValue.start, contextValue.end, placeholder]);

  const resolvedChildren = React.useMemo(() => {
    if (!React.isValidElement(children) && typeof children === 'function') {
      return children({ placeholder: columnPlaceholder });
    }

    return children;
  }, [children, columnPlaceholder]);

  const props = React.useMemo(
    () => ({ role: 'gridcell', children: resolvedChildren }),
    [resolvedChildren],
  );

  const state: TimeGridColumn.State = React.useMemo(() => ({}), []);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref],
    props: [props, elementProps],
  });

  React.useEffect(() => {
    return dropTargetForElements({
      element: ref.current!,
      canDrop: ({ source }) => source.data.type === 'event',
      getData: () => ({ type: 'column' }),
      onDrag: ({ source, location }) => {
        if (source.data.type !== 'event') {
          return;
        }

        const data = source.data as unknown as TimeGridEvent.EventDragData;

        const { start, end } = getEventDropDates({
          ref,
          data,
          columnValue: value,
          input: location.current.input,
        });

        setPlaceholder({ start, end, id: data.id });
      },
      onDrop: ({ source, location }) => {
        const data = source.data as unknown as TimeGridEvent.EventDragData;

        const { start, end } = getEventDropDates({
          ref,
          data,
          columnValue: value,
          input: location.current.input,
        });

        onEventChange({ start, end, id: data.id });
        setPlaceholder(null);
      },
    });
  }, [onEventChange, setPlaceholder, value]);

  return (
    <TimeGridColumnContext.Provider value={contextValue}>{element}</TimeGridColumnContext.Provider>
  );
});

export namespace TimeGridColumn {
  export interface State {}

  export interface Props extends Omit<BaseUIComponentProps<'div', State>, 'children'> {
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
    /**
     * The children of the component.
     * If a function is provided, it will be called with the column's placeholder as its parameter.
     */
    children?: React.ReactNode | ((parameters: ChildrenParameters) => React.ReactNode);
  }

  export interface ChildrenParameters {
    placeholder: TimeGridRoot.EventData | null;
  }
}

function getEventDropDates({
  data,
  input,
  ref,
  columnValue,
}: {
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
    Math.round(((eventTopPosition / ref.current.offsetHeight) * 1440) / 15) * 15; // Round to nearest 15 minutes

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
