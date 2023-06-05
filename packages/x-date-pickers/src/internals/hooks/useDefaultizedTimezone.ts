import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useControlled from '@mui/utils/useControlled';
import { useUtils } from './useUtils';
import type { PickerValueManager } from './usePicker';
import { PickersTimezone } from '../../models';

const useDefaultizedTimezone = <TDate, TValue>({
  timezone,
  value,
  valueManager,
}: {
  timezone: PickersTimezone | undefined;
  value: TValue;
  valueManager: PickerValueManager<TValue, TDate, any>;
}) => {
  const utils = useUtils<TDate>();

  const timezoneFromValue = React.useMemo(
    () => valueManager.getTimezone(utils, value),
    [value, utils, valueManager],
  );

  const timezoneToRender = timezone ?? timezoneFromValue ?? 'default';

  const setInputTimezone = useEventCallback((newValue: TValue) => {
    if (timezoneFromValue == null) {
      return newValue;
    }

    return valueManager.setTimezone(utils, timezoneFromValue, newValue);
  });

  const valueWithTimezoneToRender = React.useMemo(
    () => valueManager.setTimezone(utils, timezoneToRender, value),
    [valueManager, utils, timezoneToRender, value],
  );

  return { timezone: timezoneToRender, value: valueWithTimezoneToRender, setInputTimezone };
};

export const useValueWithDefaultizedTimezone = <
  TDate,
  TValue,
  TChange extends (...params: any[]) => void,
>({
  name,
  timezone: timezoneProp,
  value: valueProp,
  defaultValue,
  onChange,
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

  const { value, setInputTimezone, timezone } = useDefaultizedTimezone({
    value: valueWithInputTimezone,
    timezone: timezoneProp,
    valueManager,
  });

  const handleValueChange = useEventCallback((newValue: TValue, ...otherParams: any[]) => {
    setValue(newValue);
    const newValueWithInputTimezone = setInputTimezone(newValue);
    onChange?.(newValueWithInputTimezone, ...otherParams);
  }) as TChange;

  return { value, handleValueChange, timezone };
};

export const useExternalValueWithDefaultizedTimezone = <
  TDate,
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
  const firstDefaultValue = React.useRef(defaultValue);
  const externalValueWithInputTimezone =
    valueProp ?? firstDefaultValue.current ?? valueManager.emptyValue;

  const { value, setInputTimezone, timezone } = useDefaultizedTimezone({
    value: externalValueWithInputTimezone,
    timezone: timezoneProp,
    valueManager,
  });

  const handleValueChange = useEventCallback((newValue: TValue, ...otherParams: any[]) => {
    const newValueWithInputTimezone = setInputTimezone(newValue);
    onChange?.(newValueWithInputTimezone, ...otherParams);
  }) as TChange;

  return { valueFromTheOutside: value, handleValueChange, timezone };
};
