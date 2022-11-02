import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { MuiPickersAdapter } from '@mui/x-date-pickers/internals';
import { DateRangePosition } from './DateRangeCalendar.types';

interface UseDragRange<TDate> {
  disableDragEditing?: boolean;
  utils: MuiPickersAdapter<TDate>;
  currentDatePosition: DateRangePosition;
  setRangePreviewDay: (value: React.SetStateAction<TDate | null>) => void;
  setCurrentDatePosition: (value: React.SetStateAction<DateRangePosition>) => void;
  onDrop: (newDate: TDate) => void;
}

interface UseDragRangeResponse {
  onDragStart?: React.DragEventHandler<HTMLButtonElement>;
  onDragEnter?: React.DragEventHandler<HTMLButtonElement>;
  onDragLeave?: React.DragEventHandler<HTMLButtonElement>;
  onDragOver?: React.DragEventHandler<HTMLButtonElement>;
  onDragEnd?: React.DragEventHandler<HTMLButtonElement>;
  onDrop?: React.DragEventHandler<HTMLButtonElement>;
  isDragging?: boolean;
}

const resolveDateFromEvent = <TDate>(
  event: React.DragEvent<HTMLButtonElement>,
  utils: MuiPickersAdapter<TDate>,
  checkEquality?: boolean,
) => {
  const timestampString = (event.target as HTMLButtonElement).dataset.timestamp;
  if (
    !timestampString ||
    (checkEquality && timestampString === event.dataTransfer.getData('draggingDate'))
  ) {
    return null;
  }
  const timestamp = +timestampString;
  return utils.date(new Date(timestamp));
};

export const useDragRange = <TDate>({
  disableDragEditing,
  utils,
  currentDatePosition,
  setCurrentDatePosition,
  setRangePreviewDay,
  onDrop,
}: UseDragRange<TDate>): UseDragRangeResponse => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    const newDate = resolveDateFromEvent(event, utils);
    if (newDate) {
      setRangePreviewDay(newDate);
      event.dataTransfer.effectAllowed = 'move';
      setIsDragging(true);
      const buttonDataset = (event.target as HTMLButtonElement).dataset;
      event.dataTransfer.setData('draggingDate', buttonDataset.timestamp as string);
      const datePosition = buttonDataset.position as DateRangePosition;
      if (datePosition && currentDatePosition !== datePosition) {
        setCurrentDatePosition(datePosition);
      }
    }
  });
  const handleDragEnter = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    setRangePreviewDay(resolveDateFromEvent(event, utils));
  });
  const handleDragLeave = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setRangePreviewDay(null);
  });
  const handleDragOver = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  });
  const handleDragEnd = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setRangePreviewDay(null);
    setIsDragging(false);
  });
  const handleDrop = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const newDate = resolveDateFromEvent(event, utils, true);
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
      isDragging,
    ],
  );
};
