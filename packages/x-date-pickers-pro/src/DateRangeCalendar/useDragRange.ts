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

  // Guard against malformed `data-timestamp` — `Number('abc')` is `NaN` and
  // `new Date(NaN).toISOString()` throws, which would otherwise wedge the
  // gesture mid-`pointerover`.
  const timestamp = Number(timestampString);
  if (!Number.isFinite(timestamp)) {
    return null;
  }

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
  // Last cell the pointer hovered. Used to dedupe `pointerover` (which fires
  // repeatedly within the same cell), and as the drop fallback for
  // `pointercancel` (whose `event.target` is unreliable across browsers).
  const lastHoveredCellRef = React.useRef<HTMLElement | null>(null);
  // Each entry removes one document listener the gesture installed.
  const listenerCleanupsRef = React.useRef<Array<() => void>>([]);
  // Outstanding capture-phase click suppressor, if any. Tracked so back-to-back
  // drags can tear the prior one down before installing a new one.
  const clickSuppressorRef = React.useRef<(() => void) | null>(null);

  const isElementDraggable = (day: PickerValidDate | null): day is PickerValidDate => {
    if (day == null) {
      return false;
    }

    const shouldInitDragging = !disableDragEditing && !!dateRange[0] && !!dateRange[1];
    const isSelectedStartDate = isStartOfRange(adapter, day, dateRange);
    const isSelectedEndDate = isEndOfRange(adapter, day, dateRange);

    return shouldInitDragging && (isSelectedStartDate || isSelectedEndDate);
  };

  // Resets every ref the gesture mutated and removes any listeners installed
  // during the gesture. Safe to call from event handlers and from unmount.
  // Only reads refs, so its closure never changes — memoized for stable
  // identity (referenced by `cleanup` and the unmount effect).
  const clearGestureState = useEventCallback(() => {
    isDraggingRef.current = false;
    pointerIdRef.current = null;
    sourceDateRef.current = null;
    sourcePositionRef.current = null;
    didMoveRef.current = false;
    lastHoveredCellRef.current = null;
    listenerCleanupsRef.current.forEach((teardown) => teardown());
    listenerCleanupsRef.current = [];
    // Also tear down any in-flight click suppressor — without this, an
    // unmount in the brief window between `pointerup` and the
    // `setTimeout(0)` teardown leaves a capture-phase listener attached
    // to `document` that swallows the next click on unrelated UI.
    clickSuppressorRef.current?.();
  });

  const cleanup = useEventCallback(() => {
    const wasActive = didMoveRef.current;
    clearGestureState();
    // A press without movement never activated drag UI, so skip the re-render.
    if (wasActive) {
      setIsDragging(false);
      setRangeDragDay(null);
    }
  });

  const installClickSuppressor = (doc: Document) => {
    // Tear down a prior outstanding suppressor first; back-to-back drags
    // would otherwise race two listeners on the document.
    clickSuppressorRef.current?.();

    // suppress and teardown reference each other, so forward-declare suppress.
    let suppress: (event: Event) => void;
    const teardown = () => {
      doc.removeEventListener('click', suppress, { capture: true });
      if (clickSuppressorRef.current === teardown) {
        clickSuppressorRef.current = null;
      }
    };
    suppress = (clickEvent: Event) => {
      clickEvent.preventDefault();
      // `stopImmediatePropagation` (rather than just `stopPropagation`) so
      // other capture-phase click listeners on `document` — analytics, focus
      // traps, third-party overlays — don't observe the synthesized
      // post-drag click as if the user intentionally clicked the cell.
      clickEvent.stopImmediatePropagation();
      teardown();
    };
    doc.addEventListener('click', suppress, { capture: true });
    clickSuppressorRef.current = teardown;
    // If no click ever fires (drop on a different cell, browser doesn't
    // synthesize), tear the listener down so it doesn't leak.
    setTimeout(teardown, 0);
  };

  const finalizeGesture = (
    event: PointerEvent,
    ownerDoc: Document,
    eventType: 'pointerup' | 'pointercancel',
  ) => {
    const wasMoved = didMoveRef.current;
    const sourceDate = sourceDateRef.current;

    // For `pointerup`, the drop target is whatever element the pointer was
    // actually over at release time — releasing into a gap or off the calendar
    // resolves to `null` and cancels, matching native HTML5 drag.
    // For `pointercancel`, `event.target` can be unreliable (browsers vary on
    // whether it's the current under-pointer element or the gesture's start
    // element). Fall back to the last cell the user hovered, which is the
    // closest expression of their intent.
    let dropOrigin: HTMLElement | null;
    if (eventType === 'pointercancel') {
      dropOrigin = lastHoveredCellRef.current;
    } else {
      dropOrigin = event.target instanceof HTMLElement ? event.target : null;
    }
    const dropCell = getClosestElementWithDataAttribute(dropOrigin, 'timestamp');
    const newDate = dropCell ? resolveDateFromTarget(dropCell, adapter, timezone) : null;
    // Resolve the focusable `<button>` separately from `dropCell`. Today
    // `data-timestamp` lives on the button itself, but a future custom slot
    // could put it on a wrapper; in that case the cell isn't focusable and
    // the disabled state lives on the inner button.
    const dropButton = (dropOrigin?.closest('button') ??
      dropCell?.querySelector('button') ??
      null) as HTMLButtonElement | null;

    // `shouldDisableDate` / min-max / readOnly mark the day's button as
    // `disabled`. `pointerup` still lands on a disabled `<button>` in
    // Chromium/WebKit, so guard explicitly — `DateRangeCalendar.handleDrop`
    // doesn't re-validate the date.
    const isDropDisabled = dropButton?.disabled === true;

    cleanup();

    if (eventType === 'pointerup' && wasMoved && dropCell) {
      // The click that follows pointerup on a day cell would re-enter the
      // day's selection logic and undo the drop (or, when the drag returned
      // to the source, replace the range with a single-day selection).
      // Swallow it. Gated on `dropCell` so a release outside the calendar
      // doesn't swallow an unrelated click on the host UI.
      installClickSuppressor(ownerDoc);
    }

    if (
      wasMoved &&
      newDate &&
      sourceDate &&
      !isDropDisabled &&
      !adapter.isEqual(newDate, sourceDate)
    ) {
      dropButton?.focus();
      onDrop(newDate);
    }
  };

  // `touchmove`-blocks-scroll listener. Attached eagerly in
  // `handlePointerDown` for touch pointers only. Mouse/pen don't fire touch
  // events. Stable at hook level so the listener identity is consistent
  // across renders.
  const onTouchMove = useEventCallback((touchEvent: TouchEvent) => {
    if (isDraggingRef.current) {
      // `touch-action: none` on the source cell isn't enough once the finger
      // crosses cell boundaries.
      touchEvent.preventDefault();
    }
  });

  const handlePointerDown = useEventCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    // Ignore secondary mouse buttons (middle = 1, right = 2). `> 0` rather
    // than `!== 0` keeps the gesture permissive when `event.button` is left
    // unset by a synthetic event (some test environments).
    if (event.button > 0) {
      return;
    }

    // Secondary multi-touch pointers (second finger, etc.) are explicitly
    // not-primary; let them pass through without disturbing the active gesture.
    if (event.isPrimary === false) {
      return;
    }

    const newDate = resolveDateFromTarget(event.currentTarget, adapter, timezone);
    if (!isElementDraggable(newDate)) {
      return;
    }

    // A fresh primary pointerdown definitionally ends any previous gesture
    // (covers pen+touch, where each pointer type has its own primary, and
    // the recovery case where the original gesture's `pointerup` was lost).
    if (pointerIdRef.current != null) {
      cleanup();
    }

    // Touch implicitly captures the pointer on `pointerdown`, pinning all
    // subsequent events to the source. Release so sibling cells receive their
    // own `pointerover`. jsdom lacks the API; Safari 15 / some Android WebViews
    // race between the `hasPointerCapture` check and the release call and throw
    // `InvalidPointerId` — benign, swallow it.
    try {
      if (
        typeof event.currentTarget.hasPointerCapture === 'function' &&
        event.currentTarget.hasPointerCapture(event.pointerId)
      ) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // already released, nothing to do
    }

    // Note: deliberately not calling `event.preventDefault()` here. Doing so
    // would suppress the synthesized click that follows pointerup, which is
    // load-bearing for tap-to-advance on an endpoint cell. The iOS magnifier
    // is held off by `touch-action: none` + `user-select: none` on the cell.

    pointerIdRef.current = event.pointerId;
    isDraggingRef.current = true;
    sourceDateRef.current = newDate;
    didMoveRef.current = false;
    lastHoveredCellRef.current = event.currentTarget;

    // Walk up rather than reading `currentTarget.dataset` directly so the
    // hook keeps working if a future slot puts `data-position` on a wrapper
    // around the cell (mirrors how we resolve `data-timestamp`).
    const positionHost = getClosestElementWithDataAttribute(event.currentTarget, 'position');
    sourcePositionRef.current =
      (positionHost?.dataset.position as RangePosition | undefined) ?? null;

    // Use the owner document (matters for iframe-hosted pickers) for all
    // document-level listeners.
    const ownerDoc = event.currentTarget.ownerDocument ?? document;

    // Drag UI activation is deferred until the first real move — a pure
    // press on an endpoint must leave selection state alone so the click
    // handler can advance it normally.

    const onPointerUp = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== pointerIdRef.current) {
        return;
      }
      finalizeGesture(pointerEvent, ownerDoc, 'pointerup');
    };

    const onPointerCancel = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== pointerIdRef.current) {
        return;
      }
      // Spec intent of `pointercancel` is "UA interrupted, not the user".
      // After real movement, commit the drop the user worked for; the snap-back
      // would otherwise be silent and inexplicable.
      finalizeGesture(pointerEvent, ownerDoc, 'pointercancel');
    };

    const onKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key !== 'Escape' || !didMoveRef.current) {
        // No visible drag to cancel. Leave the gesture intact and let
        // Escape propagate (host modal/popover can still close on it).
        // A press without movement behaves identically to a tap on
        // release — letting cleanup run here would only half-collapse
        // the gesture without suppressing the eventual tap-to-advance.
        return;
      }
      keyEvent.preventDefault();
      cleanup();
    };

    ownerDoc.addEventListener('pointerup', onPointerUp);
    ownerDoc.addEventListener('pointercancel', onPointerCancel);
    ownerDoc.addEventListener('keydown', onKeyDown);
    listenerCleanupsRef.current.push(
      () => ownerDoc.removeEventListener('pointerup', onPointerUp),
      () => ownerDoc.removeEventListener('pointercancel', onPointerCancel),
      () => ownerDoc.removeEventListener('keydown', onKeyDown),
    );

    // For touch input, attach the scroll-suppression listener up front rather
    // than lazily on first movement. The Pointer Events spec latches
    // `touch-action: none` from the source cell over the rest of the gesture,
    // but real-world WebKit/Chromium versions don't always honor that —
    // attaching eagerly closes that window. Mouse and pen don't fire touch
    // events so they don't need it.
    if (event.pointerType === 'touch') {
      ownerDoc.addEventListener('touchmove', onTouchMove, { passive: false });
      listenerCleanupsRef.current.push(() =>
        ownerDoc.removeEventListener('touchmove', onTouchMove),
      );
    }
  });

  // Use `pointerover` (bubbles) rather than `pointerenter`: React's
  // `onPointerEnter` is implemented on top of over/out.
  const handlePointerOver = useEventCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current || event.pointerId !== pointerIdRef.current) {
      return;
    }

    if (lastHoveredCellRef.current === event.currentTarget) {
      return;
    }

    const newDate = resolveDateFromTarget(event.currentTarget, adapter, timezone);
    if (!newDate) {
      return;
    }

    lastHoveredCellRef.current = event.currentTarget;

    const isDifferentFromSource =
      sourceDateRef.current && !adapter.isEqual(newDate, sourceDateRef.current);

    if (!didMoveRef.current && isDifferentFromSource) {
      // A custom day slot could strip `data-position`; without it the preview
      // would compute against the wrong endpoint, so abort the drag rather
      // than rendering something misleading.
      if (!sourcePositionRef.current) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            'MUI X: A drag was initiated on a day cell missing `data-position`. ' +
              'Drag editing requires the cell to advertise which range endpoint it represents.',
          );
        }
        return;
      }

      // First real move: activate drag UI and tell the parent which endpoint
      // is being dragged so the preview computes against the correct side.
      didMoveRef.current = true;
      onDatePositionChange(sourcePositionRef.current);
      setIsDragging(true);
    }

    if (didMoveRef.current) {
      setRangeDragDay(newDate);
    }
  });

  // On unmount, clear gesture state so a remount can start fresh and any
  // detached DOM nodes still referenced by gesture refs can be GC'd.
  // `clearGestureState` is `useEventCallback`-stable, so the effect runs once.
  React.useEffect(() => () => clearGestureState(), [clearGestureState]);

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
