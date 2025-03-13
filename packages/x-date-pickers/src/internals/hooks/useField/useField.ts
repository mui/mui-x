import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { useValidation } from '../../../validation';
import {
  UseFieldParameters,
  UseFieldResponse,
  UseFieldCommonForwardedProps,
  UseFieldTextField,
  UseFieldForwardedProps,
  UseFieldCommonAdditionalProps,
} from './useField.types';
import { useFieldState } from './useFieldState';
import { useFieldCharacterEditing } from './useFieldCharacterEditing';
import { useFieldV7TextField } from './useFieldV7TextField';
import { useFieldV6TextField } from './useFieldV6TextField';
import { PickerValidValue } from '../../models';
import { useFieldInternalPropsWithDefaults } from './useFieldInternalPropsWithDefaults';
import { useFieldHandleContainerKeyDown } from './useFieldHandleContainerKeyDown';

export const useField = <
  TValue extends PickerValidValue,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TValidationProps extends {},
  TFieldInternalProps extends {},
  TForwardedProps extends UseFieldCommonForwardedProps &
    UseFieldForwardedProps<TEnableAccessibleFieldDOMStructure>,
>(
  params: UseFieldParameters<
    TValue,
    TEnableAccessibleFieldDOMStructure,
    TError,
    TValidationProps,
    TFieldInternalProps,
    TForwardedProps
  >,
): UseFieldResponse<TEnableAccessibleFieldDOMStructure, TForwardedProps> => {
  const {
    manager,
    internalProps,
    forwardedProps,
    skipContextFieldRefAssignment,
    manager: { validator, internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel },
    forwardedProps: { onKeyDown, error, clearable, onClear },
  } = params;

  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    manager,
    internalProps,
    skipContextFieldRefAssignment,
  });

  const {
    unstableFieldRef,
    enableAccessibleFieldDOMStructure = true,
    disabled = false,
    readOnly = false,
    autoFocus = false,
  } = internalPropsWithDefaults;

  const stateResponse = useFieldState({ manager, internalPropsWithDefaults });
  const {
    state,
    value,
    activeSectionIndex,
    setSelectedSections,
    clearValue,
    clearActiveSection,
    timezone,
    areAllSectionsEmpty,
    sectionOrder,
  } = stateResponse;

  const characterEditingResponse = useFieldCharacterEditing({ stateResponse });
  const { resetCharacterQuery } = characterEditingResponse;

  const useFieldTextField = (
    enableAccessibleFieldDOMStructure ? useFieldV7TextField : useFieldV6TextField
  ) as UseFieldTextField<TEnableAccessibleFieldDOMStructure>;

  const { returnedValue, interactions } = useFieldTextField({
    manager,
    internalPropsWithDefaults,
    forwardedProps,
    stateResponse,
    characterEditingResponse,
  });

  useEnhancedEffect(() => {
    interactions.syncSelectionToDOM();
  });

  const { hasValidationError } = useValidation({
    props: internalPropsWithDefaults,
    validator,
    timezone,
    value,
    onError: internalPropsWithDefaults.onError,
  });

  const inputError = React.useMemo(() => {
    // only override when `error` is undefined.
    // in case of multi input fields, the `error` value is provided externally and will always be defined.
    if (error !== undefined) {
      return error;
    }

    return hasValidationError;
  }, [hasValidationError, error]);

  React.useEffect(() => {
    if (!inputError && activeSectionIndex == null) {
      resetCharacterQuery();
    }
  }, [state.referenceValue, activeSectionIndex, inputError]); // eslint-disable-line react-hooks/exhaustive-deps

  // If `tempValueStrAndroid` is still defined for some section when running `useEffect`,
  // Then `onChange` has only been called once, which means the user pressed `Backspace` to reset the section.
  // This causes a small flickering on Android,
  // But we can't use `useEnhancedEffect` which is always called before the second `onChange` call and then would cause false positives.
  React.useEffect(() => {
    if (state.tempValueStrAndroid != null && activeSectionIndex != null) {
      resetCharacterQuery();
      clearActiveSection();
    }
  }, [state.sections]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useImperativeHandle(unstableFieldRef, () => ({
    getSections: () => state.sections,
    getActiveSectionIndex: interactions.getActiveSectionIndexFromDOM,
    setSelectedSections: interactions.setSelectedSections,
    focusField: interactions.focusField,
    isFieldFocused: interactions.isFieldFocused,
  }));

  const handleClearValue = useEventCallback((event: React.MouseEvent, ...args) => {
    event.preventDefault();
    onClear?.(event, ...(args as []));
    clearValue();

    if (!interactions.isFieldFocused()) {
      // setSelectedSections is called internally
      interactions.focusField(0);
    } else {
      setSelectedSections(sectionOrder.startIndex);
    }
  });

  const handleContainerKeyDown = useFieldHandleContainerKeyDown({
    manager,
    internalPropsWithDefaults,
    stateResponse,
    characterEditingResponse,
  });

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event);
    handleContainerKeyDown(event);
  });

  const commonForwardedProps: Required<UseFieldCommonForwardedProps> = {
    onKeyDown: handleKeyDown,
    onClear: handleClearValue,
    error: inputError,
    clearable: Boolean(clearable && !areAllSectionsEmpty && !readOnly && !disabled),
  };

  const getOpenPickerButtonAriaLabel = useOpenPickerButtonAriaLabel();
  const openPickerAriaLabel = React.useMemo(
    () => getOpenPickerButtonAriaLabel(value),
    [getOpenPickerButtonAriaLabel, value],
  );

  const commonAdditionalProps: UseFieldCommonAdditionalProps = {
    disabled,
    readOnly,
    autoFocus,
    openPickerAriaLabel,
  };

  return {
    ...params.forwardedProps,
    ...commonForwardedProps,
    ...commonAdditionalProps,
    ...returnedValue,
  };
};
