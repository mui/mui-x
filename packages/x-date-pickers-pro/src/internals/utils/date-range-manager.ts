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
  disableNonContiguousDateRange?: boolean;
  maxDate?: PickerValidDate;
  minDate?: PickerValidDate;
  contiguousRangeBoundaries?: {
    maxDate: PickerValidDate | null;
    minDate: PickerValidDate | null;
  } | null;
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
  disableNonContiguousDateRange,
  contiguousRangeBoundaries,
  referenceDate,
}: CalculateRangeChangeOptions): CalculateRangeChangeResponse {
  const [start, end] = range;

  if (disableNonContiguousDateRange && selectedDate && start && end) {
    if (rangePosition === 'start') {
      if (
        contiguousRangeBoundaries?.minDate &&
        utils.isBefore(selectedDate, contiguousRangeBoundaries.minDate)
      ) {
        return { nextSelection: 'end', newRange: [selectedDate, null] };
      }
    }
    if (rangePosition === 'end') {
      if (
        contiguousRangeBoundaries?.maxDate &&
        utils.isAfter(selectedDate, contiguousRangeBoundaries.maxDate)
      ) {
        return { nextSelection: 'end', newRange: [selectedDate, null] };
      }
    }
  }

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
  const { utils, rangePosition, contiguousRangeBoundaries } = options;
  const { newRange } = calculateRangeChange(options as CalculateRangeChangeOptions);

  if (!start || !end) {
    return newRange;
  }

  if (rangePosition === 'start' && contiguousRangeBoundaries?.minDate) {
    if (utils.isAfter(contiguousRangeBoundaries?.minDate, options.newDate)) {
      return [start, options.newDate];
    }
    if (utils.isBefore(contiguousRangeBoundaries?.minDate, options.newDate)) {
      return [options.newDate, end];
    }
  }

  if (rangePosition === 'end' && contiguousRangeBoundaries?.maxDate) {
    if (utils.isAfter(contiguousRangeBoundaries?.maxDate, options.newDate)) {
      return [start, options.newDate];
    }
    if (utils.isBefore(contiguousRangeBoundaries?.maxDate, options.newDate)) {
      return [options.newDate, null];
    }
  }

  const [previewStart, previewEnd] = newRange;

  return rangePosition === 'end' ? [end, previewEnd] : [previewStart, start];
}
