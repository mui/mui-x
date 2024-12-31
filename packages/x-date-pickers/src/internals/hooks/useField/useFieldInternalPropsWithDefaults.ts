import * as React from 'react';
import { FieldChangeHandler, UseFieldInternalProps } from './useField.types';
import {
  PickerAnyManager,
  PickerManagerError,
  PickerManagerFieldInternalProps,
  PickerManagerFieldInternalPropsWithDefaults,
  PickerManagerValue,
} from '../../models';
import { PickerContext } from '../../components/PickerProvider';
import { useLocalizationContext } from '../useUtils';

export const PickerFieldPrivateContext = React.createContext<PickerFieldPrivateContextValue | null>(
  null,
);

/**
 * Applies the default values to the field internal props.
 * This is a temporary hook that will be removed during a follow up when `useField` will receive the internal props without the defaults.
 * It is only here to allow the migration to be done in smaller steps.
 */
export function useFieldInternalPropsWithDefaults<TManager extends PickerAnyManager>({
  manager,
  internalProps,
}: {
  manager: TManager;
  internalProps: PickerManagerFieldInternalProps<TManager>;
}): PickerManagerFieldInternalPropsWithDefaults<TManager> {
  const localizationContext = useLocalizationContext();
  const privateContextValue = React.useContext(PickerFieldPrivateContext);
  // TODO: Replace with useNullablePickerContext
  const publicContextValue = React.useContext(PickerContext);

  const internalPropsWithDefaultsFromContext = React.useMemo(() => {
    // If one of the context is null, the other always will be null as well.
    if (privateContextValue == null || publicContextValue == null) {
      return internalProps;
    }
    const handleChange: FieldChangeHandler<
      PickerManagerValue<TManager>,
      PickerManagerError<TManager>
    > = (newValue, ctx) => {
      if (internalProps.onChange) {
        return internalProps.onChange(newValue, ctx);
      }

      return publicContextValue.setValue(newValue, {
        validationError: ctx.validationError,
      });
    };

    return {
      ...internalProps,
      onChange: handleChange,
      value: internalProps.value ?? publicContextValue.value,
      timezone: internalProps.timezone ?? publicContextValue.timezone,
      disabled: internalProps.disabled ?? publicContextValue.disabled,
      format: internalProps.format ?? publicContextValue.fieldFormat,
      formatDensity: internalProps.formatDensity ?? privateContextValue.formatDensity,
      enableAccessibleFieldDOMStructure:
        internalProps.enableAccessibleFieldDOMStructure ??
        privateContextValue.enableAccessibleFieldDOMStructure,
      selectedSections: internalProps.selectedSections ?? privateContextValue.selectedSections,
      onSelectedSectionsChange:
        internalProps.onSelectedSectionsChange ?? privateContextValue.onSelectedSectionsChange,
    };
  }, [internalProps, privateContextValue, publicContextValue]);

  return React.useMemo(() => {
    return manager.internal_applyDefaultsToFieldInternalProps({
      ...localizationContext,
      internalProps: internalPropsWithDefaultsFromContext,
    });
  }, [manager, internalPropsWithDefaultsFromContext, localizationContext]);
}

export interface PickerFieldPrivateContextValue
  extends Pick<
    UseFieldInternalProps<any, any, any>,
    | 'formatDensity'
    | 'enableAccessibleFieldDOMStructure'
    | 'selectedSections'
    | 'onSelectedSectionsChange'
  > {}
