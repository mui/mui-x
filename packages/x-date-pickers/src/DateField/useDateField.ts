import { datePickerValueManager } from '../DatePicker/shared';
import {
  useField,
  FieldValueManager,
  FieldSection,
  splitFormatIntoSections,
  addPositionPropertiesToSections,
  createDateStrFromSections,
  createDateFromSectionsAndPreviousDate,
  shouldPublishDate,
} from '../internals/hooks/useField';
import { UseDateFieldProps, UseDateFieldDefaultizedProps } from './DateField.interfaces';
import {
  DateValidationError,
  isSameDateError,
  validateDate,
} from '../internals/hooks/validation/useDateValidation';
import { parseNonNullablePickerDate } from '../internals/utils/date-utils';
import { useUtils, useDefaultDates } from '../internals/hooks/useUtils';

const dateRangeFieldValueManager: FieldValueManager<any, any, FieldSection, DateValidationError> = {
  getSectionsFromValue: (utils, prevSections, date, format) =>
    addPositionPropertiesToSections(splitFormatIntoSections(utils, format, date)),
  getValueStrFromSections: (sections) => createDateStrFromSections(sections),
  getValueFromSections: ({ utils, prevValue, sections, format }) => {
    const valueParsed = createDateFromSectionsAndPreviousDate({
      utils,
      sections,
      format,
      prevDate: prevValue,
    });

    return {
      valueParsed,
      shouldPublish: shouldPublishDate(utils, valueParsed, prevValue),
    };
  },
  getActiveDateFromActiveSection: (value) => ({
    value,
    update: (newActiveDate) => newActiveDate,
  }),
  hasError: (error) => error != null,
  isSameError: isSameDateError,
};

const useDefaultizedDateField = <TInputDate, TDate, AdditionalProps extends {}>(
  props: UseDateFieldProps<TInputDate, TDate>,
): AdditionalProps & UseDateFieldDefaultizedProps<TInputDate, TDate> => {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  return {
    disablePast: false,
    disableFuture: false,
    ...props,
    minDate: parseNonNullablePickerDate(utils, props.minDate, defaultDates.minDate),
    maxDate: parseNonNullablePickerDate(utils, props.maxDate, defaultDates.maxDate),
  } as any;
};

export const useDateField = <
  TInputDate,
  TDate,
  TProps extends UseDateFieldProps<TInputDate, TDate>,
>(
  inProps: TProps,
) => {
  const {
    value,
    defaultValue,
    format,
    onChange,
    readOnly,
    onError,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    ...other
  } = useDefaultizedDateField<TInputDate, TDate, TProps>(inProps);

  return useField({
    forwardedProps: other,
    internalProps: {
      value,
      defaultValue,
      format,
      onChange,
      readOnly,
      onError,
      shouldDisableDate,
      shouldDisableMonth,
      shouldDisableYear,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
    },
    valueManager: datePickerValueManager,
    fieldValueManager: dateRangeFieldValueManager,
    // TODO: Support time validation.
    validator: validateDate,
  });
};
