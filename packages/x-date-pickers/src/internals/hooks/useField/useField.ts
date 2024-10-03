import { PickerAnyValueManagerV8, PickerManagerProperties } from '../../../models';
import {
  UseFieldParams,
  UseFieldLegacyForwardedProps,
  UseFieldAccessibleForwardedProps,
  UseFieldResponse,
} from './useField.types';
import { useFieldAccessibleDOMStructure } from './useFieldAccessibleDOMStructure';
import { useFieldLegacyDOMStructure } from './useFieldLegacyDOMStructure';

export const useField = <
  TManager extends PickerAnyValueManagerV8,
  TForwardedProps extends
    PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure'] extends false
      ? UseFieldLegacyForwardedProps
      : UseFieldAccessibleForwardedProps,
>(
  parameters: UseFieldParams<TManager, TForwardedProps>,
): UseFieldResponse<
  PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure'],
  TForwardedProps
> => {
  const useFieldWithCorrectDOMStructure = (
    parameters.internalProps.enableAccessibleFieldDOMStructure
      ? useFieldAccessibleDOMStructure
      : useFieldLegacyDOMStructure
  ) as (
    params: UseFieldParams<TManager, TForwardedProps>,
  ) => UseFieldResponse<true, TForwardedProps>;

  return useFieldWithCorrectDOMStructure(parameters);
};
