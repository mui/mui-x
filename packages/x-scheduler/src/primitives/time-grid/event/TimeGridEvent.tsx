'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useStore } from '@base-ui-components/utils/store';
import { useButton } from '../../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridEventCssVars } from './TimeGridEventCssVars';
import { useTimeGridColumnContext } from '../column/TimeGridColumnContext';
import { useEvent } from '../../utils/useEvent';
import { useElementPositionInCollection } from '../../utils/useElementPositionInCollection';
import { SchedulerValidDate } from '../../models';
import { TimeGridEventContext } from './TimeGridEventContext';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { useEventCalendarStoreContext } from '../../utils/useEventCalendarStoreContext';
import { selectors } from '../../use-event-calendar';

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
    occurrenceKey,
    isDraggable = false,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  const adapter = useAdapter();
  const ref = React.useRef<HTMLDivElement>(null);
  const store = useEventCalendarStoreContext();
  const isDragging = useStore(store, selectors.isOccurrenceMatchingThePlaceholder, occurrenceKey);
  const [isResizing, setIsResizing] = React.useState(false);
  const { getButtonProps, buttonRef } = useButton({ disabled: !isInteractive });

  const {
    start: columnStart,
    end: columnEnd,
    getCursorPositionInElementMs,
  } = useTimeGridColumnContext();

  const { position, duration } = useElementPositionInCollection({
    start,
    end,
    collectionStart: columnStart,
    collectionEnd: columnEnd,
  });

  const style = React.useMemo(
    () =>
      ({
        [TimeGridEventCssVars.yPosition]: `${position * 100}%`,
        [TimeGridEventCssVars.height]: `${duration * 100}%`,
      }) as React.CSSProperties,
    [position, duration],
  );

  const props = React.useMemo(() => ({ style }), [style]);

  const { state: eventState } = useEvent({ start, end });

  const state: TimeGridEvent.State = React.useMemo(
    () => ({ ...eventState, dragging: isDragging, resizing: isResizing }),
    [eventState, isDragging, isResizing],
  );

  const getSharedDragData: TimeGridEventContext['getSharedDragData'] = useEventCallback((input) => {
    const offsetBeforeColumnStart = Math.max(
      adapter.toJsDate(columnStart).getTime() - adapter.toJsDate(start).getTime(),
      0,
    );
    const offsetInsideColumn = getCursorPositionInElementMs({ input, elementRef: ref });
    return {
      eventId,
      occurrenceKey,
      start,
      end,
      initialCursorPositionInEventMs: offsetBeforeColumnStart + offsetInsideColumn,
    };
  });

  const doesEventStartBeforeColumnStart = React.useMemo(
    () => adapter.isBefore(start, columnStart),
    [adapter, start, columnStart],
  );

  const doesEventEndAfterColumnEnd = React.useMemo(
    () => adapter.isAfter(end, columnEnd),
    [adapter, end, columnEnd],
  );

  const contextValue: TimeGridEventContext = React.useMemo(
    () => ({
      setIsResizing,
      getSharedDragData,
      doesEventStartBeforeColumnStart,
      doesEventEndAfterColumnEnd,
    }),
    [getSharedDragData, doesEventStartBeforeColumnStart, doesEventEndAfterColumnEnd],
  );

  React.useEffect(() => {
    if (!isDraggable) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return draggable({
      element: ref.current!,
      getInitialData: ({ input }) => ({
        ...getSharedDragData(input),
        source: 'TimeGridEvent',
      }),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
      },
      onDrop: () => store.setOccurrencePlaceholder(null),
    });
  }, [getSharedDragData, isDraggable, store]);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef, ref],
    props: [props, elementProps, getButtonProps],
  });

  return (
    <TimeGridEventContext.Provider value={contextValue}>{element}</TimeGridEventContext.Provider>
  );
});

export namespace TimeGridEvent {
  export interface State extends useEvent.State {
    /**
     * Whether the event is being dragged.
     */
    dragging: boolean;
    /**
     * Whether the event is being resized.
     */
    resizing: boolean;
  }

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {
    /**
     * The unique identifier of the event.
     */
    eventId: string | number;
    /**
     * The unique identifier of the event occurrence.
     */
    occurrenceKey: string;
    /**
     * Whether the event can be dragged to change its start and end dates or times without changing the duration.
     * @default false
     */
    isDraggable?: boolean;
  }

  export interface SharedDragData {
    eventId: string | number;
    occurrenceKey: string;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
    initialCursorPositionInEventMs: number;
  }

  export interface DragData extends SharedDragData {
    source: 'TimeGridEvent';
  }
}
