import * as React from 'react';
import type { FieldChangeHandler, UseFieldInternalProps } from './useField.types';
import {
  PickerAnyManager,
  PickerManagerError,
  PickerManagerFieldInternalProps,
  PickerManagerFieldInternalPropsWithDefaults,
  PickerManagerValue,
} from '../../models';
import { useLocalizationContext } from '../useUtils';
import { useNullablePickerContext } from '../useNullablePickerContext';

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
  const pickerContext = useNullablePickerContext();
  const fieldPrivateContext = React.useContext(PickerFieldPrivateContext);

  const setValue = pickerContext?.setValue;
  const handleChangeFromPicker: FieldChangeHandler<
    PickerManagerValue<TManager>,
    PickerManagerError<TManager>
  > = React.useCallback(
    (newValue, ctx) => {
      return setValue?.(newValue, {
        validationError: ctx.validationError,
      });
    },
    [setValue],
  );

  return React.useMemo(() => {
    let internalPropsWithDefaultsFromContext = internalProps;
    // If one of the context is null,
    // Then the field is used as a standalone component and the other context will be null as well.
    if (fieldPrivateContext != null && pickerContext != null) {
      internalPropsWithDefaultsFromContext = {
        value: pickerContext.value,
        onChange: handleChangeFromPicker,
        timezone: pickerContext.timezone,
        disabled: pickerContext.disabled,
        format: pickerContext.fieldFormat,
        formatDensity: fieldPrivateContext.formatDensity,
        enableAccessibleFieldDOMStructure: fieldPrivateContext.enableAccessibleFieldDOMStructure,
        selectedSections: fieldPrivateContext.selectedSections,
        onSelectedSectionsChange: fieldPrivateContext.onSelectedSectionsChange,
        ...internalProps,
      };
    }

    return manager.internal_applyDefaultsToFieldInternalProps({
      ...localizationContext,
      internalProps: internalPropsWithDefaultsFromContext,
    });
  }, [
    manager,
    localizationContext,
    pickerContext,
    fieldPrivateContext,
    internalProps,
    handleChangeFromPicker,
  ]);
}

export interface PickerFieldPrivateContextValue
  extends Pick<
    UseFieldInternalProps<any, any, any>,
    | 'formatDensity'
    | 'enableAccessibleFieldDOMStructure'
    | 'selectedSections'
    | 'onSelectedSectionsChange'
  > {}
