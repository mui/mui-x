import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { FieldSection, PickerValidDate } from '../../../models';
import { UseFieldStateResponse } from './useFieldState';
import { FieldValueManager } from './useField.types';

export const useFieldAccessibleHiddenInputProps = <
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
>(
  parameters: UseFieldAccessibleHiddenInputParameters<TValue, TDate, TSection>,
) => {
  const {
    fieldValueManager,
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
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
> {
  fieldValueManager: FieldValueManager<TValue, TDate, TSection>;
  stateResponse: UseFieldStateResponse<TValue, TDate, TSection>;
}
