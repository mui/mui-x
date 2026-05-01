'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { isHTMLElement } from '@mui/x-internals/domUtils';
import { MuiPickersAdapter, PickersTimezone, PickerValidDate } from '@mui/x-date-pickers/models';
import { PickerRangeValue } from '@mui/x-date-pickers/internals';
import { RangePosition } from '../models';
import { isEndOfRange, isStartOfRange } from '../internals/utils/date-utils';

interface UseDragRangeParams {
  disableDragEditing?: boolean;
  adapter: MuiPickersAdapter;
  setRangeDragDay: (value: PickerValidDate | null) => void;
  setIsDragging: (value: boolean) => void;
  onDatePositionChange: (position: RangePosition) => void;
  onDrop: (newDate: PickerValidDate) => void;
  dateRange: PickerRangeValue;
  timezone: PickersTimezone;
}

interface UseDragRangeEvents {
  onPointerDown?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerOver?: React.PointerEventHandler<HTMLButtonElement>;
  onDragStart?: React.DragEventHandler<HTMLButtonElement>;
}

interface UseDragRangeResponse extends UseDragRangeEvents {
  isDragging: boolean;
  rangeDragDay: PickerValidDate | null;
  draggingDatePosition: RangePosition | null;
}

/**
 * Finds the closest ancestor element (or the element itself) that has the specified data attribute.
 * Pointer events can target child elements (e.g. text spans, ripples) inside the day button,
 * which don't carry the data attributes directly.
 *
 * @param dataAttribute Must be a single lowercase word (e.g. 'timestamp', 'position') because
 *   `dataset[attr]` uses camelCase while `.closest()` uses kebab-case, and these only align
 *   for single-word names.
 */
const getClosestElementWithDataAttribute = (
  element: HTMLElement | null,
  dataAttribute: string,
): HTMLElement | null => {
  if (!element) {
    return null;
  }
  return element.dataset[dataAttribute] != null
    ? element
    : element.closest<HTMLElement>(`[data-${dataAttribute}]`);
};

const resolveDateFromTarget = (
  target: EventTarget | null,
  adapter: MuiPickersAdapter,
  timezone: PickersTimezone,
) => {
  if (!isHTMLElement(target)) {
    return null;
  }

  const element = getClosestElementWithDataAttribute(target, 'timestamp');
  const timestampString = element?.dataset.timestamp;
  if (!timestampString) {
    return null;
  }

  const timestamp = Number(timestampString);
  return adapter.date(new Date(timestamp).toISOString(), timezone);
};

