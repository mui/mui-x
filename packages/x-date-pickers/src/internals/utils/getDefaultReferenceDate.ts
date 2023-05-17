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
  hours: 5,
  minutes: 6,
  seconds: 7,
  milliseconds: 8,
};

export const getSectionTypeGranularity = (sections: FieldSection[]) => {
  let granularity = 1;
  sections.forEach((section) => {
    const sectionGranularity =
      SECTION_TYPE_GRANULARITY[section.type as keyof typeof SECTION_TYPE_GRANULARITY];
    if (sectionGranularity != null && sectionGranularity > granularity) {
      granularity = sectionGranularity;
    }
  });
  return granularity;
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
  const roundDate = (date: TDate) => {
    let roundedDate = date;

    if (granularity === SECTION_TYPE_GRANULARITY.year) {
      roundedDate = utils.startOfYear(date);
    } else if (granularity === SECTION_TYPE_GRANULARITY.month) {
      roundedDate = utils.startOfMonth(date);
    } else if (granularity === SECTION_TYPE_GRANULARITY.day) {
      roundedDate = utils.startOfDay(date);
    } else {
      if (granularity < SECTION_TYPE_GRANULARITY.minutes) {
        roundedDate = utils.setMinutes(date, 0);
      }
      if (granularity < SECTION_TYPE_GRANULARITY.seconds) {
        roundedDate = utils.setSeconds(date, 0);
      }
      if (granularity < SECTION_TYPE_GRANULARITY.milliseconds) {
        roundedDate = utils.setMilliseconds(date, 0);
      }
    }

    return roundedDate;
  };

  let referenceDate = roundDate(getTodayDate(utils, valueType));

  if (props.minDate != null && utils.isAfterDay(props.minDate, referenceDate)) {
    referenceDate = roundDate(props.minDate);
  }

  if (props.maxDate != null && utils.isBeforeDay(props.maxDate, referenceDate)) {
    referenceDate = roundDate(props.maxDate);
  }

  const isAfter = createIsAfterIgnoreDatePart(
    props.disableIgnoringDatePartForTimeValidation ?? false,
    utils,
  );
  if (props.minTime != null && isAfter(props.minTime, referenceDate)) {
    referenceDate = roundDate(
      props.disableIgnoringDatePartForTimeValidation
        ? props.minTime
        : mergeDateAndTime(utils, referenceDate, props.minTime),
    );
  }

  if (props.maxTime != null && isAfter(referenceDate, props.maxTime)) {
    referenceDate = roundDate(
      props.disableIgnoringDatePartForTimeValidation
        ? props.maxTime
        : mergeDateAndTime(utils, referenceDate, props.maxTime),
    );
  }

  return referenceDate;
};
