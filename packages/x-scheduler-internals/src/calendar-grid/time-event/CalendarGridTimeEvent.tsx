'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useButton } from '@base-ui/react/internals/use-button';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps, NonNativeButtonProps } from '@base-ui/react/internals/types';
import { CalendarGridTimeEventCssVars } from './CalendarGridTimeEventCssVars';
import { useCalendarGridTimeColumnContext } from '../time-column/CalendarGridTimeColumnContext';
import { useDraggableEvent } from '../../internals/utils/useDraggableEvent';
import { computeElementPositionInCollection } from '../../internals/utils/useElementPositionInCollection';
import type { useElementPositionInCollection } from '../../internals/utils/useElementPositionInCollection';
import { CalendarGridTimeEventContext } from './CalendarGridTimeEventContext';
import type { SchedulerEventId, SchedulerEventOccurrence, SchedulerResourceId } from '../../models';
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
    eventId,
    occurrenceKey,
    renderDragPreview,
    isDraggable = false,
    elementPosition: elementPositionProp,
    nativeButton = false,
    interactive = true,
    href,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // Context hooks
  const {
    axis: columnAxis,
    hasFocus: columnHasFocus,
    getCursorPositionInElementMs,
  } = useCalendarGridTimeColumnContext();
  const columnStart = columnAxis.start;

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Feature hooks
  const getOriginalOccurrence = useOriginalOccurrence({
    eventId,
    occurrenceKey,
    start,
    end,
  });

  const getSharedDragData: CalendarGridTimeEventContext['getSharedDragData'] = useStableCallback(
    (input) => {
      // No `input` (pointer-based resize) — skip the layout-reading cursor measurement.
      const initialCursorPositionInEventMs = input
        ? Math.max(columnStart - start.epochMilliseconds, 0) +
          getCursorPositionInElementMs({
            input,
            elementRef: ref,
            elementStart: start.epochMilliseconds,
          })
        : 0;

      return {
        eventId,
        occurrenceKey,
        originalOccurrence: getOriginalOccurrence(),
        start: start.epochMilliseconds,
        end: end.epochMilliseconds,
        initialCursorPositionInEventMs,
      };
    },
  );

  const getDragData = useStableCallback((input) => ({
    ...getSharedDragData(input),
    source: 'CalendarGridTimeEvent',
  }));

  const elementPosition = React.useMemo(
    () =>
      elementPositionProp ??
      computeElementPositionInCollection({ start, end, collection: columnAxis }),
    [columnAxis, elementPositionProp, end, start],
  );
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

  // An empty `href` would link to the current page.
  const isLink = interactive && !!href;
  const tabIndex = columnHasFocus ? 0 : -1;
  const { getButtonProps, buttonRef } = useButton({
    disabled: false,
    native: nativeButton && !isLink,
    tabIndex,
  });

  const mergedState = { ...state, link: isLink };

  const contextValue: CalendarGridTimeEventContext = React.useMemo(
    () => ({ ...draggableEventContextValue, getSharedDragData }),
    [draggableEventContextValue, getSharedDragData],
  );

  const element = useRenderElement(isLink ? 'a' : 'div', componentProps, {
    state: mergedState,
    ref: [forwardedRef, buttonRef, ref],
    props: [
      elementProps,
      {
        style: {
          [CalendarGridTimeEventCssVars.yPosition]: `${position * 100}%`,
          [CalendarGridTimeEventCssVars.height]: `${duration * 100}%`,
        } as React.CSSProperties,
      },
      // A link keeps the native link behavior, so it only needs the roving `tabIndex`.
      ...(interactive ? [isLink ? { href, tabIndex } : getButtonProps] : []),
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
  export interface State extends useDraggableEvent.State {
    /**
     * Whether the event renders as a link.
     */
    link: boolean;
  }

  export interface Props
    extends
      BaseUIComponentProps<'div', State>,
      NonNativeButtonProps,
      useDraggableEvent.PublicParameters {
    /**
     * Whether the event behaves like a button, or like a link when `href` is set, with a roving `tabIndex`.
     * Set it to `false` for an inert preview (creation / resize placeholder) that
     * only hosts pointer interactions — it then renders a plain `div`, so it is never focusable.
     * @default true
     */
    interactive?: boolean;
    /**
     * The URL the event links to.
     * When provided, the event renders as a link instead of a button, unless `interactive` is `false`.
     * A custom `render` element must be an `<a>`.
     */
    href?: string;
    /**
     * The position of the event in its column, computed from `start` and `end` when not provided.
     */
    elementPosition?: useElementPositionInCollection.ReturnValue;
  }

  export interface SharedDragData {
    eventId: SchedulerEventId;
    occurrenceKey: string;
    originalOccurrence: SchedulerEventOccurrence;
    /**
     * The start of the occurrence, as a timestamp in milliseconds.
     */
    start: number;
    /**
     * The end of the occurrence, as a timestamp in milliseconds.
     */
    end: number;
    initialCursorPositionInEventMs: number;
    sourceResourceId?: SchedulerResourceId;
  }

  export interface DragData extends SharedDragData {
    source: 'CalendarGridTimeEvent';
  }
}
