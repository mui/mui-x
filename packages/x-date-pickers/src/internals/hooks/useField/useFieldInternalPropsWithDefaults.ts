import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import type { FieldChangeHandler } from './useField.types';
import {
  PickerAnyManager,
  PickerManagerError,
  PickerManagerFieldInternalProps,
  PickerManagerFieldInternalPropsWithDefaults,
  PickerManagerValue,
} from '../../models';
import { useLocalizationContext } from '../useUtils';
import { useNullablePickerContext } from '../useNullablePickerContext';
import { useNullableFieldPrivateContext } from '../useNullableFieldPrivateContext';

/**
 * Applies the default values to the field internal props.
 * This is a temporary hook that will be removed during a follow up when `useField` will receive the internal props without the defaults.
 * It is only here to allow the migration to be done in smaller steps.
 */
export function useFieldInternalPropsWithDefaults<TManager extends PickerAnyManager>(
  parameters: UseFieldInternalPropsWithDefaultsParameters<TManager>,
): PickerManagerFieldInternalPropsWithDefaults<TManager> {
  const { manager, internalProps, skipContextFieldRefAssignment } = parameters;
  const localizationContext = useLocalizationContext();
  const pickerContext = useNullablePickerContext();
  const fieldPrivateContext = useNullableFieldPrivateContext();

  const handleFieldRef = useForkRef(
    internalProps.unstableFieldRef,
    skipContextFieldRefAssignment ? null : fieldPrivateContext?.fieldRef,
  );

  const setValue = pickerContext?.setValue;
  const handleChangeFromPicker: FieldChangeHandler<
    PickerManagerValue<TManager>,
    PickerManagerError<TManager>
  > = React.useCallback(
    (newValue, ctx) => {
      return setValue?.(newValue, {
        validationError: ctx.validationError,
        shouldClose: false,
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
        readOnly: pickerContext.readOnly,
        autoFocus: pickerContext.autoFocus && !pickerContext.open,
        focused: pickerContext.open ? true : undefined,
        format: pickerContext.fieldFormat,
        formatDensity: fieldPrivateContext.formatDensity,
        enableAccessibleFieldDOMStructure: fieldPrivateContext.enableAccessibleFieldDOMStructure,
        selectedSections: fieldPrivateContext.selectedSections,
        onSelectedSectionsChange: fieldPrivateContext.onSelectedSectionsChange,
        unstableFieldRef: handleFieldRef,
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
    handleFieldRef,
  ]);
}

interface UseFieldInternalPropsWithDefaultsParameters<TManager extends PickerAnyManager> {
  manager: TManager;
  internalProps: PickerManagerFieldInternalProps<TManager>;
  /**
   * Hack to make sure that on multi input range field, the `useNullableFieldPrivateContext().fieldRef` is only bound to the field matching the range position.
   * @default false
   */
  skipContextFieldRefAssignment?: boolean;
}
