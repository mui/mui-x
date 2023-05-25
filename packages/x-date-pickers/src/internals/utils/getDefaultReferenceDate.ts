import { createIsAfterIgnoreDatePart } from './time-utils';
import { mergeDateAndTime, getTodayDate } from './date-utils';
import { FieldSection, FieldValueType, MuiPickersAdapter } from '../../models';

export interface GetDefaultReferenceDateProps<TDate> {
  maxDate?: TDate;
  minDate?: TDate;
  minTime?: TDate;
  maxTime?: TDate;
  disableIgnoringDatePartForTimeValidation?: boolean;
}

const SECTION_TYPE_GRANULARITY = {
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

const roundDate = <TDate>(utils: MuiPickersAdapter<TDate>, granularity: number, date: TDate) => {
  if (granularity === SECTION_TYPE_GRANULARITY.year) {
    return utils.startOfYear(date);
  }
  if (granularity === SECTION_TYPE_GRANULARITY.month) {
    return utils.startOfMonth(date);
  }
  if (granularity === SECTION_TYPE_GRANULARITY.day) {
    return utils.startOfDay(date);
  }

  // We don't have startOfHour / startOfMinute / startOfSecond
  let roundedDate = date;
  if (granularity < SECTION_TYPE_GRANULARITY.minutes) {
    roundedDate = utils.setMinutes(roundedDate, 0);
  }
  if (granularity < SECTION_TYPE_GRANULARITY.seconds) {
    roundedDate = utils.setSeconds(roundedDate, 0);
  }
  if (granularity < SECTION_TYPE_GRANULARITY.milliseconds) {
    roundedDate = utils.setMilliseconds(roundedDate, 0);
  }

  return roundedDate;
};

export const getDefaultReferenceDate = <TDate>({
  props,
  utils,
  valueType,
  granularity,
}: {
  props: GetDefaultReferenceDateProps<TDate>;
  utils: MuiPickersAdapter<TDate>;
  valueType: FieldValueType;
  granularity: number;
}) => {
  let referenceDate = roundDate(utils, granularity, getTodayDate(utils, valueType));

  if (props.minDate != null && utils.isAfterDay(props.minDate, referenceDate)) {
    referenceDate = roundDate(utils, granularity, props.minDate);
  }

  if (props.maxDate != null && utils.isBeforeDay(props.maxDate, referenceDate)) {
    referenceDate = roundDate(utils, granularity, props.maxDate);
  }

  const isAfter = createIsAfterIgnoreDatePart(
    props.disableIgnoringDatePartForTimeValidation ?? false,
    utils,
  );
  if (props.minTime != null && isAfter(props.minTime, referenceDate)) {
    referenceDate = roundDate(
      utils,
      granularity,
      props.disableIgnoringDatePartForTimeValidation
        ? props.minTime
        : mergeDateAndTime(utils, referenceDate, props.minTime),
    );
  }

  if (props.maxTime != null && isAfter(referenceDate, props.maxTime)) {
    referenceDate = roundDate(
      utils,
      granularity,
      props.disableIgnoringDatePartForTimeValidation
        ? props.maxTime
        : mergeDateAndTime(utils, referenceDate, props.maxTime),
    );
  }

  return referenceDate;
};
