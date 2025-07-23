'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useButton } from '../../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridEventCssVars } from './TimeGridEventCssVars';
import { getAdapter } from '../../utils/adapter/getAdapter';
import { useTimeGridColumnContext } from '../column/TimeGridColumnContext';
import { useEvent } from '../../utils/useEvent';
import { SchedulerValidDate } from '../../models';
import { getCursorPositionRelativeToElement } from '../../utils/drag-utils';

const adapter = getAdapter();

export const TimeGridEvent = React.forwardRef(function TimeGridEvent(
  componentProps: TimeGridEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    start,
    end,
    eventId,
    isDraggable = false,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  const ref = React.useRef<HTMLDivElement>(null);
  const [isMoving, setIsMoving] = React.useState(false);
  const { getButtonProps, buttonRef } = useButton({ disabled: !isInteractive });

  const { start: columnStart, end: columnEnd } = useTimeGridColumnContext();

  const style = React.useMemo(() => {
    const getMinutes = (date: SchedulerValidDate) =>
      adapter.getHours(date) * 60 + adapter.getMinutes(date);

    const minutesInColumn = getMinutes(columnEnd) - getMinutes(columnStart);

    const isStartingBeforeColumnStart = adapter.isBefore(start, columnStart);
    const isEndingAfterColumnEnd = adapter.isAfter(end, columnEnd);
    const startTime = isStartingBeforeColumnStart ? 0 : getMinutes(start) - getMinutes(columnStart);
    const endTime = isEndingAfterColumnEnd
      ? minutesInColumn
      : getMinutes(end) - getMinutes(columnStart);

    const yPositionInt = isStartingBeforeColumnStart ? 0 : (startTime / minutesInColumn) * 100;

    const heightInt = isEndingAfterColumnEnd
      ? 100 - yPositionInt
      : ((endTime - startTime) / minutesInColumn) * 100;

    return {
      [TimeGridEventCssVars.yPosition]: `${yPositionInt}%`,
      [TimeGridEventCssVars.height]: `${heightInt}%`,
    } as React.CSSProperties;
  }, [columnStart, columnEnd, start, end]);

  const props = React.useMemo(() => ({ style }), [style]);

  const { state: eventState, props: eventProps } = useEvent({ start, end });

  const state: TimeGridEvent.State = React.useMemo(
    () => ({ ...eventState, moving: isMoving }),
    [eventState, isMoving],
  );

  React.useEffect(() => {
    if (!isDraggable) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return draggable({
      element: ref.current!,
      getInitialData: ({ input }) => ({
        type: 'event',
        source: 'TimeGridEvent',
        id: eventId,
        start,
        end,
        position: getCursorPositionRelativeToElement({ ref, input }),
      }),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
      },
      onDragStart: () => setIsMoving(true),
      onDrop: () => setIsMoving(false),
    });
  }, [isDraggable, start, end, eventId]);

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef, ref],
    props: [props, eventProps, elementProps, getButtonProps],
  });
});

export namespace TimeGridEvent {
  export interface State extends useEvent.State {
    /**
     * Whether the event is being moved.
     */
    moving: boolean;
  }

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {
    /**
     * The unique identifier of the event.
     */
    eventId: string | number;
    /**
     * Whether the event is draggable to change its start and end dates without changing its duration.
     * @default false
     */
    isDraggable?: boolean;
  }

  export interface EventDragData {
    type: 'event';
    source: 'TimeGridEvent';
    id: string | number;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
    position: { y: number };
  }
}
