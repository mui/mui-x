import {
  PickerFieldValueManager,
  useInternalDateField,
} from '@mui/x-date-pickers/DateField/useInternalDateField';
import {
  splitFormatIntoSections,
  addPositionPropertiesToSections,
  createDateStrFromSections,
} from '@mui/x-date-pickers/DateField/DateField.utils';
import { DateRangeFieldInputSection, UseDateRangeFieldProps } from './DateRangeField.interfaces';
import { dateRangePickerValueManager } from '../DateRangePicker/shared';
import { DateRange } from '../internal/models/dateRange';
import { splitDateRangeSections } from './DateRangeField.utils';

const dateRangeFieldValueManager: PickerFieldValueManager<
  DateRange<any>,
  any,
  DateRangeFieldInputSection
> = {
  getSectionsFromValue: (utils, prevSections, [start, end], format) => {
    const prevDateRangeSections =
      prevSections == null
        ? { startDate: null, endDate: null }
        : splitDateRangeSections(prevSections);

    const getSections = (
      newDate: any | null,
      prevDateSections: DateRangeFieldInputSection[] | null,
    ) => {
      const shouldReUsePrevDateSections = !utils.isValid(newDate) && !!prevDateSections;

      if (shouldReUsePrevDateSections) {
        return prevDateSections;
      }

      return splitFormatIntoSections(utils, format, newDate);
    };

    const rawSectionsOfStartDate = getSections(start, prevDateRangeSections.startDate);
    const rawSectionsOfEndDate = getSections(end, prevDateRangeSections.endDate);

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

    const sectionsOfEndDate = rawSectionsOfEndDate.map((section) => ({
      ...section,
      dateName: 'end' as const,
    }));

    return addPositionPropertiesToSections([...sectionsOfStartDate, ...sectionsOfEndDate]);
  },
  getValueStrFromSections: (sections) => {
    const dateRangeSections = splitDateRangeSections(sections);
    const startDateStr = createDateStrFromSections(dateRangeSections.startDate);
    const endDateStr = createDateStrFromSections(dateRangeSections.endDate);

    return `${startDateStr}${endDateStr}`;
  },
  getValueFromSections: (utils, prevSections, newSections, format) => {
    const removeLastSeparator = (sections: DateRangeFieldInputSection[]) =>
      sections.map((section, sectionIndex) => {
        if (sectionIndex === sections.length - 1) {
          return { ...section, separator: null };
        }

        return section;
      });

    const prevDateRangeSections = splitDateRangeSections(prevSections);
    const dateRangeSections = splitDateRangeSections(newSections);

    const startDateStr = createDateStrFromSections(
      removeLastSeparator(dateRangeSections.startDate),
    );
    const endDateStr = createDateStrFromSections(dateRangeSections.endDate);

    const startDate = utils.parse(startDateStr, format);
    const endDate = utils.parse(endDateStr, format);

    const shouldPublish =
      (startDateStr !==
        createDateStrFromSections(removeLastSeparator(prevDateRangeSections.startDate)) &&
        utils.isValid(startDate)) ||
      (endDateStr !== createDateStrFromSections(prevDateRangeSections.endDate) &&
        utils.isValid(endDate));

    return {
      value: [startDate, endDate] as DateRange<any>,
      shouldPublish,
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
