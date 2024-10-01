import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { useValidation } from '../../../validation';
import { useUtils } from '../useUtils';
import {
  UseFieldParams,
  UseFieldResponse,
  UseFieldCommonForwardedProps,
  UseFieldInternalProps,
  UseFieldTextField,
  UseFieldForwardedProps,
  UseFieldCommonAdditionalProps,
} from './useField.types';
import { useFieldState } from './useFieldState';
import { useFieldCharacterEditing } from './useFieldCharacterEditing';
import { PickerValidDate, FieldSection } from '../../../models';
import { useFieldV7TextField } from './useFieldV7TextField';
import { useFieldV6TextField } from './useFieldV6TextField';

export const useField = <
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TForwardedProps extends UseFieldCommonForwardedProps &
    UseFieldForwardedProps<TEnableAccessibleFieldDOMStructure>,
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
  params: UseFieldParams<
    TValue,
    TDate,
    TSection,
    TEnableAccessibleFieldDOMStructure,
    TForwardedProps,
    TInternalProps
  >,
): UseFieldResponse<TEnableAccessibleFieldDOMStructure, TForwardedProps> => {
  const utils = useUtils<TDate>();

  const {
    internalProps,
    internalProps: {
      unstableFieldRef,
      enableAccessibleFieldDOMStructure = false,
      disabled = false,
      readOnly = false,
    },
    forwardedProps: { error },
    valueManager,
    validator,
  } = params;

  const stateResponse = useFieldState(params);
  const { state, activeSectionIndex, clearActiveSection, timezone } = stateResponse;

  const characterEditingResponse = useFieldCharacterEditing<TValue, TDate, TSection>({
    stateResponse,
  });

  const { resetCharacterQuery } = characterEditingResponse;

  const areAllSectionsEmpty = valueManager.areValuesEqual(
    utils,
    state.value,
    valueManager.emptyValue,
  );

  const useFieldTextField = (
    enableAccessibleFieldDOMStructure ? useFieldV7TextField : useFieldV6TextField
  ) as UseFieldTextField<TEnableAccessibleFieldDOMStructure>;

  const { returnedValue, interactions } = useFieldTextField({
    ...params,
    stateResponse,
    characterEditingResponse,
    areAllSectionsEmpty,
  });

  useEnhancedEffect(() => {
    interactions.syncSelectionToDOM();
  });

  const { hasValidationError } = useValidation({
    props: internalProps,
    validator,
    timezone,
    value: state.value,
    onError: internalProps.onError,
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

  const commonForwardedProps: Required<UseFieldCommonForwardedProps> = {
    error: inputError,
  };

  const commonAdditionalProps: UseFieldCommonAdditionalProps = {
    disabled,
    readOnly,
  };

  return {
    ...params.forwardedProps,
    ...commonForwardedProps,
    ...commonAdditionalProps,
    ...returnedValue,
  };
};
