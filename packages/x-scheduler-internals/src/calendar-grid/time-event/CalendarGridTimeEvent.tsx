'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useId } from '@base-ui/utils/useId';
import { useButton } from '@base-ui/react/internals/use-button';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps, NonNativeButtonProps } from '@base-ui/react/internals/types';
import { CalendarGridTimeEventCssVars } from './CalendarGridTimeEventCssVars';
import { useCalendarGridTimeColumnContext } from '../time-column/CalendarGridTimeColumnContext';
import { useDraggableEvent } from '../../internals/utils/useDraggableEvent';
import { useElementPositionInCollection } from '../../internals/utils/useElementPositionInCollection';
import { getCalendarGridHeaderCellId } from '../../internals/utils/accessibility-utils';
import { CalendarGridTimeEventContext } from './CalendarGridTimeEventContext';
import { useAdapterContext } from '../../use-adapter-context';
import type {
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerResourceId,
  TemporalSupportedObject,
} from '../../models';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';
import { useOriginalOccurrence } from '../../internals/utils/useOriginalOccurrence';

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
    dataBounds,
    eventId,
    occurrenceKey,
    renderDragPreview,
    id: idProp,
    isDraggable = false,
    nativeButton = false,
    interactive = true,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // Context hooks
  const adapter = useAdapterContext();
  const { id: rootId } = useCalendarGridRootContext();
  const {
    start: columnStart,
    end: columnEnd,
    dayStartMinute,
    dayEndMinute,
    index: columnIndex,
    hasFocus: columnHasFocus,
    getCursorPositionInElementMs,
  } = useCalendarGridTimeColumnContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // State hooks
  const id = useId(idProp);

  // Feature hooks
  const getOriginalOccurrence = useOriginalOccurrence({
    eventId,
    occurrenceKey,
    start,
    end,
    dataBounds,
  });

  const getSharedDragData: CalendarGridTimeEventContext['getSharedDragData'] = useStableCallback(
    (input) => {
      // No `input` (pointer-based resize) — skip the layout-reading cursor measurement.
      const initialCursorPositionInEventMs = input
        ? Math.max(adapter.getTime(columnStart) - start.timestamp, 0) +
          getCursorPositionInElementMs({ input, elementRef: ref })
        : 0;

      return {
        eventId,
        occurrenceKey,
        originalOccurrence: getOriginalOccurrence(),
        start: start.value,
        end: end.value,
        initialCursorPositionInEventMs,
      };
    },
  );

  const getDragData = useStableCallback((input) => ({
    ...getSharedDragData(input),
    source: 'CalendarGridTimeEvent',
  }));

  const elementPosition = useElementPositionInCollection({
    start,
    end,
    collection: { start: columnStart, end: columnEnd, dayStartMinute, dayEndMinute },
  });
  const { position, duration } = elementPosition;

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
    position: elementPosition,
  });

  const { getButtonProps, buttonRef } = useButton({
    disabled: false,
    native: nativeButton,
    tabIndex: columnHasFocus ? 0 : -1,
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
        // A non-interactive event stays a plain div: no role, no tabIndex, no header label.
        ...(interactive ? { 'aria-labelledby': `${columnHeaderId} ${id}` } : undefined),
        style: {
          [CalendarGridTimeEventCssVars.yPosition]: `${position * 100}%`,
          [CalendarGridTimeEventCssVars.height]: `${duration * 100}%`,
        } as React.CSSProperties,
      },
      ...(interactive ? [getButtonProps] : []),
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
      useDraggableEvent.PublicParameters,
      Pick<useOriginalOccurrence.Parameters, 'dataBounds'> {
    /**
     * Whether the event behaves like a button: `role="button"`, roving `tabIndex` and the column
     * header labelling. Set it to `false` for an inert preview (creation / resize placeholder) that
     * only hosts pointer interactions — it then renders a plain `div`, so it is never focusable.
     * @default true
     */
    interactive?: boolean;
  }

  export interface SharedDragData {
    eventId: SchedulerEventId;
    occurrenceKey: string;
    originalOccurrence: SchedulerEventOccurrence;
    start: TemporalSupportedObject;
    end: TemporalSupportedObject;
    initialCursorPositionInEventMs: number;
    sourceResourceId?: SchedulerResourceId;
  }

  export interface DragData extends SharedDragData {
    source: 'CalendarGridTimeEvent';
  }
}
