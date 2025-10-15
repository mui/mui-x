'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps, NonNativeButtonProps } from '../../base-ui-copy/utils/types';
import { useButton } from '../../base-ui-copy/utils/useButton';
import { CalendarEvent, CalendarEventId, SchedulerValidDate } from '../../models';
import { useAdapter } from '../../use-adapter';
import { useTimelineStoreContext } from '../../use-timeline-store-context';
import { selectors } from '../../use-timeline';
import { useTimelineEventRowContext } from '../event-row/TimelineEventRowContext';
import { useDraggableEvent } from '../../utils/useDraggableEvent';
import { TimelineEventCssVars } from './TimelineEventCssVars';
import { useElementPositionInCollection } from '../../utils/useElementPositionInCollection';
import { TimelineEventContext } from './TimelineEventContext';

export const TimelineEvent = React.forwardRef(function TimelineEvent(
  componentProps: TimelineEvent.Props,
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
    occurrenceKey,
    renderDragPreview,
    isDraggable,
    nativeButton = false,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  // Context hooks
  const adapter = useAdapter();
  const store = useTimelineStoreContext();
  const {
    start: rowStart,
    end: rowEnd,
    getCursorPositionInElementMs,
  } = useTimelineEventRowContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Feature hooks
  const getSharedDragData: TimelineEventContext['getSharedDragData'] = useEventCallback((input) => {
    const offsetBeforeRowStart = Math.max(
      adapter.toJsDate(rowStart).getTime() - adapter.toJsDate(start).getTime(),
      0,
    );
    const offsetInsideRow = getCursorPositionInElementMs({ input, elementRef: ref });
    return {
      eventId,
      occurrenceKey,
      event: selectors.event(store.state, eventId)!,
      start,
      end,
      initialCursorPositionInEventMs: offsetBeforeRowStart + offsetInsideRow,
    };
  });

  const getDragData = useEventCallback((input) => ({
    ...getSharedDragData(input),
    source: 'TimelineEvent',
  }));

  const { state, preview, setIsResizing } = useDraggableEvent({
    ref,
    start,
    end,
    occurrenceKey,
    eventId,
    isDraggable,
    renderDragPreview,
    getDragData,
  });

  const { getButtonProps, buttonRef } = useButton({
    disabled: !isInteractive,
    native: nativeButton,
  });

  const { position, duration } = useElementPositionInCollection({
    start,
    end,
    collectionStart: rowStart,
    collectionEnd: rowEnd,
  });

  // Rendering hooks
  const style = React.useMemo(
    () =>
      ({
        [TimelineEventCssVars.xPosition]: `${position * 100}%`,
        [TimelineEventCssVars.width]: `${duration * 100}%`,
      }) as React.CSSProperties,
    [position, duration],
  );

  const props = React.useMemo(() => ({ style }), [style]);

  const doesEventStartBeforeRowStart = React.useMemo(
    () => adapter.isBefore(start, rowStart),
    [adapter, start, rowStart],
  );

  const doesEventEndAfterRowEnd = React.useMemo(
    () => adapter.isAfter(end, rowEnd),
    [adapter, end, rowEnd],
  );

  const contextValue: TimelineEventContext = React.useMemo(
    () => ({
      setIsResizing,
      getSharedDragData,
      doesEventStartBeforeRowStart,
      doesEventEndAfterRowEnd,
    }),
    [setIsResizing, getSharedDragData, doesEventStartBeforeRowStart, doesEventEndAfterRowEnd],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref, buttonRef],
    props: [props, elementProps, getButtonProps],
  });

  return (
    <TimelineEventContext.Provider value={contextValue}>
      {element}
      {preview.element}
    </TimelineEventContext.Provider>
  );
});

export namespace TimelineEvent {
  export interface State extends useDraggableEvent.State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>,
      NonNativeButtonProps,
      Omit<useDraggableEvent.Parameters, 'ref' | 'getDragData'> {}

  export interface SharedDragData {
    eventId: CalendarEventId;
    occurrenceKey: string;
    event: CalendarEvent;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
    initialCursorPositionInEventMs: number;
  }

  export interface DragData extends SharedDragData {
    source: 'TimelineEvent';
  }
}
