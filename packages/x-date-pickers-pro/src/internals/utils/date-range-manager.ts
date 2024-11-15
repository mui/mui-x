import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
import { mergeDateAndTime } from '@mui/x-date-pickers/internals';
import { DateRange, RangePosition } from '../../models';

interface CalculateRangeChangeOptions<TDate extends PickerValidDate> {
  utils: MuiPickersAdapter<TDate>;
  range: DateRange<TDate>;
  newDate: TDate | null;
  rangePosition: RangePosition;
  /**
   * Should allow flipping range `start` and `end` dates if the `newDate` would result in a new range creation.
   *
   * It is used to allow dragging range `start` date past `end` date essentially becoming the new `end` date and vice versa.
   */
  allowRangeFlip?: boolean;
  shouldMergeDateAndTime?: boolean;
  referenceDate?: TDate | null;
}

interface CalculateRangeChangeResponse<TDate extends PickerValidDate> {
  nextSelection: RangePosition;
  newRange: DateRange<TDate>;
}

export function calculateRangeChange<TDate extends PickerValidDate>({
  utils,
  range,
  newDate: selectedDate,
  rangePosition,
  allowRangeFlip = false,
  shouldMergeDateAndTime = false,
  referenceDate,
}: CalculateRangeChangeOptions<TDate>): CalculateRangeChangeResponse<TDate> {
  const [start, end] = range;

  if (shouldMergeDateAndTime && selectedDate) {
    // If there is a date already selected, then we want to keep its time
    if (start && rangePosition === 'start') {
      selectedDate = mergeDateAndTime(utils, selectedDate, start);
    }
    if (end && rangePosition === 'end') {
      selectedDate = mergeDateAndTime(utils, selectedDate, end);
    }
  }

  const newSelectedDate =
    referenceDate && selectedDate && shouldMergeDateAndTime
      ? mergeDateAndTime(utils, selectedDate, referenceDate)
      : selectedDate;

  if (rangePosition === 'start') {
    const truthyResult: CalculateRangeChangeResponse<TDate> = allowRangeFlip
      ? { nextSelection: 'start', newRange: [end!, newSelectedDate] }
      : { nextSelection: 'end', newRange: [newSelectedDate, null] };
    return Boolean(end) && utils.isAfter(newSelectedDate!, end!)
      ? truthyResult
      : { nextSelection: 'end', newRange: [newSelectedDate, end] };
  }

  const truthyResult: CalculateRangeChangeResponse<TDate> = allowRangeFlip
    ? { nextSelection: 'end', newRange: [newSelectedDate, start!] }
    : { nextSelection: 'end', newRange: [newSelectedDate, null] };
  return Boolean(start) && utils.isBeforeDay(newSelectedDate!, start!)
    ? truthyResult
    : { nextSelection: 'start', newRange: [start, newSelectedDate] };
}

export function calculateRangePreview<TDate extends PickerValidDate>(
  options: CalculateRangeChangeOptions<TDate>,
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
  return options.rangePosition === 'end' ? [end, previewEnd] : [previewStart, start];
}
