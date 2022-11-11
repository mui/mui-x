import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { MuiPickersAdapter } from '@mui/x-date-pickers/internals';
import { DateRangePosition } from './DateRangeCalendar.types';
import { throttle } from '../internal/utils/utils';

interface UseDragRange<TDate> {
  disableDragEditing?: boolean;
  utils: MuiPickersAdapter<TDate>;
  setRangeDragDay: (value: React.SetStateAction<TDate | null>) => void;
  onDragStart: (position: DateRangePosition) => void;
  onDrop: (newDate: TDate) => void;
}

interface UseDragRangeResponse {
  onDragStart?: React.DragEventHandler<HTMLButtonElement>;
  onDragEnter?: React.DragEventHandler<HTMLButtonElement>;
  onDragLeave?: React.DragEventHandler<HTMLButtonElement>;
  onDragOver?: React.DragEventHandler<HTMLButtonElement>;
  onDragEnd?: React.DragEventHandler<HTMLButtonElement>;
  onDrop?: React.DragEventHandler<HTMLButtonElement>;
  onTouchStart?: React.TouchEventHandler<HTMLButtonElement>;
  onTouchMove?: React.TouchEventHandler<HTMLButtonElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLButtonElement>;
  isDragging?: boolean;
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

export const useDragRange = <TDate>({
  disableDragEditing,
  utils,
  setRangeDragDay,
  onDragStart,
  onDrop,
}: UseDragRange<TDate>): UseDragRangeResponse => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    const newDate = resolveDateFromTarget(event.target, utils);
    if (newDate) {
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
  const touchMoveHandler = useEventCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    const target = resolveElementFromTouch(event);
    if (!target) {
      return;
    }
    const newDate = resolveDateFromTarget(target, utils);
    if (!newDate) {
      return;
    }
    setRangeDragDay(newDate);
  });
  const handleTouchMove = throttle(touchMoveHandler);
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
    const newDate = resolveDateFromTarget(target, utils);
    if (newDate) {
      onDrop(newDate);
    }
  });
  const handleDragEnd = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setRangeDragDay(null);
    setIsDragging(false);
  });
  const handleDrop = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    if (isSameAsDraggingDate(event)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const newDate = resolveDateFromTarget(event.target, utils);
    if (newDate) {
      onDrop(newDate);
    }
  });

  return React.useMemo(
    () =>
      !disableDragEditing
        ? {
            onDragStart: handleDragStart,
            onDragEnter: handleDragEnter,
            onDragLeave: handleDragLeave,
            onDragOver: handleDragOver,
            onDragEnd: handleDragEnd,
            onDrop: handleDrop,
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
            isDragging,
          }
        : {},
    [
      disableDragEditing,
      handleDragEnd,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDragStart,
      handleDrop,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      isDragging,
    ],
  );
};
