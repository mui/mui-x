import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  DateValidationError,
  OnErrorProps,
  PickerValidDate,
  TimezoneProps,
} from '../../../../models';
import { useIsDateDisabled } from '../../../../DateCalendar/useIsDateDisabled';
import {
  ExportedValidateDateProps,
  validateDate,
  ValidateDateProps,
} from '../../../../validation/validateDate';
import { useControlledValueWithTimezone } from '../../../hooks/useValueWithTimezone';
import { useDefaultDates, useUtils } from '../../../hooks/useUtils';
import { SECTION_TYPE_GRANULARITY } from '../../../utils/getDefaultReferenceDate';
import { singleItemValueManager } from '../../../utils/valueManagers';
import { applyDefaultDate } from '../../../utils/date-utils';
import { FormProps, PickerValue } from '../../../models';
import { CalendarRootContext } from './CalendarRootContext';
import { useValidation } from '../../../../validation';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { GenericHTMLProps } from '../../utils/types';
import { useCalendarDaysGridNavigation } from './useCalendarDaysGridsNavigation';

function useAddDefaultsToValidateDateProps(
  validationDate: ExportedValidateDateProps,
): ValidateDateProps {
  const utils = useUtils();
  const defaultDates = useDefaultDates();

  const {
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
  } = validationDate;

  return React.useMemo(
    () => ({
      shouldDisableDate,
      shouldDisableMonth,
      shouldDisableYear,
      disablePast: disablePast ?? false,
      disableFuture: disableFuture ?? false,
      minDate: applyDefaultDate(utils, minDate, defaultDates.minDate),
      maxDate: applyDefaultDate(utils, maxDate, defaultDates.maxDate),
    }),
    [
      shouldDisableDate,
      shouldDisableMonth,
      shouldDisableYear,
      disablePast,
      disableFuture,
      minDate,
      maxDate,
      utils,
      defaultDates,
    ],
  );
}

export function useCalendarRoot(parameters: useCalendarRoot.Parameters) {
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
  } = parameters;

  const utils = useUtils();
  const validationProps = useAddDefaultsToValidateDateProps(parameters);

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'CalendarRoot',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange: onValueChange,
    valueManager: singleItemValueManager,
  });

  const referenceDate = React.useMemo<PickerValidDate>(
    () => {
      return singleItemValueManager.getInitialReferenceValue({
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
    validator: validateDate,
  });

  const isDateDisabled = useIsDateDisabled({
    ...validationProps,
    timezone,
  });

  const setValue = useEventCallback<CalendarRootContext['setValue']>((newValue, context) => {
    handleValueChange(newValue, {
      ...context,
      validationError: getValidationErrorForNewValue(newValue),
    });
  });

  const sectionsRef = React.useRef<
    Record<'day' | 'month' | 'year', Record<number, PickerValidDate>>
  >({
    day: {},
    month: {},
    year: {},
  });
  const registerSection = useEventCallback((section: useCalendarRoot.RegisterSectionParameters) => {
    const id = Math.random();
    sectionsRef.current[section.type][id] = section.value;
    return () => {
      delete sectionsRef.current[section.type][id];
    };
  });

  const [visibleDate, setVisibleDate] = React.useState<PickerValidDate>(referenceDate);
  const [prevValue, setPrevValue] = React.useState<PickerValidDate | null>(value);

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

  if (value !== prevValue && utils.isValid(value)) {
    setPrevValue(value);
    if (isDateCellVisible(value)) {
      setVisibleDate(value);
    }
  }

  const { applyDayGridKeyboardNavigation, registerDaysGridCells } = useCalendarDaysGridNavigation({
    visibleDate,
    setVisibleDate,
    monthPageSize,
    validationProps,
  });

  const handleVisibleDateChange = useEventCallback(
    (newVisibleDate: PickerValidDate, skipIfAlreadyVisible: boolean) => {
      if (skipIfAlreadyVisible && isDateCellVisible(newVisibleDate)) {
        return;
      }

      setVisibleDate(newVisibleDate);
    },
  );

  const context: CalendarRootContext = React.useMemo(
    () => ({
      value,
      setValue,
      referenceDate,
      timezone,
      disabled,
      readOnly,
      autoFocus,
      isDateDisabled,
      validationProps,
      visibleDate,
      setVisibleDate: handleVisibleDateChange,
      monthPageSize,
      yearPageSize,
      applyDayGridKeyboardNavigation,
      registerDaysGridCells,
      registerSection,
    }),
    [
      value,
      setValue,
      referenceDate,
      timezone,
      disabled,
      readOnly,
      autoFocus,
      isDateDisabled,
      validationProps,
      visibleDate,
      handleVisibleDateChange,
      monthPageSize,
      yearPageSize,
      applyDayGridKeyboardNavigation,
      registerDaysGridCells,
      registerSection,
    ],
  );

  const getRootProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeReactProps(externalProps, {});
  }, []);

  return React.useMemo(() => ({ getRootProps, context }), [getRootProps, context]);
}

export namespace useCalendarRoot {
  export interface Parameters
    extends TimezoneProps,
      FormProps,
      OnErrorProps<PickerValue, DateValidationError>,
      ExportedValidateDateProps {
    /**
     * The controlled value that should be selected.
     * To render an uncontrolled Date Calendar, use the `defaultValue` prop instead.
     */
    value?: PickerValidDate | null;
    /**
     * The uncontrolled value that should be initially selected.
     * To render a controlled accordion, use the `value` prop instead.
     */
    defaultValue?: PickerValidDate | null;
    /**
     * Event handler called when the selected value changes.
     * Provides the new value as an argument.
     * @param {PickerValidDate | null} value The new selected value.
     * @param {useCalendarRoot.ValueChangeHandlerContext} context Additional context information.
     */
    onValueChange?: (
      value: PickerValidDate | null,
      context: useCalendarRoot.ValueChangeHandlerContext,
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

  export interface ValueChangeHandlerContext {
    /**
     * The section handled by the UI that triggered the change.
     */
    section: 'day' | 'month' | 'year';
    /**
     * The validation error associated to the new value.
     */
    validationError: DateValidationError;
  }

  export interface RegisterSectionParameters {
    type: 'day' | 'month' | 'year';
    value: PickerValidDate;
  }
}
