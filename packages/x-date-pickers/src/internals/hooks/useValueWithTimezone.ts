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
export const useValueWithTimezone = <
  TDate extends PickerValidDate,
  TValue,
  TChange extends (...params: any[]) => void,
>({
  timezone: timezoneProp,
  value: valueProp,
  defaultValue,
  onChange,
  valueManager,
}: {
  timezone: PickersTimezone | undefined;
  value: TValue | undefined;
  defaultValue: TValue | undefined;
  onChange: TChange | undefined;
  valueManager: PickerValueManager<TValue, TDate, any>;
}) => {
  const utils = useUtils<TDate>();

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

  const timezoneToRender = timezoneProp ?? inputTimezone ?? 'default';

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
export const useControlledValueWithTimezone = <
  TDate extends PickerValidDate,
  TValue,
  TChange extends (...params: any[]) => void,
>({
  name,
  timezone: timezoneProp,
  value: valueProp,
  defaultValue,
  onChange: onChangeProp,
  valueManager,
}: {
  name: string;
  timezone: PickersTimezone | undefined;
  value: TValue | undefined;
  defaultValue: TValue | undefined;
  onChange: TChange | undefined;
  valueManager: PickerValueManager<TValue, TDate, any>;
}) => {
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
    onChange,
    valueManager,
  });
};
