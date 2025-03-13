import {
  UseFieldParameters,
  UseFieldReturnValue,
  UseFieldCommonForwardedProps,
  UseFieldForwardedProps,
} from './useField.types';
import { useFieldV7TextField } from './useFieldV7TextField';
import { useFieldV6TextField } from './useFieldV6TextField';
import { PickerValidValue } from '../../models';
import { useNullableFieldPrivateContext } from '../useNullableFieldPrivateContext';

export const useField = <
  TValue extends PickerValidValue,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TValidationProps extends {},
  TFieldInternalProps extends { enableAccessibleFieldDOMStructure?: boolean },
  TForwardedProps extends UseFieldCommonForwardedProps &
    UseFieldForwardedProps<TEnableAccessibleFieldDOMStructure>,
>(
  parameters: UseFieldParameters<
    TValue,
    TEnableAccessibleFieldDOMStructure,
    TError,
    TValidationProps,
    TFieldInternalProps,
    TForwardedProps
  >,
): UseFieldReturnValue<TEnableAccessibleFieldDOMStructure, TForwardedProps> => {
  const fieldPrivateContext = useNullableFieldPrivateContext();
  const enableAccessibleFieldDOMStructure =
    parameters.internalProps.enableAccessibleFieldDOMStructure ??
    fieldPrivateContext?.enableAccessibleFieldDOMStructure ??
    true;

  const useFieldTextField = (
    enableAccessibleFieldDOMStructure ? useFieldV7TextField : useFieldV6TextField
  ) as any;

  return useFieldTextField(parameters);
};
