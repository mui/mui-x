import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
import { mergeDateAndTime, PickerRangeValue } from '@mui/x-date-pickers/internals';
import { RangePosition } from '../../models';

interface CalculateRangeChangeOptions {
  adapter: MuiPickersAdapter;
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
  referenceDate?: PickerValidDate | [PickerValidDate, PickerValidDate];
}

interface CalculateRangeChangeResponse {
  nextSelection: RangePosition;
  newRange: PickerRangeValue;
}

export function resolveReferenceDate(
  referenceDate: PickerValidDate | [PickerValidDate, PickerValidDate] | undefined,
  rangePosition: RangePosition,
): PickerValidDate | undefined {
  if (Array.isArray(referenceDate)) {
    return rangePosition === 'start' ? referenceDate[0] : referenceDate[1];
  }
  return referenceDate;
}

export function calculateRangeChange({
  adapter,
  range,
  newDate: selectedDate,
  rangePosition,
  allowRangeFlip = false,
  shouldMergeDateAndTime = false,
  referenceDate,
}: CalculateRangeChangeOptions): CalculateRangeChangeResponse {
  const start = !adapter.isValid(range[0]) ? null : range[0];
  const end = !adapter.isValid(range[1]) ? null : range[1];

  if (shouldMergeDateAndTime && selectedDate) {
    // If there is a date already selected, then we want to keep its time
    if (start && rangePosition === 'start') {
      selectedDate = mergeDateAndTime(adapter, selectedDate, start);
    }
    if (end && rangePosition === 'end') {
      selectedDate = mergeDateAndTime(adapter, selectedDate, end);
    }
  }

  const newSelectedDate =
    referenceDate && selectedDate && shouldMergeDateAndTime
      ? mergeDateAndTime(adapter, selectedDate, resolveReferenceDate(referenceDate, rangePosition)!)
      : selectedDate;

  if (rangePosition === 'start') {
    const truthyResult: CalculateRangeChangeResponse = allowRangeFlip
      ? { nextSelection: 'start', newRange: [end!, newSelectedDate] }
      : { nextSelection: 'end', newRange: [newSelectedDate, null] };
    return Boolean(end) && adapter.isAfter(newSelectedDate!, end!)
      ? truthyResult
      : { nextSelection: 'end', newRange: [newSelectedDate, end] };
  }

  const truthyResult: CalculateRangeChangeResponse = allowRangeFlip
    ? { nextSelection: 'end', newRange: [newSelectedDate, start!] }
    : { nextSelection: 'end', newRange: [newSelectedDate, null] };

  if (Boolean(start) && adapter.isBeforeDay(newSelectedDate!, start!)) {
    return truthyResult;
  }

  // If we're selecting the same day as the start, but the time would make the range invalid,
  // set the end to the end of the day instead
  let adjustedEndDate = newSelectedDate;
  if (start && newSelectedDate && adapter.isSameDay(start, newSelectedDate) && adapter.isBefore(newSelectedDate, start)) {
    adjustedEndDate = adapter.endOfDay(newSelectedDate);
  }

  return { nextSelection: 'start', newRange: [start, adjustedEndDate] };
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
