'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useButton } from '../../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridEventCssVars } from './TimeGridEventCssVars';
import { getAdapter } from '../../utils/adapter/getAdapter';
import { useTimeGridColumnContext } from '../column/TimeGridColumnContext';
import { useEvent } from '../../utils/useEvent';
import { SchedulerValidDate } from '../../models';
import { getCursorPositionRelativeToElement } from '../../utils/drag-utils';
import { getTimeGridEventPosition } from '../../utils/date-utils';

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
    const position = getTimeGridEventPosition({ adapter, columnStart, columnEnd, start, end });

    return {
      [TimeGridEventCssVars.yPosition]: position.yPosition,
      [TimeGridEventCssVars.height]: position.height,
    } as React.CSSProperties;
  }, [columnStart, columnEnd, start, end]);

  const props = React.useMemo(() => ({ style }), [style]);

  const { state: eventState, props: eventProps } = useEvent({ start, end });

  const state: TimeGridEvent.State = React.useMemo(
    () => ({ ...eventState, moving: isMoving }),
    [eventState, isMoving],
  );

  React.useEffect(() => {
    return draggable({
      element: ref.current!,
      getInitialData: ({ input }) => {
        return {
          type: 'event',
          id: eventId,
          start,
          end,
          position: getCursorPositionRelativeToElement({ ref, input }),
        };
      },
      onDragStart: () => setIsMoving(true),
      onDrop: () => setIsMoving(false),
    });
  }, []);

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
  }

  export interface EventDragData {
    type: 'event';
    id: string | number;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
    position: { y: number };
  }
}
