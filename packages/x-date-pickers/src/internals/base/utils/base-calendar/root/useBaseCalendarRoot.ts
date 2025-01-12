import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  OnErrorProps,
  PickerChangeImportance,
  PickerManager,
  PickerValidDate,
  TimezoneProps,
} from '../../../../../models';
import { useValidation } from '../../../../../validation';
import { ValidateDateProps, validateDate } from '../../../../../validation/validateDate';
import { FormProps, PickerValidValue } from '../../../../models';
import { SECTION_TYPE_GRANULARITY } from '../../../../utils/getDefaultReferenceDate';
import { singleItemValueManager } from '../../../../utils/valueManagers';
import { applyDefaultDate } from '../../../../utils/date-utils';
import { useDefaultDates, useLocalizationContext, useUtils } from '../../../../hooks/useUtils';
import { useControlledValueWithTimezone } from '../../../../hooks/useValueWithTimezone';
import { BaseDateValidationProps } from '../../../../models/validation';
import { useBaseCalendarDaysGridNavigation } from './useBaseCalendarDaysGridsNavigation';
import { BaseCalendarRootContext } from './BaseCalendarRootContext';

export function useBaseCalendarRoot<
  TValue extends PickerValidValue,
  TError,
  TValidationProps extends Required<BaseDateValidationProps>,
>(parameters: useBaseCalendarRoot.Parameters<TValue, TError, TValidationProps>) {
  const {
    // Form props
    readOnly = false,
    disabled = false,
    // Focus and navigation props
    autoFocus = false,
    monthPageSize = 1,
    yearPageSize = 1,
    // Value props
    onError,
    defaultValue,
    onValueChange,
    value: valueProp,
    timezone: timezoneProp,
    referenceDate: referenceDateProp,
    // Validation props
    dateValidationProps,
    valueValidationProps,
    // Manager props
    manager,
    calendarValueManager: {
      getDateToUseForReferenceDate,
      getNewValueFromNewSelectedDate,
      getCurrentDateFromValue,
      getSelectedDatesFromValue,
    },
  } = parameters;

  const utils = useUtils();
  const adapter = useLocalizationContext();

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'CalendarRoot',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange: onValueChange,
    valueManager: manager.internal_valueManager,
  });

  const referenceDate = React.useMemo(
    () => {
      return singleItemValueManager.getInitialReferenceValue({
        value: getDateToUseForReferenceDate(value),
        utils,
        timezone,
        props: dateValidationProps,
        referenceDate: referenceDateProp,
        granularity: SECTION_TYPE_GRANULARITY.day,
      });
    },
    // We want the `referenceDate` to update on prop and `timezone` change (https://github.com/mui/mui-x/issues/10804)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [referenceDateProp, timezone],
  );

  const { getValidationErrorForNewValue } = useValidation({
    props: { ...valueValidationProps, onError },
    value,
    timezone,
    validator: manager.validator,
  });

  const sectionsRef = React.useRef<
    Record<'day' | 'month' | 'year', Record<number, PickerValidDate>>
  >({
    day: {},
    month: {},
    year: {},
  });
  const registerSection = useEventCallback(
    (section: useBaseCalendarRoot.RegisterSectionParameters) => {
      const id = Math.random();
      sectionsRef.current[section.type][id] = section.value;
      return () => {
        delete sectionsRef.current[section.type][id];
      };
    },
  );

  const isDateCellVisible = (date: PickerValidDate) => {
    if (Object.values(sectionsRef.current.day).length > 0) {
      return Object.values(sectionsRef.current.day).every(
        (month) => !utils.isSameMonth(date, month),
      );
    }
    if (Object.values(sectionsRef.current.month).length > 0) {
      return Object.values(sectionsRef.current.month).every(
        (year) => !utils.isSameYear(date, year),
      );
    }
    return true;
  };

  const [visibleDate, setVisibleDate] = React.useState<PickerValidDate>(referenceDate);
  const handleVisibleDateChange = useEventCallback(
    (newVisibleDate: PickerValidDate, skipIfAlreadyVisible: boolean) => {
      if (skipIfAlreadyVisible && isDateCellVisible(newVisibleDate)) {
        return;
      }

      setVisibleDate(newVisibleDate);
    },
  );

  const { applyDayGridKeyboardNavigation, registerDaysGridCells } =
    useBaseCalendarDaysGridNavigation({
      visibleDate,
      setVisibleDate,
      monthPageSize,
      dateValidationProps,
    });

  const isDateInvalid = React.useCallback(
    (day: PickerValidDate | null) =>
      validateDate({
        adapter,
        value: day,
        timezone,
        props: dateValidationProps,
      }) !== null,
    [adapter, dateValidationProps, timezone],
  );

  const setValue = useEventCallback(
    (
      newValue: TValue,
      options: { section: 'day' | 'month' | 'year'; changeImportance: 'set' | 'accept' },
    ) => {
      handleValueChange(newValue, {
        section: options.section,
        changeImportance: options.changeImportance,
        validationError: getValidationErrorForNewValue(newValue),
      });
    },
  );

  const selectDate = useEventCallback<BaseCalendarRootContext['selectDate']>(
    (selectedDate: PickerValidDate, options) => {
      const response = getNewValueFromNewSelectedDate({
        prevValue: value,
        selectedDate,
        referenceDate,
      });

      return setValue(response.value, {
        section: options.section,
        changeImportance: response.changeImportance,
      });
    },
  );

  const currentDate = getCurrentDateFromValue(value) ?? referenceDate;

  const selectedDates = React.useMemo(
    () => getSelectedDatesFromValue(value),
    [getSelectedDatesFromValue, value],
  );

  const context: BaseCalendarRootContext = React.useMemo(
    () => ({
      timezone,
      disabled,
      readOnly,
      autoFocus,
      isDateInvalid,
      visibleDate,
      currentDate,
      selectedDates,
      setVisibleDate: handleVisibleDateChange,
      monthPageSize,
      yearPageSize,
      applyDayGridKeyboardNavigation,
      registerDaysGridCells,
      registerSection,
      selectDate,
      dateValidationProps,
    }),
    [
      timezone,
      disabled,
      readOnly,
      autoFocus,
      isDateInvalid,
      visibleDate,
      currentDate,
      selectedDates,
      handleVisibleDateChange,
      monthPageSize,
      yearPageSize,
      applyDayGridKeyboardNavigation,
      registerDaysGridCells,
      registerSection,
      dateValidationProps,
      selectDate,
    ],
  );

  return {
    value,
    referenceDate,
    setValue,
    setVisibleDate,
    isDateCellVisible,
    context,
  };
}

