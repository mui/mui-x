import { MuiPickersAdapter } from '@mui/x-date-pickers/internals';
import { DateRange } from '../internal/models';

interface CalculateRangeChangeOptions<TDate> {
  utils: MuiPickersAdapter<TDate>;
  range: DateRange<TDate>;
  newDate: TDate;
  currentlySelectingRangeEnd: 'start' | 'end';
  allowRangeFlip?: boolean;
}

interface CalculateRangeChangeResponse<TDate> {
  nextSelection: 'start' | 'end';
  newRange: DateRange<TDate>;
}

export function calculateRangeChange<TDate>({
  utils,
  range,
  newDate: selectedDate,
  currentlySelectingRangeEnd,
  allowRangeFlip = false,
}: CalculateRangeChangeOptions<TDate>): CalculateRangeChangeResponse<TDate> {
  const [start, end] = range;

  if (currentlySelectingRangeEnd === 'start') {
    const truthyResult: CalculateRangeChangeResponse<TDate> = allowRangeFlip
      ? { nextSelection: 'start', newRange: [end!, selectedDate] }
      : { nextSelection: 'end', newRange: [selectedDate, null] };
    return Boolean(end) && utils.isAfter(selectedDate, end!)
      ? truthyResult
      : { nextSelection: 'end', newRange: [selectedDate, end] };
  }

  const truthyResult: CalculateRangeChangeResponse<TDate> = allowRangeFlip
    ? { nextSelection: 'end', newRange: [selectedDate, start!] }
    : { nextSelection: 'end', newRange: [selectedDate, null] };
  return Boolean(start) && utils.isBefore(selectedDate, start!)
    ? truthyResult
    : { nextSelection: 'start', newRange: [start, selectedDate] };
}

export function calculateRangePreview<TDate>(
  options: CalculateRangeChangeOptions<TDate>,
): DateRange<TDate> {
  if (!options.newDate) {
    return [null, null];
  }

  const [start, end] = options.range;
  const { newRange } = calculateRangeChange(options);

  if (!start || !end) {
    return newRange;
  }

  const [previewStart, previewEnd] = newRange;
  return options.currentlySelectingRangeEnd === 'end' ? [end, previewEnd] : [previewStart, start];
}
