import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerAnyManager } from '../../models/manager';
import { UseFieldStateReturnValue } from './useFieldState';

/**
 * Generate the props to pass to the hidden input element of the field.
 * @param {UseFieldHiddenInputPropsParameters} parameters The parameters of the hook.
 * @returns {UseFieldHiddenInputPropsReturnValue} The props to forward to the hidden input element of the field.
 */
export function useFieldHiddenInputProps(
  parameters: UseFieldHiddenInputPropsParameters,
): UseFieldHiddenInputPropsReturnValue {
  const {
    manager: { internal_fieldValueManager: fieldValueManager },
    stateResponse: {
      // States and derived states
      areAllSectionsEmpty,
      state,

      // Methods to update the states
      updateValueFromValueStr,
    },
  } = parameters;

  const handleChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    updateValueFromValueStr(event.target.value);
  });

  const valueStr = React.useMemo(
    () =>
      areAllSectionsEmpty ? '' : fieldValueManager.getHiddenInputValueFromSections(state.sections),
    [areAllSectionsEmpty, state.sections, fieldValueManager],
  );

  return {
    value: valueStr,
    onChange: handleChange,
  };
}

interface UseFieldHiddenInputPropsParameters {
  manager: PickerAnyManager;
  stateResponse: UseFieldStateReturnValue<any>;
}

interface UseFieldHiddenInputPropsReturnValue {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
