import {
  PickerFieldValueManager,
  useInternalDateField,
} from '@mui/x-date-pickers/DateField/useInternalDateField';
import {
  splitFormatIntoSections,
  addPositionPropertiesToSections,
} from '@mui/x-date-pickers/DateField/DateField.utils';
import { DateRangeFieldInputSection, UseDateRangeFieldProps } from './DateRangeField.interfaces';
import { dateRangePickerValueManager } from '../DateRangePicker/shared';
import { DateRange } from '../internal/models/dateRange';
import { getDateRangeStrFromSections } from './DateRangeField.utils';

const dateRangeFieldValueManager: PickerFieldValueManager<
  DateRange<any>,
  any,
  DateRangeFieldInputSection
> = {
  getSectionsFromValue: (utils, [start, end], format) => {
    const rawSectionsOfStartDate = splitFormatIntoSections(utils, format, start);
    const sectionsOfStartDate = rawSectionsOfStartDate.map((section, sectionIndex) => {
      if (sectionIndex === rawSectionsOfStartDate.length - 1) {
        return {
          ...section,
          dateName: 'start' as const,
          separator: ' – ',
        };
      }

      return {
        ...section,
        dateName: 'start' as const,
      };
    });

    const sectionsOfEndDate = splitFormatIntoSections(utils, format, end).map((section) => ({
      ...section,
      dateName: 'end' as const,
    }));

    return addPositionPropertiesToSections([...sectionsOfStartDate, ...sectionsOfEndDate]);
  },
  getValueStrFromSections: (sections) => {
    const dateRangeStr = getDateRangeStrFromSections(sections, false);

    return dateRangeStr.join('');
  },
  getValueFromSections: (utils, sections, format) => {
    const dateRangeStr = getDateRangeStrFromSections(sections, true);
    const dateRange = dateRangeStr.map((dateStr) => utils.parse(dateStr, format)) as DateRange<any>;

    return {
      value: dateRange,
      // TODO: Only publish when the date currently being edited is valid
      shouldPublish: utils.isValid(dateRange[0]) || utils.isValid(dateRange[1]),
    };
  },
  getActiveDateFromActiveSection: (value, activeSection) => {
    const updateActiveDate = (dateName: 'start' | 'end') => (newActiveDate: any) => {
      if (dateName === 'start') {
        return [newActiveDate, value[1]] as DateRange<any>;
      }

      return [value[0], newActiveDate] as DateRange<any>;
    };

    if (activeSection.dateName === 'start') {
      return {
        value: value[0],
        update: updateActiveDate('start'),
      };
    }

    return {
      value: value[1],
      update: updateActiveDate('end'),
    };
  },
};

export const useDateRangeField = <TInputDate, TDate = TInputDate>(
  inProps: UseDateRangeFieldProps<TInputDate, TDate>,
) => {
  return useInternalDateField({
    value: inProps.value,
    onChange: inProps.onChange,
    format: inProps.format,
    valueManager: dateRangePickerValueManager,
    fieldValueManager: dateRangeFieldValueManager,
  });
};
