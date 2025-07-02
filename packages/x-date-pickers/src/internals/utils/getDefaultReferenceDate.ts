import { createIsAfterIgnoreDatePart } from './time-utils';
import { mergeDateAndTime, getTodayDate } from './date-utils';
import { FieldSection, MuiPickersAdapter, PickersTimezone, PickerValidDate } from '../../models';

export interface GetDefaultReferenceDateProps {
  maxDate?: PickerValidDate;
  minDate?: PickerValidDate;
  minTime?: PickerValidDate;
  maxTime?: PickerValidDate;
  disableIgnoringDatePartForTimeValidation?: boolean;
}

export const SECTION_TYPE_GRANULARITY = {
  year: 1,
  month: 2,
  day: 3,
  hours: 4,
  minutes: 5,
  seconds: 6,
  milliseconds: 7,
};

export const getSectionTypeGranularity = (sections: FieldSection[]) =>
  Math.max(
    ...sections.map(
      (section) =>
        SECTION_TYPE_GRANULARITY[section.type as keyof typeof SECTION_TYPE_GRANULARITY] ?? 1,
    ),
  );

const roundDate = (adapter: MuiPickersAdapter, granularity: number, date: PickerValidDate) => {
  if (granularity === SECTION_TYPE_GRANULARITY.year) {
    return adapter.startOfYear(date);
  }
  if (granularity === SECTION_TYPE_GRANULARITY.month) {
    return adapter.startOfMonth(date);
  }
  if (granularity === SECTION_TYPE_GRANULARITY.day) {
    return adapter.startOfDay(date);
  }

  // We don't have startOfHour / startOfMinute / startOfSecond
  let roundedDate = date;
  if (granularity < SECTION_TYPE_GRANULARITY.minutes) {
    roundedDate = adapter.setMinutes(roundedDate, 0);
  }
  if (granularity < SECTION_TYPE_GRANULARITY.seconds) {
    roundedDate = adapter.setSeconds(roundedDate, 0);
  }
  if (granularity < SECTION_TYPE_GRANULARITY.milliseconds) {
    roundedDate = adapter.setMilliseconds(roundedDate, 0);
  }

  return roundedDate;
};

export const getDefaultReferenceDate = ({
  props,
  adapter,
  granularity,
  timezone,
  getTodayDate: inGetTodayDate,
}: {
  props: GetDefaultReferenceDateProps;
  adapter: MuiPickersAdapter;
  granularity: number;
  timezone: PickersTimezone;
  getTodayDate?: () => PickerValidDate;
}): PickerValidDate => {
  let referenceDate = inGetTodayDate
    ? inGetTodayDate()
    : roundDate(adapter, granularity, getTodayDate(adapter, timezone));

  if (props.minDate != null && adapter.isAfterDay(props.minDate, referenceDate)) {
    referenceDate = roundDate(adapter, granularity, props.minDate);
  }

  if (props.maxDate != null && adapter.isBeforeDay(props.maxDate, referenceDate)) {
    referenceDate = roundDate(adapter, granularity, props.maxDate);
  }

  const isAfter = createIsAfterIgnoreDatePart(
    props.disableIgnoringDatePartForTimeValidation ?? false,
    adapter,
  );
  if (props.minTime != null && isAfter(props.minTime, referenceDate)) {
    referenceDate = roundDate(
      adapter,
      granularity,
      props.disableIgnoringDatePartForTimeValidation
        ? props.minTime
        : mergeDateAndTime(adapter, referenceDate, props.minTime),
    );
  }

  if (props.maxTime != null && isAfter(referenceDate, props.maxTime)) {
    referenceDate = roundDate(
      adapter,
      granularity,
      props.disableIgnoringDatePartForTimeValidation
        ? props.maxTime
        : mergeDateAndTime(adapter, referenceDate, props.maxTime),
    );
  }

  return referenceDate;
};
