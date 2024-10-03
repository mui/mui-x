import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerAnyAccessibleValueManagerV8 } from '../../../models';
import { UseFieldStateReturnValue } from './useFieldState';

export const useFieldAccessibleHiddenInputProps = <
  TManager extends PickerAnyAccessibleValueManagerV8,
>(
  parameters: UseFieldAccessibleHiddenInputParameters<TManager>,
) => {
  const {
    valueManager: { fieldValueManager },
    stateResponse: { state, updateValueFromValueStr, areAllSectionsEmpty },
  } = parameters;

  const handleChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    updateValueFromValueStr(event.target.value);
  });

  const valueStr = React.useMemo(
    () =>
      areAllSectionsEmpty
        ? ''
        : fieldValueManager.getV7HiddenInputValueFromSections(state.sections),
    [areAllSectionsEmpty, state.sections, fieldValueManager],
  );

  return {
    value: valueStr,
    onChange: handleChange,
  };
};

interface UseFieldAccessibleHiddenInputParameters<
  TManager extends PickerAnyAccessibleValueManagerV8,
> {
  valueManager: TManager;
  stateResponse: UseFieldStateReturnValue<TManager>;
}
