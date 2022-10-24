import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { MuiPickersAdapter } from '@mui/x-date-pickers/internals';
import { DateRangePosition } from './DateRangeCalendar.types';

interface UseDragRange<TDate> {
  disableDragEditing?: boolean;
  utils: MuiPickersAdapter<TDate>;
  currentDatePosition: DateRangePosition;
  setRangePreviewDay: (value: React.SetStateAction<TDate | null>) => void;
  handleSelectedDayChange: (newDate: TDate | null) => void;
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

export const useDragRange = <TDate>({
  disableDragEditing,
  utils,
  currentDatePosition,
  setRangePreviewDay,
  handleSelectedDayChange,
}: UseDragRange<TDate>): UseDragRangeResponse => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    const timestampString = (event.target as HTMLButtonElement).dataset.timestamp;
    if (timestampString) {
      const timestamp = +timestampString;
      setRangePreviewDay(utils.date(new Date(timestamp)));
    }
    event.dataTransfer.setData('datePosition', currentDatePosition);
    event.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  });
  const handleDragEnter = useEventCallback((event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    const timestampString = (event.target as HTMLButtonElement).dataset.timestamp;
    if (timestampString) {
      const timestamp = +timestampString;
      setRangePreviewDay(utils.date(new Date(timestamp)));
    }
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
    const timestampString = (event.target as HTMLButtonElement).dataset.timestamp;
    if (timestampString) {
      const timestamp = +timestampString;
      const newDate = utils.date(new Date(timestamp));
      if (newDate) {
        handleSelectedDayChange(newDate);
      }
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
