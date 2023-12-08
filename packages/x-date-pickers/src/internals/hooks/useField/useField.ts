import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { useTheme } from '@mui/material/styles';
import { useValidation } from '../useValidation';
import { useUtils } from '../useUtils';
import {
  UseFieldParams,
  UseFieldResponse,
  UseFieldCommonForwardedProps,
  UseFieldInternalProps,
  AvailableAdjustKeyCode,
  UseFieldTextField,
  UseFieldForwardedProps,
  UseFieldCommonAdditionalProps,
} from './useField.types';
import { adjustSectionValue, getSectionOrder } from './useField.utils';
import { useFieldState } from './useFieldState';
import { useFieldCharacterEditing } from './useFieldCharacterEditing';
import { FieldSection } from '../../../models';
import { useFieldV7TextField } from './useFieldV7TextField';
import { useFieldV6TextField } from './useFieldV6TextField';

export const useField = <
  TValue,
  TDate,
  TSection extends FieldSection,
  TUseV6TextField extends boolean,
  TForwardedProps extends UseFieldCommonForwardedProps & UseFieldForwardedProps<TUseV6TextField>,
  TInternalProps extends UseFieldInternalProps<any, any, any, TUseV6TextField, any> & {
    minutesStep?: number;
  },
>(
  params: UseFieldParams<TValue, TDate, TSection, TUseV6TextField, TForwardedProps, TInternalProps>,
): UseFieldResponse<TUseV6TextField, TForwardedProps> => {
  const utils = useUtils<TDate>();

  const {
    internalProps,
    internalProps: {
      unstableFieldRef,
      minutesStep,
      shouldUseV6TextField = false,
      disabled = false,
      readOnly = false,
    },
    forwardedProps: { onKeyDown, error, clearable, onClear },
    fieldValueManager,
    valueManager,
    validator,
  } = params;

  const theme = useTheme();
  const isRTL = theme.direction === 'rtl';

  const stateResponse = useFieldState(params);
  const {
    state,
    activeSectionIndex,
    parsedSelectedSections,
    setSelectedSections,
    clearValue,
    clearActiveSection,
    updateSectionValue,
    setTempAndroidValueStr,
    sectionsValueBoundaries,
    timezone,
  } = stateResponse;

  const characterEditingResponse = useFieldCharacterEditing<TDate, TSection>({
    sections: state.sections,
    updateSectionValue,
    sectionsValueBoundaries,
    setTempAndroidValueStr,
    timezone,
  });

  const { resetCharacterQuery } = characterEditingResponse;

  const areAllSectionsEmpty = valueManager.areValuesEqual(
    utils,
    state.value,
    valueManager.emptyValue,
  );

  const useFieldTextField = (
    shouldUseV6TextField ? useFieldV6TextField : useFieldV7TextField
  ) as UseFieldTextField<TUseV6TextField>;

  const sectionOrder = React.useMemo(
    () => getSectionOrder(state.sections, isRTL && shouldUseV6TextField),
    [state.sections, isRTL, shouldUseV6TextField],
  );

  const { returnedValue, interactions } = useFieldTextField({
    ...params,
    ...stateResponse,
    ...characterEditingResponse,
    areAllSectionsEmpty,
    sectionOrder,
  });

  const handleContainerKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event);

    // eslint-disable-next-line default-case
    switch (true) {
      // Select all
      case event.key === 'a' && (event.ctrlKey || event.metaKey): {
        // prevent default to make sure that the next line "select all" while updating
        // the internal state at the same time.
        event.preventDefault();
        setSelectedSections('all');
        break;
      }

      case event.key === 'Enter': {
        event.preventDefault();
        break;
      }

      // Move selection to next section
      case event.key === 'ArrowRight': {
        event.preventDefault();

        if (parsedSelectedSections == null) {
          setSelectedSections(sectionOrder.startIndex);
        } else if (parsedSelectedSections === 'all') {
          setSelectedSections(sectionOrder.endIndex);
        } else {
          const nextSectionIndex = sectionOrder.neighbors[parsedSelectedSections].rightIndex;
          if (nextSectionIndex !== null) {
            setSelectedSections(nextSectionIndex);
          }
        }
        break;
      }

      // Move selection to previous section
      case event.key === 'ArrowLeft': {
        event.preventDefault();

        if (parsedSelectedSections == null) {
          setSelectedSections(sectionOrder.endIndex);
        } else if (parsedSelectedSections === 'all') {
          setSelectedSections(sectionOrder.startIndex);
        } else {
          const nextSectionIndex = sectionOrder.neighbors[parsedSelectedSections].leftIndex;
          if (nextSectionIndex !== null) {
            setSelectedSections(nextSectionIndex);
          }
        }
        break;
      }

      // Reset the value of the selected section
      case event.key === 'Delete': {
        event.preventDefault();

        if (readOnly) {
          break;
        }

        if (parsedSelectedSections == null || parsedSelectedSections === 'all') {
          clearValue();
        } else {
          clearActiveSection();
        }
        resetCharacterQuery();
        break;
      }

      // Increment / decrement the selected section value
      case ['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key): {
        event.preventDefault();

        if (readOnly || activeSectionIndex == null) {
          break;
        }

        const activeSection = state.sections[activeSectionIndex];
        const activeDateManager = fieldValueManager.getActiveDateManager(
          utils,
          state,
          activeSection,
        );

        const newSectionValue = adjustSectionValue(
          utils,
          timezone,
          activeSection,
          event.key as AvailableAdjustKeyCode,
          sectionsValueBoundaries,
          activeDateManager.date,
          { minutesStep },
        );

        updateSectionValue({
          activeSection,
          newSectionValue,
          shouldGoToNextSection: false,
        });
        break;
      }
    }
  });

  useEnhancedEffect(() => {
    interactions.syncSelectionToDOM();
  });

  const validationError = useValidation(
    { ...internalProps, value: state.value, timezone },
    validator,
    valueManager.isSameError,
    valueManager.defaultErrorState,
  );

  const inputError = React.useMemo(() => {
    // only override when `error` is undefined.
    // in case of multi input fields, the `error` value is provided externally and will always be defined.
    if (error !== undefined) {
      return error;
    }

    return valueManager.hasError(validationError);
  }, [valueManager, validationError, error]);

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
    setSelectedSections(sectionOrder.startIndex);
    // TODO v7: Add back the v6 focus
  });

  const commonForwardedProps: Required<UseFieldCommonForwardedProps> = {
    onKeyDown: handleContainerKeyDown,
    onClear: handleClearValue,
    error: inputError,
    clearable: Boolean(clearable && !areAllSectionsEmpty && !readOnly && !disabled),
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
