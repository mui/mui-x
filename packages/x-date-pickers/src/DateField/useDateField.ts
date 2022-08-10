import { datePickerValueManager } from '../DatePicker/shared';
import {
  useField,
  FieldValueManager,
  FieldSection,
  splitFormatIntoSections,
  addPositionPropertiesToSections,
  createDateStrFromSections,
} from '../internals/hooks/useField';
import { UseDateFieldProps } from './DateField.interfaces';

const dateRangeFieldValueManager: FieldValueManager<any, any, FieldSection> = {
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
};

export const useDateField = <TInputDate, TDate = TInputDate>(
  inProps: UseDateFieldProps<TInputDate, TDate>,
) => {
  return useField({
    value: inProps.value,
    onChange: inProps.onChange,
    format: inProps.format,
    valueManager: datePickerValueManager,
    fieldValueManager: dateRangeFieldValueManager,
  });
};
