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
}

interface UseDragRangeResponse extends UseDragRangeEvents {
  isDragging: boolean;
  rangeDragDay: PickerValidDate | null;
  draggingDatePosition: RangePosition | null;
}

/**
 * Returns the element (or its closest ancestor) carrying `data-{attr}`.
 * Single-word `attr` only — `dataset[attr]` (camelCase) and `.closest()`
 * (kebab-case) only agree for single-word names.
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
  const sourcePositionRef = React.useRef<RangePosition | null>(null);
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
    const wasActive = didMoveRef.current;
    isDraggingRef.current = false;
    pointerIdRef.current = null;
    sourceDateRef.current = null;
    sourcePositionRef.current = null;
    didMoveRef.current = false;
    pendingDropRef.current = null;
    // A press without movement never activated drag UI, so skip the re-render.
    if (wasActive) {
      setIsDragging(false);
      setRangeDragDay(null);
    }
    cleanupListenersRef.current?.();
    cleanupListenersRef.current = null;
  });

  const handlePointerDown = useEventCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    // Ignore secondary mouse buttons. `> 0` (not `!== 0`) so an undefined
    // `button` (jsdom) is treated as primary.
    if (event.button > 0) {
      return;
    }

    // Drop re-entrant pointerdowns: a second pointer (multi-touch, pen+touch)
    // arriving mid-gesture would overwrite our state and leak listeners. The
    // `pointerIdRef` check also covers pen+touch (each pointer type has its
    // own primary) and recovery from a lost `pointerup`.
    if (pointerIdRef.current != null || event.isPrimary === false) {
      return;
    }

    const newDate = resolveDateFromTarget(event.currentTarget, adapter, timezone);
    if (!isElementDraggable(newDate)) {
      return;
    }

    // Touch implicitly captures the pointer on `pointerdown`, pinning all
    // subsequent events to the source. Release so sibling cells receive their
    // own `pointerover` (jsdom lacks the capture API — guard the call).
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

    const { position } = event.currentTarget.dataset;
    sourcePositionRef.current = (position as RangePosition | undefined) ?? null;

    // Drag UI activation is deferred to `handlePointerOver`'s first real
    // move — a pure tap on an endpoint must leave `rangePosition` alone
    // so the click handler can advance it normally.

    const onPointerUp = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== pointerIdRef.current) {
        return;
      }

      const wasMoved = didMoveRef.current;
      const dropInfo = pendingDropRef.current;
      const sourceDate = sourceDateRef.current;

      cleanup();

      if (wasMoved) {
        // Swallow the click that follows pointerup — it would re-enter the
        // day's selection logic and undo the drop. If no click fires (drop on
        // a different cell), tear the listener down on the next macrotask so
        // it doesn't leak into the next interaction.
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
      // Suppress page scroll while dragging — `touch-action: none` on the
      // source cell isn't enough once the finger leaves it.
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

  // Use `pointerover` (bubbles) rather than `pointerenter`: React's
  // `onPointerEnter` is built on top of over/out, and only bubbling events
  // round-trip through testing-library's `fireEvent`.
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

    const isDifferentFromSource =
      sourceDateRef.current && !adapter.isEqual(newDate, sourceDateRef.current);

    if (!didMoveRef.current && isDifferentFromSource) {
      // First real move: activate drag UI and tell the parent which endpoint
      // is being dragged so the preview computes against the correct side.
      didMoveRef.current = true;
      if (sourcePositionRef.current) {
        onDatePositionChange(sourcePositionRef.current);
      }
      setIsDragging(true);
    }

    if (didMoveRef.current) {
      setRangeDragDay(newDate);
    }
  });

  React.useEffect(
    () => () => {
      cleanupListenersRef.current?.();
    },
    [],
  );

  return {
    onPointerDown: handlePointerDown,
    onPointerOver: handlePointerOver,
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
