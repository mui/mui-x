import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerManager } from '../../../models';
import { UseFieldStateReturnValue } from './useFieldState';

/**
 * Generate the props to pass to the hidden input element of the field.
 * It is not used by the non-accessible DOM structure (with an <input /> element for editing).
 * It should be used in the MUI accessible DOM structure and the Base UI implementation.
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
      areAllSectionsEmpty
        ? ''
        : fieldValueManager.getV7HiddenInputValueFromSections(state.sections),
    [areAllSectionsEmpty, state.sections, fieldValueManager],
  );

  return {
    value: valueStr,
    onChange: handleChange,
  };
}

interface UseFieldHiddenInputPropsParameters {
  manager: PickerManager<any, any, any, any, any>;
  stateResponse: UseFieldStateReturnValue<any>;
}

interface UseFieldHiddenInputPropsReturnValue {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
