import { UseFieldParameters, UseFieldReturnValue, UseFieldProps } from './useField.types';
import { useFieldV7TextField } from './useFieldV7TextField';
import { useFieldV6TextField } from './useFieldV6TextField';
import { PickerValidValue } from '../../models';
import { useNullableFieldPrivateContext } from '../useNullableFieldPrivateContext';

export const useField = <
  TValue extends PickerValidValue,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TValidationProps extends {},
  TProps extends UseFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  parameters: UseFieldParameters<
    TValue,
    TEnableAccessibleFieldDOMStructure,
    TError,
    TValidationProps,
    TProps
  >,
): UseFieldReturnValue<TEnableAccessibleFieldDOMStructure, TProps> => {
  const fieldPrivateContext = useNullableFieldPrivateContext();
  const enableAccessibleFieldDOMStructure =
    parameters.props.enableAccessibleFieldDOMStructure ??
    fieldPrivateContext?.enableAccessibleFieldDOMStructure ??
    true;

  const useFieldTextField = (
    enableAccessibleFieldDOMStructure ? useFieldV7TextField : useFieldV6TextField
  ) as any;

  return useFieldTextField(parameters);
};
