import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useControlled from '@mui/utils/useControlled';
import { useUtils } from './useUtils';
import type { PickerValueManager } from './usePicker';
import { PickersTimezone, PickerValidDate } from '../../models';

/**
 * Hooks making sure that:
 * - The value returned by `onChange` always have the timezone of `props.value` or `props.defaultValue` if defined
 * - The value rendered is always the one from `props.timezone` if defined
 */
export const useValueWithTimezone = <TValue, TChange extends (...params: any[]) => void>({
  timezone: timezoneProp,
  value: valueProp,
  defaultValue,
  referenceDate,
  onChange,
  valueManager,
}: UseValueWithTimezoneParameters<TValue, TChange>) => {
  const utils = useUtils();

  const firstDefaultValue = React.useRef(defaultValue);
  const inputValue = valueProp ?? firstDefaultValue.current ?? valueManager.emptyValue;

  const inputTimezone = React.useMemo(
    () => valueManager.getTimezone(utils, inputValue),
    [utils, valueManager, inputValue],
  );

  const setInputTimezone = useEventCallback((newValue: TValue) => {
    if (inputTimezone == null) {
      return newValue;
    }

    return valueManager.setTimezone(utils, inputTimezone, newValue);
  });

  let timezoneToRender: PickersTimezone;
  if (timezoneProp) {
    timezoneToRender = timezoneProp;
  } else if (inputTimezone) {
    timezoneToRender = inputTimezone;
  } else if (referenceDate) {
    timezoneToRender = utils.getTimezone(referenceDate);
  } else {
    timezoneToRender = 'default';
  }

  const valueWithTimezoneToRender = React.useMemo(
    () => valueManager.setTimezone(utils, timezoneToRender, inputValue),
    [valueManager, utils, timezoneToRender, inputValue],
  );

  const handleValueChange = useEventCallback((newValue: TValue, ...otherParams: any[]) => {
    const newValueWithInputTimezone = setInputTimezone(newValue);
    onChange?.(newValueWithInputTimezone, ...otherParams);
  }) as TChange;

  return { value: valueWithTimezoneToRender, handleValueChange, timezone: timezoneToRender };
};

/**
 * Wrapper around `useControlled` and `useValueWithTimezone`
 */
export const useControlledValueWithTimezone = <TValue, TChange extends (...params: any[]) => void>({
  name,
  timezone: timezoneProp,
  value: valueProp,
  defaultValue,
  referenceDate,
  onChange: onChangeProp,
  valueManager,
}: UseControlledValueWithTimezoneParameters<TValue, TChange>) => {
  const [valueWithInputTimezone, setValue] = useControlled({
    name,
    state: 'value',
    controlled: valueProp,
    default: defaultValue ?? valueManager.emptyValue,
  });

  const onChange = useEventCallback((newValue: TValue, ...otherParams: any[]) => {
    setValue(newValue);
    onChangeProp?.(newValue, ...otherParams);
  }) as TChange;

  return useValueWithTimezone({
    timezone: timezoneProp,
    value: valueWithInputTimezone,
    defaultValue: undefined,
    referenceDate,
    onChange,
    valueManager,
  });
};

interface UseValueWithTimezoneParameters<TValue, TChange extends (...params: any[]) => void> {
  timezone: PickersTimezone | undefined;
  value: TValue | undefined;
  defaultValue: TValue | undefined;
  /**
   * The reference date as passed to `props.referenceDate`.
   * It does not need to have its default value.
   * This is only used to determine the timezone to use when `props.value` and `props.defaultValue` are not defined.
   */
  referenceDate: PickerValidDate | undefined;
  onChange: TChange | undefined;
  valueManager: PickerValueManager<TValue, any>;
}

interface UseControlledValueWithTimezoneParameters<
  TValue,
  TChange extends (...params: any[]) => void,
> extends UseValueWithTimezoneParameters<TValue, TChange> {
  name: string;
}
