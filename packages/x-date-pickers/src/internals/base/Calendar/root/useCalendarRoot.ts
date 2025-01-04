import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate, TimezoneProps } from '../../../../models';
import { useIsDateDisabled } from '../../../../DateCalendar/useIsDateDisabled';
import { ExportedValidateDateProps, ValidateDateProps } from '../../../../validation/validateDate';
import { useControlledValueWithTimezone } from '../../../hooks/useValueWithTimezone';
import { useDefaultDates, useUtils } from '../../../hooks/useUtils';
import { SECTION_TYPE_GRANULARITY } from '../../../utils/getDefaultReferenceDate';
import { singleItemValueManager } from '../../../utils/valueManagers';
import { applyDefaultDate } from '../../../utils/date-utils';
import { FormProps } from '../../../models';
import { CalendarRootContext } from './CalendarRootContext';
import { set } from 'date-fns';

function useAddDefaultsToValidationDates(
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
    defaultValue,
    onValueChange,
    value: valueProp,
    timezone: timezoneProp,
    referenceDate: referenceDateProp,
  } = parameters;

  const utils = useUtils();
  const validationProps = useAddDefaultsToValidationDates(parameters);

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
        // TODO: Add validation props.
        props: {},
        referenceDate: referenceDateProp,
        granularity: SECTION_TYPE_GRANULARITY.day,
      });
    },
    // We want the `referenceDate` to update on prop and `timezone` change (https://github.com/mui/mui-x/issues/10804)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [referenceDateProp, timezone],
  );

  // TODO: Allow to control this state
  const [activeSection, setActiveSection] = React.useState<'day' | 'month' | 'year'>('day');
  const [visibleDate, setVisibleDate] = React.useState<PickerValidDate>(referenceDate);

  const isDateDisabled = useIsDateDisabled({
    ...validationProps,
    timezone,
  });

  const setValue = useEventCallback(
    (newValue: PickerValidDate, source: 'day' | 'month' | 'year') => {
      if (source === 'month') {
        setActiveSection('day');
      }

      if (source === 'year') {
        setActiveSection('month');
      }

      handleValueChange(newValue);
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
      isDateDisabled,
      validationProps,
      activeSection,
      visibleDate,
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
      activeSection,
      visibleDate,
    ],
  );

  return React.useMemo(() => ({ context }), [context]);
}

export namespace useCalendarRoot {
  export interface Parameters extends TimezoneProps, FormProps, ExportedValidateDateProps {
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
     */
    onValueChange?: (value: PickerValidDate | null) => void;
    /**
     * The date used to generate the new value when both `value` and `defaultValue` are empty.
     * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.
     */
    referenceDate?: PickerValidDate;
  }

  export interface ReturnValue {
    context: CalendarRootContext;
  }
}
