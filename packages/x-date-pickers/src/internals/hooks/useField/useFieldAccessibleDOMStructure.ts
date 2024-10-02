import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import {
  UseFieldInternalProps,
  UseFieldWithKnownDOMStructure,
  UseFieldAccessibleDOMGetters,
} from './useField.types';
import type { PickersSectionElement } from '../../../PickersSectionList';
import { useUtils } from '../useUtils';
import { useFieldClearValue } from './useFieldClearValue';
import { useValidation } from '../../../validation';
import { FieldSection, InferError, PickerValidDate } from '../../../models';
import { useFieldState } from './useFieldState';
import { useFieldCharacterEditing } from './useFieldCharacterEditing';
import { useFieldAccessibleDOMInteractions } from './useFieldAccessibleDOMInteractions';
import { useFieldAccessibleContainerProps } from './useFieldAccessibleContainerProps';
import { useFieldAccessibleSectionContentProps } from './useFieldAccessibleSectionContentProps';
import { useFieldAccessibleSectionContainerProps } from './useFieldAccessibleSectionContainerProps';
import { useFieldAccessibleHiddenInputProps } from './useFieldAccessibleHiddenInputProps';

export const useFieldAccessibleDOMStructure: UseFieldWithKnownDOMStructure<true> = <
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
  TInternalProps extends UseFieldInternalProps<any, any, any, true, any> & {
    minutesStep?: number;
  },
>(
  params,
) => {
  const {
    internalProps,
    internalProps: { disabled, readOnly = false },
    forwardedProps,
    forwardedProps: {
      sectionListRef: sectionListRefProp,
      error: errorProp,
      focused: focusedProp,
      autoFocus = false,
    },
    valueManager,
    fieldValueManager,
    validator,
  } = params;

  const utils = useUtils<TDate>();

  const [focused, setFocused] = React.useState(false);

  const stateResponse = useFieldState<TValue, TDate, TSection, true, InferError<TInternalProps>>(
    params,
  );
  const { state, timezone } = stateResponse;

  const { hasValidationError } = useValidation({
    props: internalProps,
    validator,
    timezone,
    value: state.value,
    onError: internalProps.onError,
  });

  const error = React.useMemo(() => {
    // only override when `error` is undefined.
    // in case of multi input fields, the `error` value is provided externally and will always be defined.
    if (errorProp !== undefined) {
      return errorProp;
    }

    return hasValidationError;
  }, [hasValidationError, errorProp]);

  const characterEditingResponse = useFieldCharacterEditing<TValue, TDate, TSection>({
    error,
    stateResponse,
  });

  // TODO: Add methods to parameters to access those elements instead of using refs
  const sectionListRef = React.useRef<UseFieldAccessibleDOMGetters>(null);
  const handleSectionListRef = useForkRef(sectionListRefProp, sectionListRef);
  const domGetters = React.useMemo<UseFieldAccessibleDOMGetters>(
    () => ({
      getRoot: () => sectionListRef.current!.getRoot(),
      getSectionContainer: (sectionIndex: number) =>
        sectionListRef.current!.getSectionContainer(sectionIndex),
      getSectionContent: (sectionIndex: number) =>
        sectionListRef.current!.getSectionContent(sectionIndex),
      getSectionIndexFromDOMElement: (element: Element | null | undefined) =>
        sectionListRef.current!.getSectionIndexFromDOMElement(element),
    }),
    [sectionListRef],
  );

  const interactions = useFieldAccessibleDOMInteractions({
    forwardedProps,
    internalProps,
    stateResponse,
    focused,
    setFocused,
    domGetters,
  });

  const areAllSectionsEmpty = valueManager.areValuesEqual(
    utils,
    state.value,
    valueManager.emptyValue,
  );

  const createSectionContainerProps = useFieldAccessibleSectionContainerProps({ stateResponse });

  const createSectionContentProps = useFieldAccessibleSectionContentProps({
    internalProps,
    stateResponse,
    characterEditingResponse,
    interactions,
    domGetters,
  });

  const elements = React.useMemo<PickersSectionElement[]>(
    () =>
      state.sections.map((section, sectionIndex) => ({
        container: createSectionContainerProps(sectionIndex),
        content: createSectionContentProps(section, sectionIndex),
        before: {
          children: section.startSeparator,
        },
        after: {
          children: section.endSeparator,
        },
      })),
    [state.sections, createSectionContainerProps, createSectionContentProps],
  );

  React.useEffect(() => {
    if (sectionListRef.current == null) {
      throw new Error(
        [
          'MUI X: The `sectionListRef` prop has not been initialized by `PickersSectionList`',
          'You probably tried to pass a component to the `textField` slot that contains an `<input />` element instead of a `PickersSectionList`.',
          '',
          'If you want to keep using an `<input />` HTML element for the editing, please remove the `enableAccessibleFieldDOMStructure` prop from your picker or field component:',
          '',
          '<DatePicker slots={{ textField: MyCustomTextField }} />',
          '',
          'Learn more about the field accessible DOM structure on the MUI documentation: https://mui.com/x/react-date-pickers/fields/#fields-to-edit-a-single-element',
        ].join('\n'),
      );
    }

    if (autoFocus) {
      domGetters.getSectionContent(0).focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const containerEventHandlers = useFieldAccessibleContainerProps({
    fieldValueManager,
    internalProps,
    forwardedProps,
    stateResponse,
    characterEditingResponse,
    interactions,
    domGetters,
    focused,
    setFocused,
  });

  const hiddenInputProps = useFieldAccessibleHiddenInputProps({
    areAllSectionsEmpty,
    fieldValueManager,
    stateResponse,
  });

  const { onClear, clearable } = useFieldClearValue({
    internalProps,
    forwardedProps,
    stateResponse,
    areAllSectionsEmpty,
    interactions,
  });

  return {
    ...forwardedProps,
    ...hiddenInputProps,
    ...containerEventHandlers,

    // Forwarded props with a default value
    focused: focusedProp ?? focused,
    autoFocus,
    onClear,
    clearable,
    error,
    sectionListRef: handleSectionListRef,

    // Additional props
    enableAccessibleFieldDOMStructure: true,
    elements,
    areAllSectionsEmpty,
    disabled,
    readOnly,
  };
};
