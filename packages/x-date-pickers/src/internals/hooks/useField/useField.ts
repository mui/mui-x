import { UseFieldParameters, UseFieldReturnValue, UseFieldProps } from './useField.types';
import { useFieldV7TextField } from './useFieldV7TextField';
import { PickerValidValue } from '../../models';

export const useField = <
  TValue extends PickerValidValue,
  TError,
  TValidationProps extends {},
  TProps extends UseFieldProps,
>(
  parameters: UseFieldParameters<
    TValue,
    TError,
    TValidationProps,
    TProps
  >,
): UseFieldReturnValue<TProps> => {
  return useFieldV7TextField(parameters);
};
