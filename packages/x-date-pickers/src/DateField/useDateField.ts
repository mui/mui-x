import { UseDateFieldProps, DateFieldInputSection } from './DateField.interfaces';
import { datePickerValueManager } from '../DatePicker/shared';
import {
  splitFormatIntoSections,
  addPositionPropertiesToSections,
  createDateStrFromSections,
} from './DateField.utils';
import { PickerFieldValueManager, useInternalDateField } from './useInternalDateField';

const dateRangeFieldValueManager: PickerFieldValueManager<any, any, DateFieldInputSection> = {
  getSectionsFromValue: (utils, date, format) =>
    addPositionPropertiesToSections(splitFormatIntoSections(utils, format, date)),
  getValueStrFromSections: (sections) => createDateStrFromSections(sections),
  getValueFromSections: (utils, sections, format) => {
    const dateStr = createDateStrFromSections(sections);
    const value = utils.parse(dateStr, format);

    return {
      value,
      shouldPublish: utils.isValid(value),
    };
  },
  getActiveDateFromActiveSection: (value) => {
    return {
      value,
      update: (newActiveDate) => newActiveDate,
    };
  },
};

export const useDateField = <TInputDate, TDate = TInputDate>(
  inProps: UseDateFieldProps<TInputDate, TDate>,
) => {
  return useInternalDateField({
    value: inProps.value,
    onChange: inProps.onChange,
    format: inProps.format,
    valueManager: datePickerValueManager,
    fieldValueManager: dateRangeFieldValueManager,
  });
};
