import { datePickerValueManager } from '../DatePicker/shared';
import {
  useField,
  FieldValueManager,
  FieldSection,
  splitFormatIntoSections,
  addPositionPropertiesToSections,
  createDateStrFromSections,
} from '../internals/hooks/useField';
import { DateValidationError, validateDate } from '../internals/hooks/validation/useDateValidation';
import { UseDateFieldProps } from './DateField.interfaces';

const dateRangeFieldValueManager: FieldValueManager<any, any, FieldSection, DateValidationError> = {
  getSectionsFromValue: (utils, prevSections, date, format) =>
    addPositionPropertiesToSections(splitFormatIntoSections(utils, format, date)),
  getValueStrFromSections: (sections) => createDateStrFromSections(sections),
  getValueFromSections: (utils, prevSections, sections, format) => {
    const dateStr = createDateStrFromSections(sections);
    const value = utils.parse(dateStr, format);

    return {
      value,
      shouldPublish: utils.isValid(value),
    };
  },
  getActiveDateFromActiveSection: (value) => ({
    value,
    update: (newActiveDate) => newActiveDate,
  }),
  hasError: (error) => error != null,
};

export const useDateField = <
  TInputDate,
  TDate,
  TProps extends UseDateFieldProps<TInputDate, TDate>,
>(
  inProps: TProps,
) => {
  return useField({
    props: inProps,
    valueManager: datePickerValueManager,
    fieldValueManager: dateRangeFieldValueManager,
    // TODO: Support time validation.
    validator: validateDate as any,
  });
};
