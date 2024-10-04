import * as React from 'react';
import { PickerAnyValueManagerV8, PickerManagerProperties } from '../../../models';
import { useLocalizationContext } from '../useUtils';
import {
  UseFieldWithKnownDOMStructureParameters,
  UseFieldResponse,
  UseFieldForwardedProps,
} from './useField.types';
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
  const { valueManager, forwardedProps, internalProps } = parameters;

  const localizationContext = useLocalizationContext<PickerManagerProperties<TManager>['date']>();

  const internalPropsWithDefaults = React.useMemo(
    () =>
      valueManager.applyDefaultsToFieldInternalProps({
        ...localizationContext,
        internalProps,
      }),
    [valueManager, localizationContext, internalProps],
  );

  const useFieldWithKnownDOMStructure = (
    internalPropsWithDefaults.enableAccessibleFieldDOMStructure
      ? useFieldAccessibleDOMStructure
      : useFieldLegacyDOMStructure
  ) as (
    params: UseFieldWithKnownDOMStructureParameters<TManager, TForwardedProps>,
  ) => UseFieldResponse<true, TForwardedProps>;

  return useFieldWithKnownDOMStructure({
    valueManager,
    forwardedProps,
    internalPropsWithDefaults,
  });
};

export interface UseFieldParameters<
  TManager extends PickerAnyValueManagerV8,
  TForwardedProps extends UseFieldForwardedProps<
    PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure']
  >,
> {
  valueManager: TManager;
  forwardedProps: TForwardedProps;
  internalProps: PickerManagerProperties<TManager>['internalProps'];
}
