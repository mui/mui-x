import { FieldSection, PickerValidDate } from '../../../models';
import {
  UseFieldInternalProps,
  UseFieldParams,
  UseFieldLegacyForwardedProps,
  UseFieldAccessibleForwardedProps,
  UseFieldWithKnownDOMStructure,
  UseFieldResponse,
} from './useField.types';
import { useFieldAccessibleDOMStructure } from './useFieldAccessibleDOMStructure';
import { useFieldLegacyDOMStructure } from './useFieldLegacyDOMStructure';

export const useField = <
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TForwardedProps extends TEnableAccessibleFieldDOMStructure extends false
    ? UseFieldLegacyForwardedProps
    : UseFieldAccessibleForwardedProps,
  TInternalProps extends UseFieldInternalProps<
    any,
    any,
    any,
    TEnableAccessibleFieldDOMStructure,
    any
  > & {
    minutesStep?: number;
  },
>(
  parameters: UseFieldParams<
    TValue,
    TDate,
    TSection,
    TEnableAccessibleFieldDOMStructure,
    TForwardedProps,
    TInternalProps
  >,
): UseFieldResponse<TEnableAccessibleFieldDOMStructure, TForwardedProps> => {
  const useFieldWithCorrectDOMStructure = (
    parameters.internalProps.enableAccessibleFieldDOMStructure
      ? useFieldAccessibleDOMStructure
      : useFieldLegacyDOMStructure
  ) as UseFieldWithKnownDOMStructure<TEnableAccessibleFieldDOMStructure>;

  return useFieldWithCorrectDOMStructure(parameters);
};
