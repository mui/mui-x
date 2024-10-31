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
}: CalculateRangeChangeOptions): CalculateRangeChangeResponse {
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

  if (rangePosition === 'start') {
    const truthyResult: CalculateRangeChangeResponse = allowRangeFlip
      ? { nextSelection: 'start', newRange: [end!, selectedDate] }
      : { nextSelection: 'end', newRange: [selectedDate, null] };
    return Boolean(end) && utils.isAfter(selectedDate!, end!)
      ? truthyResult
      : { nextSelection: 'end', newRange: [selectedDate, end] };
  }

  const truthyResult: CalculateRangeChangeResponse = allowRangeFlip
    ? { nextSelection: 'end', newRange: [selectedDate, start!] }
    : { nextSelection: 'end', newRange: [selectedDate, null] };
  return Boolean(start) && utils.isBeforeDay(selectedDate!, start!)
    ? truthyResult
    : { nextSelection: 'start', newRange: [start, selectedDate] };
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
