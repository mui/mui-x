import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { MuiPickersAdapter } from '@mui/x-date-pickers/internals';
import { DateRangePosition } from './DateRangeCalendar.types';

interface UseDragRangeParams<TDate> {
  disableDragEditing?: boolean;
  utils: MuiPickersAdapter<TDate>;
  setRangeDragDay: (value: TDate | null) => void;
  setIsDragging: (value: boolean) => void;
  onDragStart: (position: DateRangePosition) => void;
  onDrop: (newDate: TDate) => void;
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
}

const resolveDateFromTarget = <TDate>(target: EventTarget, utils: MuiPickersAdapter<TDate>) => {
  const timestampString = (target as HTMLElement).dataset.timestamp;
  if (!timestampString) {
    return null;
  }
  const timestamp = +timestampString;
  return utils.date(new Date(timestamp));
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
  onDragStart,
  onDrop,
}: Omit<UseDragRangeParams<TDate>, 'disableDragEditing'>): UseDragRangeEvents => {
  const emptyDragImgRef = React.useRef<HTMLImageElement | null>(null);
  React.useEffect(() => {
    // Preload the image - required for Safari support: https://stackoverflow.com/a/40923520/3303436
    emptyDragImgRef.current = document.createElement('img');
    emptyDragImgRef.current.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }, []);

  const handleDragStart = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const newDate = resolveDateFromTarget(event.target, utils);
    if (newDate) {
      if (emptyDragImgRef.current) {
        event.dataTransfer.setDragImage(emptyDragImgRef.current, 0, 0);
      }
      setRangeDragDay(newDate);
      event.dataTransfer.effectAllowed = 'move';
      setIsDragging(true);
      const buttonDataset = (event.target as HTMLButtonElement).dataset;
      event.dataTransfer.setData('draggingDate', buttonDataset.timestamp as string);
      onDragStart(buttonDataset.position as DateRangePosition);
    }
  });
  const handleTouchStart = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    const target = resolveElementFromTouch(event);
    if (!target) {
      return;
    }
    const newDate = resolveDateFromTarget(target, utils);
    if (newDate) {
      setRangeDragDay(newDate);
      setIsDragging(true);
      const button = event.target as HTMLButtonElement;
      const buttonDataset = button.dataset;
      onDragStart(buttonDataset.position as DateRangePosition);
    }
  });
  const handleDragEnter = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    setRangeDragDay(resolveDateFromTarget(event.target, utils));
  });
  const handleTouchMove = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    const target = resolveElementFromTouch(event);
    if (!target) {
      return;
    }
    const newDate = resolveDateFromTarget(target, utils);
    if (newDate) {
      setRangeDragDay(newDate);
    }
  });
  const handleDragLeave = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
  });
  const handleDragOver = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  });
  const handleTouchEnd = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    setRangeDragDay(null);
    setIsDragging(false);
    const target = resolveElementFromTouch(event, true);
    if (!target) {
      return;
    }
    // make sure the focused element is the element where touch ended
    target.focus();
    const newDate = resolveDateFromTarget(target, utils);
    if (newDate) {
      onDrop(newDate);
    }
  });
  const handleDragEnd = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    setRangeDragDay(null);
  });
  const handleDrop = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    setRangeDragDay(null);
    // make sure the focused element is the element where drop ended
    event.currentTarget.focus();
    if (isSameAsDraggingDate(event)) {
      return;
    }
    const newDate = resolveDateFromTarget(event.target, utils);
    if (newDate) {
      onDrop(newDate);
    }
  });
  return React.useMemo(
    () => ({
      onDragStart: handleDragStart,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDragEnd: handleDragEnd,
      onDrop: handleDrop,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    }),
    [
      handleDragEnd,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDragStart,
      handleDrop,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    ],
  );
};

export const useDragRange = <TDate>({
  disableDragEditing,
  utils,
  onDragStart,
  onDrop,
}: Omit<
  UseDragRangeParams<TDate>,
  'setRangeDragDay' | 'setIsDragging'
>): UseDragRangeResponse<TDate> => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [rangeDragDay, setRangeDragDay] = React.useState<TDate | null>(null);

  const handleRangeDragDayChange = useEventCallback((val: TDate | null) => {
    if (!utils.isEqual(val, rangeDragDay)) {
      setRangeDragDay(val);
    }
  });
  const dragRangeEvents = useDragRangeEvents({
    utils,
    onDragStart,
    onDrop,
    setIsDragging,
    setRangeDragDay: handleRangeDragDayChange,
  });

  return React.useMemo(
    () => ({ isDragging, rangeDragDay, ...(!disableDragEditing ? dragRangeEvents : {}) }),
    [isDragging, rangeDragDay, disableDragEditing, dragRangeEvents],
  );
};
