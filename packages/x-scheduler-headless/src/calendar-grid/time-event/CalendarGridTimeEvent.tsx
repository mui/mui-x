'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useId } from '@base-ui-components/utils/useId';
import { useButton } from '../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps, NonNativeButtonProps } from '../../base-ui-copy/utils/types';
import { CalendarGridTimeEventCssVars } from './CalendarGridTimeEventCssVars';
import { useCalendarGridTimeColumnContext } from '../time-column/CalendarGridTimeColumnContext';
import { useDraggableEvent } from '../../utils/useDraggableEvent';
import { useElementPositionInCollection } from '../../utils/useElementPositionInCollection';
import { getCalendarGridHeaderCellId } from '../../utils/accessibility-utils';
import { CalendarGridTimeEventContext } from './CalendarGridTimeEventContext';
import { useAdapter } from '../../use-adapter/useAdapter';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { selectors } from '../../use-event-calendar';
import { CalendarEvent, CalendarEventId, SchedulerValidDate } from '../../models';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';

export const CalendarGridTimeEvent = React.forwardRef(function CalendarGridTimeEvent(
  componentProps: CalendarGridTimeEvent.Props,
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
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const { id: rootId } = useCalendarGridRootContext();
  const {
    start: columnStart,
    end: columnEnd,
    index: columnIndex,
    getCursorPositionInElementMs,
  } = useCalendarGridTimeColumnContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // State hooks
  const id = useId(idProp);

  // Feature hooks
  const getSharedDragData: CalendarGridTimeEventContext['getSharedDragData'] = useEventCallback(
    (input) => {
      const offsetBeforeColumnStart = Math.max(
        adapter.toJsDate(columnStart).getTime() - adapter.toJsDate(start).getTime(),
        0,
      );
      const offsetInsideColumn = getCursorPositionInElementMs({ input, elementRef: ref });
      return {
        eventId,
        occurrenceKey,
        event: selectors.event(store.state, eventId)!,
        start,
        end,
        initialCursorPositionInEventMs: offsetBeforeColumnStart + offsetInsideColumn,
      };
    },
  );

  const getDragData = useEventCallback((input) => ({
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
  });

  const { position, duration } = useElementPositionInCollection({
    start,
    end,
    collectionStart: columnStart,
    collectionEnd: columnEnd,
  });

  // Rendering hooks
  const style = React.useMemo(
    () =>
      ({
        [CalendarGridTimeEventCssVars.yPosition]: `${position * 100}%`,
        [CalendarGridTimeEventCssVars.height]: `${duration * 100}%`,
      }) as React.CSSProperties,
    [position, duration],
  );

  const columnHeaderId = getCalendarGridHeaderCellId(rootId, columnIndex);

  const props = React.useMemo(
    () => ({ id, style, 'aria-labelledby': `${columnHeaderId} ${id}` }),
    [style, columnHeaderId, id],
  );

  const contextValue: CalendarGridTimeEventContext = React.useMemo(
    () => ({ ...draggableEventContextValue, getSharedDragData }),
    [draggableEventContextValue, getSharedDragData],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef, ref],
    props: [props, elementProps, getButtonProps],
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
    extends BaseUIComponentProps<'div', State>,
      NonNativeButtonProps,
      useDraggableEvent.PublicParameters {}

  export interface SharedDragData {
    eventId: CalendarEventId;
    occurrenceKey: string;
    event: CalendarEvent;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
    initialCursorPositionInEventMs: number;
  }

  export interface DragData extends SharedDragData {
    source: 'CalendarGridTimeEvent';
  }
}
