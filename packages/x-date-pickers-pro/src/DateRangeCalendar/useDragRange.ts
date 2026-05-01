'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { getTarget, isHTMLElement } from '@mui/x-internals/domUtils';
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
  onDragStart?: React.DragEventHandler<HTMLButtonElement>;
  onDragEnter?: React.DragEventHandler<HTMLButtonElement>;
  onDragLeave?: React.DragEventHandler<HTMLButtonElement>;
  onDragOver?: React.DragEventHandler<HTMLButtonElement>;
  onDragEnd?: React.DragEventHandler<HTMLButtonElement>;
  onDrop?: React.DragEventHandler<HTMLButtonElement>;
}

interface UseDragRangeResponse extends UseDragRangeEvents {
  isDragging: boolean;
  rangeDragDay: PickerValidDate | null;
  draggingDatePosition: RangePosition | null;
}

/**
 * Finds the closest ancestor element (or the element itself) that has the specified data attribute.
 * This is needed because drag events can target child elements (e.g., text spans)
 * inside the button, which don't have the data attributes directly.
 *
 * @param element The element to start searching from.
 * @param dataAttribute The data attribute name — must be a single lowercase word
 *   (e.g., 'timestamp', 'position') because `dataset[attr]` uses camelCase
 *   while `.closest()` uses kebab-case, and these only align for single-word names.
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

const isSameAsDraggingDate = (event: React.DragEvent<HTMLButtonElement>) => {
  const target = getTarget(event.nativeEvent);
  if (!isHTMLElement(target)) {
    return false;
  }
  const element = getClosestElementWithDataAttribute(target, 'timestamp');
  return element?.dataset.timestamp === event.dataTransfer.getData('draggingDate');
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
  const emptyDragImgRef = React.useRef<HTMLImageElement | null>(null);
  // Synchronous mirror of `isDragging` so dragenter/dragover/drop can gate on it
  // immediately. The React state update for `isDragging` is deferred to the next
  // animation frame in `handleDragStart` (iOS aborts drag if the source DOM
  // mutates during `dragstart`), but later drag events fire synchronously and
  // can't wait for that state to land.
  const isDraggingRef = React.useRef(false);
  React.useEffect(() => {
    // Preload the image - required for Safari support: https://stackoverflow.com/a/40923520/3303436
    emptyDragImgRef.current = document.createElement('img');
    emptyDragImgRef.current.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }, []);

  const isElementDraggable = (day: PickerValidDate | null): day is PickerValidDate => {
    if (day == null) {
      return false;
    }

    const shouldInitDragging = !disableDragEditing && !!dateRange[0] && !!dateRange[1];
    const isSelectedStartDate = isStartOfRange(adapter, day, dateRange);
    const isSelectedEndDate = isEndOfRange(adapter, day, dateRange);

    return shouldInitDragging && (isSelectedStartDate || isSelectedEndDate);
  };

  const handleDragStart = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    const newDate = resolveDateFromTarget(getTarget(event.nativeEvent), adapter, timezone);
    if (!isElementDraggable(newDate)) {
      return;
    }

    event.stopPropagation();
    // Read from `currentTarget` (the bound day button) rather than `target`,
    // which can be a child element (e.g. text span, ripple).
    const { timestamp, position } = event.currentTarget.dataset;
    if (timestamp) {
      // iOS 15 silently drops subsequent drag events unless `setData` is called here, and
      // Android Chrome additionally requires a `text/plain` (or `text/uri-list`) entry —
      // see https://github.com/atlassian/pragmatic-drag-and-drop element-adapter for the
      // same workaround.
      event.dataTransfer.setData('draggingDate', timestamp);
      event.dataTransfer.setData('text/plain', timestamp);
    }
    if (emptyDragImgRef.current) {
      event.dataTransfer.setDragImage(emptyDragImgRef.current, 0, 0);
    }
    event.dataTransfer.effectAllowed = 'move';
    isDraggingRef.current = true;
    // Defer the React state update that re-renders the dragged button. iOS
    // Safari aborts the in-flight drag if the source element's DOM mutates
    // during `dragstart`; React Aria's `useDrag` waits a frame for the same
    // reason.
    requestAnimationFrame(() => {
      setRangeDragDay(newDate);
      setIsDragging(true);
      if (position) {
        onDatePositionChange(position as RangePosition);
      }
    });
  });

  const handleDragEnter = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    setRangeDragDay(resolveDateFromTarget(getTarget(event.nativeEvent), adapter, timezone));
  });

  const handleDragLeave = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  });

  const handleDragOver = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  });

  const handleDragEnd = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    isDraggingRef.current = false;
    setIsDragging(false);
    setRangeDragDay(null);
  });

  const handleDrop = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    isDraggingRef.current = false;
    setIsDragging(false);
    setRangeDragDay(null);
    // make sure the focused element is the element where drop ended
    event.currentTarget.focus();
    if (isSameAsDraggingDate(event)) {
      return;
    }
    const newDate = resolveDateFromTarget(getTarget(event.nativeEvent), adapter, timezone);
    if (newDate) {
      onDrop(newDate);
    }
  });

  return {
    onDragStart: handleDragStart,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    onDrop: handleDrop,
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
