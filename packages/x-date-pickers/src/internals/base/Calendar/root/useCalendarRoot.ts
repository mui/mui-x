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
    onError,
    defaultValue,
    onValueChange,
    value: valueProp,
    timezone: timezoneProp,
    referenceDate: referenceDateProp,
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

  const [visibleDate, setVisibleDate] = React.useState<PickerValidDate>(referenceDate);
  const [prevValue, setPrevValue] = React.useState<PickerValidDate | null>(value);
  if (value !== prevValue && utils.isValid(value)) {
    setVisibleDate(value);
    setPrevValue(value);
  }

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

  const context: CalendarRootContext = React.useMemo(
    () => ({
      value,
      setValue,
      referenceDate,
      timezone,
      disabled,
      readOnly,
      isDateDisabled,
      validationProps,
      visibleDate,
      setVisibleDate,
    }),
    [
      value,
      setValue,
      referenceDate,
      timezone,
      disabled,
      readOnly,
      isDateDisabled,
      validationProps,
      visibleDate,
      setVisibleDate,
    ],
  );

  return React.useMemo(() => ({ context }), [context]);
}

export namespace useCalendarRoot {
  export interface Parameters
    extends TimezoneProps,
      FormProps,
      OnErrorProps<PickerValue, DateValidationError>,
      ExportedValidateDateProps {
    /**
     * The controlled value that should be selected.
     *
     * To render an uncontrolled Date Calendar, use the `defaultValue` prop instead.
     */
    value?: PickerValidDate | null;
    /**
     * The uncontrolled value that should be initially selected.
     *
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
  }

  export interface ReturnValue {
    context: CalendarRootContext;
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
}
