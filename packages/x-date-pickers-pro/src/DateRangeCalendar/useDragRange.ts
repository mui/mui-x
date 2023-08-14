import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { MuiPickersAdapter, PickersTimezone } from '@mui/x-date-pickers/models';
import { DateRangePosition } from './DateRangeCalendar.types';
import { DateRange } from '../internals/models';
import { isEndOfRange, isStartOfRange } from '../internals/utils/date-utils';

interface UseDragRangeParams<TDate> {
  disableDragEditing?: boolean;
  utils: MuiPickersAdapter<TDate>;
  setRangeDragDay: (value: TDate | null) => void;
  setIsDragging: (value: boolean) => void;
  isDragging: boolean;
  onDatePositionChange: (position: DateRangePosition) => void;
  onDrop: (newDate: TDate) => void;
  dateRange: DateRange<TDate>;
  timezone: PickersTimezone;
}

interface UseDragRangeEvents {
  onDragStart?: React.DragEventHandler<HTMLButtonElement>;
  onDragEnter?: React.DragEventHandler<HTMLButtonElement>;
  onDragLeave?: React.DragEventHandler<HTMLButtonElement>;
  onDragOver?: React.DragEventHandler<HTMLButtonElement>;
  onDragEnd?: React.DragEventHandler<HTMLButtonElement>;
  onDrop?: React.DragEventHandler<HTMLButtonElement>;
  onTouchStart?: React.TouchEventHandler<HTMLButtonElement>;
  onTouchMove?: React.TouchEventHandler<HTMLButtonElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLButtonElement>;
}

interface UseDragRangeResponse<TDate> extends UseDragRangeEvents {
  isDragging: boolean;
  rangeDragDay: TDate | null;
  draggingDatePosition: DateRangePosition | null;
}

const resolveDateFromTarget = <TDate>(
  target: EventTarget,
  utils: MuiPickersAdapter<TDate>,
  timezone: PickersTimezone,
) => {
  const timestampString = (target as HTMLElement).dataset.timestamp;
  if (!timestampString) {
    return null;
  }
  const timestamp = +timestampString;
  return utils.dateWithTimezone(new Date(timestamp).toISOString(), timezone);
};

const isSameAsDraggingDate = (event: React.DragEvent<HTMLButtonElement>) => {
  const timestampString = (event.target as HTMLButtonElement).dataset.timestamp;
  return timestampString === event.dataTransfer.getData('draggingDate');
};

const resolveButtonElement = (element: Element | null): HTMLButtonElement | null => {
  if (element) {
    if (element instanceof HTMLButtonElement && !element.disabled) {
      return element;
    }
    if (element.children.length) {
      return resolveButtonElement(element.children[0]);
    }
    return null;
  }
  return element;
};

const resolveElementFromTouch = (
  event: React.TouchEvent<HTMLButtonElement>,
  ignoreTouchTarget?: boolean,
) => {
  // don't parse multi-touch result
  if (event.changedTouches?.length === 1 && event.touches.length <= 1) {
    const element = document.elementFromPoint(
      event.changedTouches[0].clientX,
      event.changedTouches[0].clientY,
    );
    // `elementFromPoint` could have resolved preview div or wrapping div
    // might need to recursively find the nested button
    const buttonElement = resolveButtonElement(element);
    if (ignoreTouchTarget && buttonElement === event.changedTouches[0].target) {
      return null;
    }
    return buttonElement;
  }
  return null;
};

