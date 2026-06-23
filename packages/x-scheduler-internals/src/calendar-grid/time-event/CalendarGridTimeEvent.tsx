'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useId } from '@base-ui/utils/useId';
import { useButton } from '../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps, NonNativeButtonProps } from '../../base-ui-copy/utils/types';
import { CalendarGridTimeEventCssVars } from './CalendarGridTimeEventCssVars';
import { useCalendarGridTimeColumnContext } from '../time-column/CalendarGridTimeColumnContext';
import { useDraggableEvent } from '../../internals/utils/useDraggableEvent';
import { useElementPositionInCollection } from '../../internals/utils/useElementPositionInCollection';
import { getCalendarGridHeaderCellId } from '../../internals/utils/accessibility-utils';
import { CalendarGridTimeEventContext } from './CalendarGridTimeEventContext';
import { useAdapterContext } from '../../use-adapter-context';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import { SchedulerEventId, SchedulerEventOccurrence, TemporalSupportedObject } from '../../models';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';
import { generateOccurrenceFromEvent } from '../../internals/utils/event-utils';

export const CalendarGridTimeEvent = React.forwardRef(function CalendarGridTimeEvent(
  componentProps: CalendarGridTimeEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    start,
    end,
    eventId,
    occurrenceKey,
    renderDragPreview,
    id: idProp,
    isDraggable = false,
    nativeButton = false,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  // Context hooks
  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();
  const { id: rootId } = useCalendarGridRootContext();
  const {
    start: columnStart,
    end: columnEnd,
    index: columnIndex,
    hasFocus: columnHasFocus,
    getCursorPositionInElementMs,
  } = useCalendarGridTimeColumnContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // State hooks
  const id = useId(idProp);

  // Feature hooks
  const getSharedDragData: CalendarGridTimeEventContext['getSharedDragData'] = useStableCallback(
    (input) => {
      const offsetBeforeColumnStart = Math.max(adapter.getTime(columnStart) - start.timestamp, 0);
      const event = schedulerEventSelectors.processedEvent(store.state, eventId)!;

      const originalOccurrence = generateOccurrenceFromEvent({
        event,
        eventId,
        occurrenceKey,
        start,
        end,
      });

      const offsetInsideColumn = getCursorPositionInElementMs({ input, elementRef: ref });
      return {
        eventId,
        occurrenceKey,
        originalOccurrence,
        start: start.value,
        end: end.value,
        initialCursorPositionInEventMs: offsetBeforeColumnStart + offsetInsideColumn,
      };
    },
  );

  const getDragData = useStableCallback((input) => ({
    ...getSharedDragData(input),
    source: 'CalendarGridTimeEvent',
  }));

  const {
    state,
    preview,
    contextValue: draggableEventContextValue,
  } = useDraggableEvent({
    ref,
    start,
    end,
    occurrenceKey,
    eventId,
    isDraggable,
    renderDragPreview,
    getDragData,
    collectionStart: columnStart,
    collectionEnd: columnEnd,
  });

  const { getButtonProps, buttonRef } = useButton({
    disabled: !isInteractive,
    native: nativeButton,
    tabIndex: columnHasFocus ? 0 : -1,
  });

  const { position, duration } = useElementPositionInCollection({
    start,
    end,
    collectionStart: columnStart,
    collectionEnd: columnEnd,
  });

  const columnHeaderId = getCalendarGridHeaderCellId(rootId, columnIndex);

  const contextValue: CalendarGridTimeEventContext = React.useMemo(
    () => ({ ...draggableEventContextValue, getSharedDragData }),
    [draggableEventContextValue, getSharedDragData],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef, ref],
    props: [
      elementProps,
      {
        id,
        'aria-labelledby': `${columnHeaderId} ${id}`,
        style: {
          [CalendarGridTimeEventCssVars.yPosition]: `${position * 100}%`,
          [CalendarGridTimeEventCssVars.height]: `${duration * 100}%`,
        } as React.CSSProperties,
      },
      getButtonProps,
    ],
  });

  return (
    <CalendarGridTimeEventContext.Provider value={contextValue}>
      {element}
      {preview.element}
    </CalendarGridTimeEventContext.Provider>
  );
});

export namespace CalendarGridTimeEvent {
  export interface State extends useDraggableEvent.State {}

  export interface Props
    extends
      BaseUIComponentProps<'div', State>,
      NonNativeButtonProps,
      useDraggableEvent.PublicParameters {}

  export interface SharedDragData {
    eventId: SchedulerEventId;
    occurrenceKey: string;
    originalOccurrence: SchedulerEventOccurrence;
    start: TemporalSupportedObject;
    end: TemporalSupportedObject;
    initialCursorPositionInEventMs: number;
  }

  export interface DragData extends SharedDragData {
    source: 'CalendarGridTimeEvent';
  }
}