const useDragRangeEvents = ({
  adapter,
  setRangeDragDay,
  setIsDragging,
  onDatePositionChange,
  onDrop,
  disableDragEditing,
  dateRange,
  timezone,
}: UseDragRangeParams): UseDragRangeEvents => {
  const isDraggingRef = React.useRef(false);
  const pointerIdRef = React.useRef<number | null>(null);
  const sourceDateRef = React.useRef<PickerValidDate | null>(null);
  const didMoveRef = React.useRef(false);
  const pendingDropRef = React.useRef<{ date: PickerValidDate; target: HTMLElement } | null>(null);
  const cleanupListenersRef = React.useRef<(() => void) | null>(null);

  const isElementDraggable = (day: PickerValidDate | null): day is PickerValidDate => {
    if (day == null) {
      return false;
    }

    const shouldInitDragging = !disableDragEditing && !!dateRange[0] && !!dateRange[1];
    const isSelectedStartDate = isStartOfRange(adapter, day, dateRange);
    const isSelectedEndDate = isEndOfRange(adapter, day, dateRange);

    return shouldInitDragging && (isSelectedStartDate || isSelectedEndDate);
  };

  const cleanup = useEventCallback(() => {
    isDraggingRef.current = false;
    pointerIdRef.current = null;
    sourceDateRef.current = null;
    didMoveRef.current = false;
    pendingDropRef.current = null;
    setIsDragging(false);
    setRangeDragDay(null);
    cleanupListenersRef.current?.();
    cleanupListenersRef.current = null;
  });

  const handlePointerDown = useEventCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    // Ignore secondary mouse buttons (middle, right). Touch and pen always
    // report `button === 0`. Some test environments (jsdom) leave the
    // property undefined, treat that as primary.
    if (event.button > 0) {
      return;
    }

    const newDate = resolveDateFromTarget(event.currentTarget, adapter, timezone);
    if (!isElementDraggable(newDate)) {
      return;
    }

    // Touch devices implicitly capture the pointer on `pointerdown`, which keeps
    // every subsequent `pointermove`/`pointerover` firing on the source element.
    // Releasing the capture lets sibling cells receive their own pointer events
    // as the finger moves across the grid — same trick `usePress` uses.
    // jsdom doesn't implement the pointer-capture API, so guard the call.
    if (
      typeof event.currentTarget.hasPointerCapture === 'function' &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    event.stopPropagation();

    pointerIdRef.current = event.pointerId;
    isDraggingRef.current = true;
    sourceDateRef.current = newDate;
    didMoveRef.current = false;
    pendingDropRef.current = { date: newDate, target: event.currentTarget };

    setRangeDragDay(newDate);
    setIsDragging(true);

    const { position } = event.currentTarget.dataset;
    if (position) {
      onDatePositionChange(position as RangePosition);
    }

    const onPointerUp = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== pointerIdRef.current) {
        return;
      }

      const wasMoved = didMoveRef.current;
      const dropInfo = pendingDropRef.current;
      const sourceDate = sourceDateRef.current;

      cleanup();

      if (wasMoved) {
        // Pointer release would normally be followed by a synthesized click on
        // whatever element we landed on. After a drag, that click would re-enter
        // the day's regular selection logic and undo the drop, so swallow it.
        // If no click ever fires (e.g. pointerdown and pointerup were on different
        // elements, so the browser doesn't synthesize one), remove the listener
        // on the next macrotask so it doesn't leak into the next interaction.
        const suppressClick = (clickEvent: Event) => {
          clickEvent.preventDefault();
          clickEvent.stopPropagation();
          document.removeEventListener('click', suppressClick, { capture: true });
        };
        document.addEventListener('click', suppressClick, { capture: true });
        setTimeout(() => {
          document.removeEventListener('click', suppressClick, { capture: true });
        }, 0);
      }

      if (wasMoved && dropInfo && sourceDate && !adapter.isEqual(dropInfo.date, sourceDate)) {
        dropInfo.target.focus();
        onDrop(dropInfo.date);
      }
    };

    const onPointerCancel = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== pointerIdRef.current) {
        return;
      }
      cleanup();
    };

    const onTouchMove = (touchEvent: TouchEvent) => {
      // While dragging, suppress the browser default touch action so the page
      // doesn't scroll out from under the gesture. `touch-action: none` on the
      // source cell isn't enough once the finger leaves the cell.
      if (isDraggingRef.current) {
        touchEvent.preventDefault();
      }
    };

    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    cleanupListenersRef.current = () => {
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointercancel', onPointerCancel);
      document.removeEventListener('touchmove', onTouchMove);
    };
  });

  // `pointerover` (which bubbles) is preferred over `pointerenter` (which doesn't):
  // React's synthetic enter/leave is implemented on top of over/out, and only
  // bubbling events round-trip cleanly through testing-library's `fireEvent`.
  // We dedupe by checking whether the would-drop target already matches.
  const handlePointerOver = useEventCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current || event.pointerId !== pointerIdRef.current) {
      return;
    }

    if (pendingDropRef.current?.target === event.currentTarget) {
      return;
    }

    const newDate = resolveDateFromTarget(event.currentTarget, adapter, timezone);
    if (!newDate) {
      return;
    }

    pendingDropRef.current = { date: newDate, target: event.currentTarget };
    if (sourceDateRef.current && !adapter.isEqual(newDate, sourceDateRef.current)) {
      didMoveRef.current = true;
    }
    setRangeDragDay(newDate);
  });

  React.useEffect(
    () => () => {
      cleanupListenersRef.current?.();
    },
    [],
  );

  // The day cells still set `draggable="true"` (used to drive the
  // `cursor: grab` styling). Without an `onDragStart` handler that cancels
  // the default, browsers would start their own native HTML5 drag and show
  // a ghost element on top of our pointer-driven drag.
  const handleDragStart = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
  });

  return {
    onPointerDown: handlePointerDown,
    onPointerOver: handlePointerOver,
    onDragStart: handleDragStart,
  };
};

export const useDragRange = ({
  disableDragEditing,
  adapter,
  onDatePositionChange,
  onDrop,
  dateRange,
  timezone,
}: Omit<UseDragRangeParams, 'setRangeDragDay' | 'setIsDragging'>): UseDragRangeResponse => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [rangeDragDay, setRangeDragDay] = React.useState<PickerValidDate | null>(null);

  const handleRangeDragDayChange = useEventCallback((newValue: PickerValidDate | null) => {
    if (!adapter.isEqual(newValue, rangeDragDay)) {
      setRangeDragDay(newValue);
    }
  });

  const draggingDatePosition: RangePosition | null = React.useMemo(() => {
    const [start, end] = dateRange;
    if (rangeDragDay) {
      if (start && adapter.isBefore(rangeDragDay, start)) {
        return 'start';
      }
      if (end && adapter.isAfter(rangeDragDay, end)) {
        return 'end';
      }
    }
    return null;
  }, [dateRange, rangeDragDay, adapter]);

  const dragRangeEvents = useDragRangeEvents({
    adapter,
    onDatePositionChange,
    onDrop,
    setIsDragging,
    setRangeDragDay: handleRangeDragDayChange,
    disableDragEditing,
    dateRange,
    timezone,
  });

  return React.useMemo(
    () => ({
      isDragging,
      rangeDragDay,
      draggingDatePosition,
      ...(!disableDragEditing ? dragRangeEvents : {}),
    }),
    [isDragging, rangeDragDay, draggingDatePosition, disableDragEditing, dragRangeEvents],
  );
};
