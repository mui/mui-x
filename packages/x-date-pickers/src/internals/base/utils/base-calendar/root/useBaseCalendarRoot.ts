import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { OnErrorProps, PickerManager, PickerValidDate, TimezoneProps } from '../../../../../models';
import { useValidation, ValidateDateProps } from '../../../../../validation';
import { useIsDateDisabled } from '../../../../../DateCalendar/useIsDateDisabled';
import { FormProps, InferNonNullablePickerValue, PickerValidValue } from '../../../../models';
import { SECTION_TYPE_GRANULARITY } from '../../../../utils/getDefaultReferenceDate';
import { applyDefaultDate } from '../../../../utils/date-utils';
import { useDefaultDates, useUtils } from '../../../../hooks/useUtils';
import { BaseDateValidationProps } from '../../../../models/validation';
import { useControlledValueWithTimezone } from '../../../../hooks/useValueWithTimezone';
import { useBaseCalendarDaysGridNavigation } from './useBaseCalendarDaysGridsNavigation';
import { BaseCalendarRootContext } from './BaseCalendarRootContext';

export function useBaseCalendarRoot<TValue extends PickerValidValue, TError>(
  parameters: useBaseCalendarRoot.Parameters<TValue, TError>,
) {
  const {
    readOnly = false,
    disabled = false,
    autoFocus = false,
    onError,
    defaultValue,
    onValueChange,
    value: valueProp,
    timezone: timezoneProp,
    referenceDate: referenceDateProp,
    monthPageSize = 1,
    yearPageSize = 1,
    manager,
    minDate,
    maxDate,
    disablePast,
    disableFuture,
    getInitialVisibleDate,
  } = parameters;

  const utils = useUtils();
  const validationProps = useAddDefaultsToBaseDateValidationProps({
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  });

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'CalendarRoot',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange: onValueChange,
    valueManager: manager.internal_valueManager,
  });

  const referenceValue = React.useMemo(
    () => {
      return manager.internal_valueManager.getInitialReferenceValue({
        value,
        utils,
        timezone,
        props: validationProps,
        referenceDate: referenceDateProp,
        granularity: SECTION_TYPE_GRANULARITY.day,
      });
    },
    // We want the `referenceDate` to update on prop and `timezone` change (https://github.com/mui/mui-x/issues/10804)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [referenceDateProp, timezone],
  );

  const { getValidationErrorForNewValue } = useValidation({
    props: { ...validationProps, onError },
    value,
    timezone,
    validator: manager.validator,
  });

  const setValue = useEventCallback(
    (
      newValue: TValue,
      context: Pick<useBaseCalendarRoot.ValueChangeHandlerContext<TValue>, 'section'>,
    ) => {
      handleValueChange(newValue, {
        ...context,
        validationError: getValidationErrorForNewValue(newValue),
      });
    },
  );

  // TODO: Rename this hook (if we keep it for Base UI X)
  const isDateInvalid = useIsDateDisabled({
    ...validationProps,
    timezone,
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

  const [visibleDate, setVisibleDate] = React.useState<PickerValidDate>(() =>
    getInitialVisibleDate(referenceValue),
  );
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
      validationProps,
    });

  const context: BaseCalendarRootContext = React.useMemo(
    () => ({
      timezone,
      disabled,
      readOnly,
      autoFocus,
      isDateInvalid,
      visibleDate,
      setVisibleDate: handleVisibleDateChange,
      monthPageSize,
      yearPageSize,
      applyDayGridKeyboardNavigation,
      registerDaysGridCells,
      registerSection,
      validationProps,
    }),
    [
      timezone,
      disabled,
      readOnly,
      autoFocus,
      isDateInvalid,
      visibleDate,
      handleVisibleDateChange,
      monthPageSize,
      yearPageSize,
      applyDayGridKeyboardNavigation,
      registerDaysGridCells,
      registerSection,
      validationProps,
    ],
  );

  return {
    value,
    setValue,
    referenceValue,
    setVisibleDate,
    isDateCellVisible,
    context,
    validationProps,
  };
}

export namespace useBaseCalendarRoot {
  export interface Parameters<TValue extends PickerValidValue, TError>
    extends TimezoneProps,
      FormProps,
      OnErrorProps<TValue, TError>,
      BaseDateValidationProps {
    /**
     * The manager of the calendar (uses `useDateManager` for Calendar and `useDateRangeManager` for RangeCalendar).
     */
    manager: PickerManager<TValue, any, TError, any, any>;
    /**
     * TODO: Write description
     * @param {InferNonNullablePickerValue<TValue>} referenceValue The reference value to get the initial visible date from.
     * @returns {PickerValidDate | null} The initial visible date.
     */
    getInitialVisibleDate: (referenceValue: InferNonNullablePickerValue<TValue>) => PickerValidDate;
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

  export interface ValueChangeHandlerContext<TError> {
    /**
     * The section handled by the UI that triggered the change.
     */
    section: 'day' | 'month' | 'year';
    /**
     * The validation error associated to the new value.
     */
    validationError: TError;
  }

  export interface RegisterSectionParameters {
    type: 'day' | 'month' | 'year';
    value: PickerValidDate;
  }
}

function useAddDefaultsToBaseDateValidationProps(
  validationDate: BaseDateValidationProps,
): ValidateDateProps {
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
