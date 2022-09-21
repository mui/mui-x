import { MuiPickersAdapter } from '@mui/x-date-pickers/internals';
import { DateRange } from '../internal/models';

interface CalculateRangePreviewOptions<TDate> {
  utils: MuiPickersAdapter<TDate>;
  range: DateRange<TDate>;
  newDate: TDate | null;
  currentlySelectingRangeEnd: 'start' | 'end';
}

interface CalculateRangeChangeOptions<TDate> extends CalculateRangePreviewOptions<TDate> {
  newDate: TDate;
}
export function calculateRangeChange<TDate>({
  utils,
  range,
  newDate: selectedDate,
  currentlySelectingRangeEnd,
}: CalculateRangeChangeOptions<TDate>): {
  nextSelection: 'start' | 'end';
  newRange: DateRange<TDate>;
} {
  const [start, end] = range;

  if (currentlySelectingRangeEnd === 'start') {
    return Boolean(end) && utils.isAfter(selectedDate, end!)
      ? { nextSelection: 'end', newRange: [selectedDate, null] }
      : { nextSelection: 'end', newRange: [selectedDate, end] };
  }

  return Boolean(start) && utils.isBefore(selectedDate, start!)
    ? { nextSelection: 'end', newRange: [selectedDate, null] }
    : { nextSelection: 'start', newRange: [start, selectedDate] };
}

export function calculateRangePreview<TDate>(
  options: CalculateRangePreviewOptions<TDate>,
): DateRange<TDate> {
  if (options.newDate == null) {
    return [null, null];
  }

  const [start, end] = options.range;
  const { newRange } = calculateRangeChange(options as CalculateRangeChangeOptions<TDate>);

  if (!start || !end) {
    return newRange;
  }

  const [previewStart, previewEnd] = newRange;
  return options.currentlySelectingRangeEnd === 'end' ? [end, previewEnd] : [previewStart, start];
}
