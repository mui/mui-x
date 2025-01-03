import * as React from 'react';
import type { FieldChangeHandler, UseFieldInternalProps } from './useField.types';
import {
  PickerAnyManager,
  PickerManagerError,
  PickerManagerFieldInternalProps,
  PickerManagerFieldInternalPropsWithDefaults,
  PickerManagerValue,
} from '../../models';
import { PickerContext } from '../../../hooks/usePickerContext';
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

  const setValue = publicContextValue?.setValue;
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

  const internalPropsWithDefaultsFromContext = React.useMemo(() => {
    // If one of the context is null, the other always will be null as well.
    if (privateContextValue == null || publicContextValue == null) {
      return internalProps;
    }

    return {
      value: publicContextValue.value,
      onChange: handleChangeFromPicker,
      timezone: publicContextValue.timezone,
      disabled: publicContextValue.disabled,
      format: publicContextValue.fieldFormat,
      formatDensity: privateContextValue.formatDensity,
      enableAccessibleFieldDOMStructure: privateContextValue.enableAccessibleFieldDOMStructure,
      selectedSections: privateContextValue.selectedSections,
      onSelectedSectionsChange: privateContextValue.onSelectedSectionsChange,
      ...internalProps,
    };
  }, [internalProps, privateContextValue, publicContextValue, handleChangeFromPicker]);

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
