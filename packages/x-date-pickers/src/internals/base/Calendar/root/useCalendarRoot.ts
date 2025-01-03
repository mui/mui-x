import { PickerValidDate, TimezoneProps } from '../../../../models';
import { useControlledValueWithTimezone } from '../../../hooks/useValueWithTimezone';
import { singleItemValueManager } from '../../../utils/valueManagers';

export function useCalendarRoot(parameters) {
  const {
    defaultValue,
    onValueChange,
    value: valueProp,
    timezone: timezoneProp,
    referenceDate: referenceDateProp,
  } = parameters;

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'CalendarRoot',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange: onValueChange,
    valueManager: singleItemValueManager,
  });

  const getRootProps = React.useCallback(() => {
    return {};
  }, []);

  return React.useMemo(() => ({}));
}

export namespace useCalendarRoot {
  export interface Parameters extends TimezoneProps {
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
    onValueChange: (value: PickerValidDate | null) => void;
    /**
     * The date used to generate the new value when both `value` and `defaultValue` are empty.
     * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.
     */
    referenceDate?: PickerValidDate;
  }
}
