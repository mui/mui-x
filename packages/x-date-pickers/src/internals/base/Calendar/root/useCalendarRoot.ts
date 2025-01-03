import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate, TimezoneProps } from '../../../../models';
import { useControlledValueWithTimezone } from '../../../hooks/useValueWithTimezone';
import { useUtils } from '../../../hooks/useUtils';
import { SECTION_TYPE_GRANULARITY } from '../../../utils/getDefaultReferenceDate';
import { singleItemValueManager } from '../../../utils/valueManagers';
import { FormProps } from '../../../models';
import { CalendarRootContext } from './CalendarRootContext';

export function useCalendarRoot(parameters: useCalendarRoot.Parameters) {
  const {
    readOnly,
    defaultValue,
    onValueChange,
    value: valueProp,
    timezone: timezoneProp,
    referenceDate: referenceDateProp,
  } = parameters;

  const utils = useUtils();

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

  const selectMonth = useEventCallback((newValue: PickerValidDate) => {
    if (readOnly) {
      return;
    }

    handleValueChange(newValue);
  });

  const context: CalendarRootContext = React.useMemo(
    () => ({ value, selectMonth, referenceDate }),
    [value, selectMonth, referenceDate],
  );

  return React.useMemo(() => ({ context }), [context]);
}

export namespace useCalendarRoot {
  export interface Parameters extends TimezoneProps, FormProps {
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
