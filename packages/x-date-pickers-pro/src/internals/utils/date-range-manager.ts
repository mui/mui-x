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

  let response: CalculateRangeChangeResponse<TDate> = {
    nextSelection: rangePosition,
    newRange: range,
  };

  if (!selectedDate) {
    response = {
      nextSelection: rangePosition,
      newRange: rangePosition === 'start' ? [null, end] : [start, null],
    };
  } else if (rangePosition === 'start') {
    // If we try to set a start date after the already selected end date,
    // Then we either flip the range, or replace the end date.
    if (end && utils.isAfter(selectedDate, end)) {
      if (allowRangeFlip) {
        response = { nextSelection: 'start', newRange: [end!, selectedDate] };
      } else {
        response = { nextSelection: 'start', newRange: [null, selectedDate] };
      }
    }
    // Otherwise, we update the start date
    else {
      response = { nextSelection: 'end', newRange: [selectedDate, end] };
    }
  } else if (rangePosition === 'end') {
    // If we try to set a end date before the already selected start date,
    // Then we either flip the range, or replace the start date.
    if (start && utils.isBeforeDay(selectedDate, start)) {
      if (allowRangeFlip) {
        response = { nextSelection: 'end', newRange: [selectedDate, start!] };
      } else {
        response = { nextSelection: 'end', newRange: [selectedDate, null] };
      }
    }
    // Otherwise, we update the end date
    else {
      response = { nextSelection: 'start', newRange: [start, selectedDate] };
    }
  }

  return response;
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
