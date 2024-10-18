import { PickerAnyValueManagerV8, PickerManagerProperties } from '../../../models';
import { UseFieldResponse, UseFieldForwardedProps, UseFieldParameters } from './useField.types';
import { useFieldAccessibleDOMStructure } from './useFieldAccessibleDOMStructure';
import { useFieldLegacyDOMStructure } from './useFieldLegacyDOMStructure';

export const useField = <
  TManager extends PickerAnyValueManagerV8,
  TForwardedProps extends UseFieldForwardedProps<
    PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure']
  >,
>(
  parameters: UseFieldParameters<TManager, TForwardedProps>,
): UseFieldResponse<
  PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure'],
  TForwardedProps
> => {
  const useFieldWithKnownDOMStructure = (parameters.internalProps.enableAccessibleFieldDOMStructure
    ? useFieldAccessibleDOMStructure
    : useFieldLegacyDOMStructure) as unknown as (
    params: UseFieldParameters<TManager, TForwardedProps>,
  ) => UseFieldResponse<
    PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure'],
    TForwardedProps
  >;

  return useFieldWithKnownDOMStructure(parameters);
};
