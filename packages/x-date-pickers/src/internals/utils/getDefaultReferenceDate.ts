import { createIsAfterIgnoreDatePart } from './time-utils';
import { mergeDateAndTime, getTodayDate } from './date-utils';
import { FieldValueType, MuiPickersAdapter } from '../../models';

export interface GetDefaultReferenceDateProps<TDate> {
  maxDate?: TDate;
  minDate?: TDate;
  minTime?: TDate;
  maxTime?: TDate;
  disableIgnoringDatePartForTimeValidation?: boolean;
}

export const getDefaultReferenceDate = <TDate>({
  props,
  utils,
  valueType,
}: {
  props: GetDefaultReferenceDateProps<TDate>;
  utils: MuiPickersAdapter<TDate>;
  valueType: FieldValueType;
}) => {
  let referenceDate = getTodayDate(utils, valueType);

  if (props.minDate != null && utils.isAfterDay(props.minDate, referenceDate)) {
    referenceDate = props.minDate;
  }

  if (props.maxDate != null && utils.isBeforeDay(props.maxDate, referenceDate)) {
    referenceDate = props.maxDate;
  }

  const isAfter = createIsAfterIgnoreDatePart(
    props.disableIgnoringDatePartForTimeValidation ?? false,
    utils,
  );
  if (props.minTime != null && isAfter(props.minTime, referenceDate)) {
    referenceDate = props.disableIgnoringDatePartForTimeValidation
      ? props.minTime
      : mergeDateAndTime(utils, referenceDate, props.minTime);
  }

  if (props.maxTime != null && isAfter(referenceDate, props.maxTime)) {
    referenceDate = props.disableIgnoringDatePartForTimeValidation
      ? props.maxTime
      : mergeDateAndTime(utils, referenceDate, props.maxTime);
  }

  return referenceDate;
};
