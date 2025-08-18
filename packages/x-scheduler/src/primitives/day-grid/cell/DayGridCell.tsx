'use client';
import * as React from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { CalendarPrimitiveEventData } from '../../models/event';
import { isDraggingDayGridEvent } from '../../utils/drag-utils';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { useDayGridRootContext } from '../root/DayGridRootContext';
import { SchedulerValidDate } from '../../models';
import { mergeDateAndTime } from '../../utils/date-utils';

export const DayGridCell = React.forwardRef(function DayGridCell(
  componentProps: DayGridCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const adapter = useAdapter();

  const {
    // Rendering props
    className,
    render,
    // Internal props
    value,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const ref = React.useRef<HTMLDivElement>(null);
  const { onEventChange, setPlaceholder } = useDayGridRootContext();

  const props = React.useMemo(() => ({ role: 'gridcell' }), []);

  const state: DayGridCell.State = React.useMemo(() => ({}), []);

  React.useEffect(() => {
    const domElement = ref.current;
    if (!domElement) {
      return () => {};
    }

    function getEventDropData({
      data,
    }: {
      data: Record<string, unknown>;
    }): CalendarPrimitiveEventData | undefined {
      // Move event
      if (isDraggingDayGridEvent(data)) {
        // TODO: Avoid JS Date conversion
        const eventDuration =
          (adapter.toJsDate(data.end).getTime() - adapter.toJsDate(data.start).getTime()) /
          (60 * 1000);

        const newStartDate = mergeDateAndTime(adapter, value, data.start);
        const newEndDate = adapter.addMinutes(newStartDate, eventDuration);

        return { start: newStartDate, end: newEndDate, eventId: data.id, columnId: null };
      }

      return undefined;
    }

    return dropTargetForElements({
      element: domElement,
      canDrop: (arg) => isDraggingDayGridEvent(arg.source.data),
      onDrag: ({ source: { data } }) => {
        const newPlaceholder = getEventDropData({ data });

        if (newPlaceholder) {
          setPlaceholder(newPlaceholder);
        }
      },
      onDragStart: ({ source: { data } }) => {
        if (isDraggingDayGridEvent(data)) {
          setPlaceholder({ eventId: data.id, columnId: null, start: data.start, end: data.end });
        }
      },
      onDrop: ({ source: { data } }) => {
        const newEvent = getEventDropData({ data });

        if (newEvent) {
          onEventChange(newEvent);
          setPlaceholder(null);
        }
      },
    });
  }, [adapter, onEventChange, setPlaceholder, value]);

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref],
    props: [props, elementProps],
  });
});

export namespace DayGridCell {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The value of the cell.
     */
    value: SchedulerValidDate;
  }
}
