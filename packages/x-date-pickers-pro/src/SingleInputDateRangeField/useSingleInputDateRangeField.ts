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
  createDateFromSections,
} from '@mui/x-date-pickers/internals-fields';
import {
  DateRangeFieldSection,
  UseSingleInputDateRangeFieldDefaultizedProps,
  UseSingleInputDateRangeFieldProps,
} from './SingleInputDateRangeField.interfaces';
import { dateRangePickerValueManager } from '../DateRangePicker/shared';
import { DateRange } from '../internal/models';
import { splitDateRangeSections, removeLastSeparator } from './SingleInputDateRangeField.utils';
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
  getReferenceValue: ({ value, prevValue }) => {
    if (value[0] == null && value[1] == null) {
      return prevValue;
    }

    if (value[0] != null && value[1] != null) {
      return value;
    }

    if (value[0] != null) {
      return [value[0], value[0]];
    }

    return [value[1], value[1]];
  },
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
  getActiveDateSectionsFromActiveSection: ({ activeSection, sections }) => {
    const index = activeSection.dateName === 'start' ? 0 : 1;
    const dateRangeSections = splitDateRangeSections(sections);

    return index === 0
      ? removeLastSeparator(dateRangeSections.startDate)
      : dateRangeSections.endDate;
  },
  getActiveDateManager: ({ state, activeSection }) => {
    const index = activeSection.dateName === 'start' ? 0 : 1;

    const updateDateInRange = (date: any, dateRange: DateRange<any>) =>
      (index === 0 ? [date, dateRange[1]] : [dateRange[0], date]) as DateRange<any>;

    return {
      activeDate: state.value[index],
      referenceActiveDate: state.referenceValue[index],
      getNewValueFromNewActiveDate: (newActiveDate) => ({
        value: updateDateInRange(newActiveDate, state.value),
        referenceValue:
          newActiveDate == null
            ? state.referenceValue
            : updateDateInRange(newActiveDate, state.referenceValue),
      }),
      getInvalidValue: () => {
        if (index === 0) {
          return [null, state.value[1]];
        }

        return [state.value[0], null];
      },
    };
  },
  hasError: (error) => error[0] != null || error[1] != null,
  isSameError: isSameDateRangeError,
};

export const useDefaultizedDateRangeFieldProps = <TDate, AdditionalProps extends {}>(
  props: UseSingleInputDateRangeFieldProps<TDate>,
): UseSingleInputDateRangeFieldDefaultizedProps<TDate> & AdditionalProps => {
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
  TDate,
  TProps extends UseSingleInputDateRangeFieldProps<TDate>,
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
  } = useDefaultizedDateRangeFieldProps<TDate, TProps>(inProps);

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