const useDragRangeEvents = <TDate>({
  utils,
  setRangeDragDay,
  setIsDragging,
  isDragging,
  onDatePositionChange,
  onDrop,
  disableDragEditing,
  dateRange,
  timezone,
}: UseDragRangeParams<TDate>): UseDragRangeEvents => {
  const emptyDragImgRef = React.useRef<HTMLImageElement | null>(null);
  React.useEffect(() => {
    // Preload the image - required for Safari support: https://stackoverflow.com/a/40923520/3303436
    emptyDragImgRef.current = document.createElement('img');
    emptyDragImgRef.current.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }, []);

  const isElementDraggable = (day: TDate | null): day is TDate => {
    if (day == null) {
      return false;
    }

    const shouldInitDragging = !disableDragEditing && !!dateRange[0] && !!dateRange[1];
    const isSelectedStartDate = isStartOfRange(utils, day, dateRange);
    const isSelectedEndDate = isEndOfRange(utils, day, dateRange);

    return shouldInitDragging && (isSelectedStartDate || isSelectedEndDate);
  };

  const handleDragStart = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    const newDate = resolveDateFromTarget(event.target, utils, timezone);
    if (!isElementDraggable(newDate)) {
      return;
    }

    event.stopPropagation();
    if (emptyDragImgRef.current) {
      event.dataTransfer.setDragImage(emptyDragImgRef.current, 0, 0);
    }
    setRangeDragDay(newDate);
    event.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    const buttonDataset = (event.target as HTMLButtonElement).dataset;
    if (buttonDataset.timestamp) {
      event.dataTransfer.setData('draggingDate', buttonDataset.timestamp);
    }
    if (buttonDataset.position) {
      onDatePositionChange(buttonDataset.position as DateRangePosition);
    }
  });

  const handleTouchStart = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    const target = resolveElementFromTouch(event);
    if (!target) {
      return;
    }

    const newDate = resolveDateFromTarget(target, utils, timezone);
    if (!isElementDraggable(newDate)) {
      return;
    }

    setRangeDragDay(newDate);
    setIsDragging(true);
    const button = event.target as HTMLButtonElement;
    const buttonDataset = button.dataset;
    if (buttonDataset.position) {
      onDatePositionChange(buttonDataset.position as DateRangePosition);
    }
  });

  const handleDragEnter = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDragging) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    setRangeDragDay(resolveDateFromTarget(event.target, utils, timezone));
  });

  const handleTouchMove = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    const target = resolveElementFromTouch(event);
    if (!isDragging || !target) {
      return;
    }

    const newDate = resolveDateFromTarget(target, utils, timezone);
    if (newDate) {
      setRangeDragDay(newDate);
    }
  });

  const handleDragLeave = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDragging) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  });

  const handleDragOver = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDragging) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  });

  const handleTouchEnd = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    if (!isDragging) {
      return;
    }

    setRangeDragDay(null);
    setIsDragging(false);

    const target = resolveElementFromTouch(event, true);
    if (!target) {
      return;
    }

    // make sure the focused element is the element where touch ended
    target.focus();
    const newDate = resolveDateFromTarget(target, utils, timezone);
    if (newDate) {
      onDrop(newDate);
    }
  });

  const handleDragEnd = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDragging) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    setRangeDragDay(null);
  });

  const handleDrop = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (!isDragging) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    setRangeDragDay(null);
    // make sure the focused element is the element where drop ended
    event.currentTarget.focus();
    if (isSameAsDraggingDate(event)) {
      return;
    }
    const newDate = resolveDateFromTarget(event.target, utils, timezone);
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
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};

export const useDragRange = <TDate>({
  disableDragEditing,
  utils,
  onDatePositionChange,
  onDrop,
  dateRange,
  timezone,
}: Omit<
  UseDragRangeParams<TDate>,
  'setRangeDragDay' | 'setIsDragging' | 'isDragging'
>): UseDragRangeResponse<TDate> => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [rangeDragDay, setRangeDragDay] = React.useState<TDate | null>(null);

  const handleRangeDragDayChange = useEventCallback((val: TDate | null) => {
    if (!utils.isEqual(val, rangeDragDay)) {
      setRangeDragDay(val);
    }
  });

  const draggingDatePosition: DateRangePosition | null = React.useMemo(() => {
    const [start, end] = dateRange;
    if (rangeDragDay) {
      if (start && utils.isBefore(rangeDragDay, start)) {
        return 'start';
      }
      if (end && utils.isAfter(rangeDragDay, end)) {
        return 'end';
      }
    }
    return null;
  }, [dateRange, rangeDragDay, utils]);

  const dragRangeEvents = useDragRangeEvents({
    utils,
    onDatePositionChange,
    onDrop,
    setIsDragging,
    isDragging,
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