export namespace useBaseCalendarRoot {
  export interface PublicParameters<TValue extends PickerValidValue, TError>
    extends TimezoneProps,
      FormProps,
      OnErrorProps<TValue, TError> {
    /**
     * The controlled value that should be selected.
     * To render an uncontrolled Date Calendar, use the `defaultValue` prop instead.
     */
    value?: TValue;
    /**
     * The uncontrolled value that should be initially selected.
     * To render a controlled accordion, use the `value` prop instead.
     */
    defaultValue?: TValue;
    /**
     * Event handler called when the selected value changes.
     * Provides the new value as an argument.
     * @param {TValue} value The new selected value.
     * @param {useBaseCalendarRoot.ValueChangeHandlerContext<TError>} context Additional context information.
     */
    onValueChange?: (
      value: TValue,
      context: useBaseCalendarRoot.ValueChangeHandlerContext<TError>,
    ) => void;
    /**
     * The date used to generate the new value when both `value` and `defaultValue` are empty.
     * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.
     */
    referenceDate?: PickerValidDate;
    /**
     * If `true`, one of the cells will be automatically focused when the component is mounted.
     * If a value or a default value is provided, the focused cell will be the one corresponding to the selected date.
     * @default false
     */
    autoFocus?: boolean;
    /**
     * The amount of months to navigate by when pressing <Calendar.SetVisibleMonth /> or when using keyboard navigation in the day grid.
     * This is mostly useful when displaying multiple day grids.
     * @default 1
     */
    monthPageSize?: number;
    /**
     * The amount of months to navigate by when pressing <Calendar.SetVisibleYear /> or when using keyboard navigation in the month grid or the month list.
     * This is mostly useful when displaying multiple month grids or month lists.
     * @default 1
     */
    yearPageSize?: number;
  }

