import {
  useUtils,
  useDefaultDates,
  parseNonNullablePickerDate,
} from '@mui/x-date-pickers/internals';
import {
  useField,
  FieldValueManager,
  splitFormatIntoSections,
  addPositionPropertiesToSections,
  createDateStrFromSections,
  createDateFromSectionsAndPreviousDate,
  shouldPublishDate,
} from '@mui/x-date-pickers/internals-fields';
import {
  DateRangeFieldSection,
  UseSingleInputDateRangeFieldDefaultizedProps,
  UseSingleInputDateRangeFieldProps,
} from './SingleInputDateRangeField.interfaces';
import { dateRangePickerValueManager } from '../DateRangePicker/shared';
import { DateRange } from '../internal/models';
import { splitDateRangeSections } from './SingleInputDateRangeField.utils';
import {
  DateRangeValidationError,
  isSameDateRangeError,
  validateDateRange,
} from '../internal/hooks/validation/useDateRangeValidation';

export const dateRangeFieldValueManager: FieldValueManager<
  DateRange<any>,
  any,
  DateRangeFieldSection,
  DateRangeValidationError
> = {
  getSectionsFromValue: (utils, prevSections, [start, end], format) => {
    const prevDateRangeSections =
      prevSections == null
        ? { startDate: null, endDate: null }
        : splitDateRangeSections(prevSections);

    const getSections = (newDate: any | null, prevDateSections: DateRangeFieldSection[] | null) => {
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
  getValueFromSections: ({ utils, prevValue, sections, format }) => {
    const removeLastSeparator = (dateSections: DateRangeFieldSection[]) =>
      dateSections.map((section, sectionIndex) => {
        if (sectionIndex === dateSections.length - 1) {
          return { ...section, separator: null };
        }

        return section;
      });

    const dateRangeSections = splitDateRangeSections(sections);

    const startDate = createDateFromSectionsAndPreviousDate({
      utils,
      sections: removeLastSeparator(dateRangeSections.startDate),
      format,
    });
    const endDate = createDateFromSectionsAndPreviousDate({
      utils,
      sections: dateRangeSections.endDate,
      format,
    });

    return {
      valueParsed: [startDate, endDate] as DateRange<any>,
      shouldPublish:
        shouldPublishDate(utils, startDate, prevValue[0]) ||
        shouldPublishDate(utils, endDate, prevValue[1]),
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
  hasError: (error) => error[0] != null || error[1] != null,
  isSameError: isSameDateRangeError,
};

export const useDefaultizedDateRangeFieldProps = <TInputDate, TDate, AdditionalProps extends {}>(
  props: UseSingleInputDateRangeFieldProps<TInputDate, TDate>,
): UseSingleInputDateRangeFieldDefaultizedProps<TInputDate, TDate> & AdditionalProps => {
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

export const useSingleInputDateRangeField = <
  TInputDate,
  TDate,
  TProps extends UseSingleInputDateRangeFieldProps<TInputDate, TDate>,
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
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    ...other
  } = useDefaultizedDateRangeFieldProps<TInputDate, TDate, TProps>(inProps);

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
      minDate,
      maxDate,
      disableFuture,
      disablePast,
    },
    valueManager: dateRangePickerValueManager,
    fieldValueManager: dateRangeFieldValueManager,
    validator: validateDateRange as any,
  });
};
