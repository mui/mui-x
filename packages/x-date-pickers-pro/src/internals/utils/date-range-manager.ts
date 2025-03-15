import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
import { mergeDateAndTime, PickerRangeValue } from '@mui/x-date-pickers/internals';
import { RangePosition } from '../../models';

interface CalculateRangeChangeOptions {
  utils: MuiPickersAdapter;
  range: PickerRangeValue;
  newDate: PickerValidDate | null;
  rangePosition: RangePosition;
  /**
   * Should allow flipping range `start` and `end` dates if the `newDate` would result in a new range creation.
   *
   * It is used to allow dragging range `start` date past `end` date essentially becoming the new `end` date and vice versa.
   */
  allowRangeFlip?: boolean;
  shouldMergeDateAndTime?: boolean;
  referenceDate?: PickerValidDate;
}

interface CalculateRangeChangeResponse {
  nextSelection: RangePosition;
  newRange: PickerRangeValue;
}

export function calculateRangeChange({
  utils,
  range,
  newDate: selectedDate,
  rangePosition,
  allowRangeFlip = false,
  shouldMergeDateAndTime = false,
  referenceDate,
}: CalculateRangeChangeOptions): CalculateRangeChangeResponse {
  const start = !utils.isValid(range[0]) ? null : range[0];
  const end = !utils.isValid(range[1]) ? null : range[1];

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
    const truthyResult: CalculateRangeChangeResponse = allowRangeFlip
      ? { nextSelection: 'start', newRange: [end!, newSelectedDate] }
      : { nextSelection: 'end', newRange: [newSelectedDate, null] };
    return Boolean(end) && utils.isAfter(newSelectedDate!, end!)
      ? truthyResult
      : { nextSelection: 'end', newRange: [newSelectedDate, end] };
  }

  const truthyResult: CalculateRangeChangeResponse = allowRangeFlip
    ? { nextSelection: 'end', newRange: [newSelectedDate, start!] }
    : { nextSelection: 'end', newRange: [newSelectedDate, null] };
  return Boolean(start) && utils.isBeforeDay(newSelectedDate!, start!)
    ? truthyResult
    : { nextSelection: 'start', newRange: [start, newSelectedDate] };
}

export function calculateRangePreview(options: CalculateRangeChangeOptions): PickerRangeValue {
  if (options.newDate == null) {
    return [null, null];
  }

  const [start, end] = options.range;
  const { newRange } = calculateRangeChange(options as CalculateRangeChangeOptions);

  if (!start || !end) {
    return newRange;
  }

  const [previewStart, previewEnd] = newRange;
  return options.rangePosition === 'end' ? [end, previewEnd] : [previewStart, start];
}