  export interface Parameters<
    TValue extends PickerValidValue,
    TError,
    TValidationProps extends Required<BaseDateValidationProps>,
  > extends PublicParameters<TValue, TError> {
    /**
     * The manager of the calendar (uses `useDateManager` for Calendar and `useDateRangeManager` for RangeCalendar).
     */
    manager: PickerManager<TValue, any, TError, any, any>;
    /**
     * The methods needed to manage the value of the calendar.
     * It helps sharing the code between the Calendar and the RangeCalendar.
     */
    calendarValueManager: ValueManager<TValue>;
    /**
     * The props used to validate a single date.
     */
    dateValidationProps: ValidateDateProps;
    /**
     * The props used to validate the value.
     */
    valueValidationProps: TValidationProps;
  }

  export interface ReturnValue<TValue extends PickerValidValue> {
    value: TValue;
    referenceDate: PickerValidDate;
    setValue: (
      newValue: TValue,
      options: { section: 'day' | 'month' | 'year'; changeImportance: 'set' | 'accept' },
    ) => void;
    setVisibleDate: (newVisibleDate: PickerValidDate, skipIfAlreadyVisible: boolean) => void;
    isDateCellVisible: (date: PickerValidDate) => boolean;
    context: BaseCalendarRootContext;
  }

  export interface ValueChangeHandlerContext<TError> {
    /**
     * The section handled by the UI that triggered the change.
     */
    section: 'day' | 'month' | 'year';
    /**
     * The validation error associated to the new value.
     */
    validationError: TError;
    /**
     * The importance of the change.
     */
    changeImportance: PickerChangeImportance;
  }

  export interface RegisterSectionParameters {
    type: 'day' | 'month' | 'year';
    value: PickerValidDate;
  }

  export interface ValueManager<TValue extends PickerValidValue> {
    /**
     * TODO: Write description.
     * @param {TValue} value The value to get the reference date from.
     * @returns {PickerValidDate | null} The initial visible date.
     */
    getDateToUseForReferenceDate: (value: TValue) => PickerValidDate | null;
    /**
     * TODO: Write description.
     * @param {GetNewValueFromNewSelectedDateParameters} parameters The parameters to get the new value from the new selected date.
     * @returns {GetNewValueFromNewSelectedDateReturnValue<TValue>} The new value and its change importance.
     */
    getNewValueFromNewSelectedDate: (
      parameters: GetNewValueFromNewSelectedDateParameters<TValue>,
    ) => GetNewValueFromNewSelectedDateReturnValue<TValue>;
    /**
     * TODO: Write description.
     * @param {TValue} value The current value.
     * @returns {PickerValidDate | null} The current date.
     */
    getCurrentDateFromValue: (value: TValue) => PickerValidDate | null;
    /**
     * TODO: Write description.
     * @param {TValue} value The current value.
     * @returns {PickerValidDate[]} The selected dates.
     */
    getSelectedDatesFromValue: (value: TValue) => PickerValidDate[];
  }

  export interface GetNewValueFromNewSelectedDateParameters<TValue extends PickerValidValue> {
    /**
     * The value before the change.
     */
    prevValue: TValue;
    /**
     * The date to select.
     */
    selectedDate: PickerValidDate;
    /**
     * The reference date.
     */
    referenceDate: PickerValidDate;
  }

  export interface GetNewValueFromNewSelectedDateReturnValue<TValue extends PickerValidValue> {
    /**
     * The new value.
     */
    value: TValue;
    /**
     * The importance of the change.
     */
    changeImportance: PickerChangeImportance;
  }
}

export function useAddDefaultsToBaseDateValidationProps(
  validationDate: BaseDateValidationProps,
): Required<BaseDateValidationProps> {
  const utils = useUtils();
  const defaultDates = useDefaultDates();

  const { disablePast, disableFuture, minDate, maxDate } = validationDate;

  return React.useMemo(
    () => ({
      disablePast: disablePast ?? false,
      disableFuture: disableFuture ?? false,
      minDate: applyDefaultDate(utils, minDate, defaultDates.minDate),
      maxDate: applyDefaultDate(utils, maxDate, defaultDates.maxDate),
    }),
    [disablePast, disableFuture, minDate, maxDate, utils, defaultDates],
  );
}
