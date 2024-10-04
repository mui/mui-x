import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { PickerAnyAccessibleValueManagerV8, PickerManagerProperties } from '../../../models';
import {
  UseFieldAccessibleDOMGetters,
  UseFieldForwardedProps,
  UseFieldParameters,
  UseFieldResponse,
} from './useField.types';
import type { PickersSectionElement } from '../../../PickersSectionList';
import { useFieldClearValueProps } from './useFieldClearValueProps';
import { useFieldState } from './useFieldState';
import { useFieldCharacterEditing } from './useFieldCharacterEditing';
import { useFieldValidation } from './useFieldValidation';
import { useFieldAccessibleDOMInteractions } from './useFieldAccessibleDOMInteractions';
import { useFieldAccessibleContainerProps } from './useFieldAccessibleContainerProps';
import { useFieldAccessibleSectionContentProps } from './useFieldAccessibleSectionContentProps';
import { useFieldAccessibleSectionContainerProps } from './useFieldAccessibleSectionContainerProps';
import { useFieldAccessibleHiddenInputProps } from './useFieldAccessibleHiddenInputProps';
import { useLocalizationContext } from '../useUtils';

export const useFieldAccessibleDOMStructure = <
  TManager extends PickerAnyAccessibleValueManagerV8,
  TForwardedProps extends UseFieldForwardedProps<true>,
>(
  parameters: UseFieldParameters<TManager, TForwardedProps>,
): UseFieldResponse<true, TForwardedProps> => {
  const {
    internalProps,
    forwardedProps,
    forwardedProps: { sectionListRef: sectionListRefProp, focused: focusedProp, autoFocus = false },
    valueManager,
  } = parameters;

  const localizationContext = useLocalizationContext<PickerManagerProperties<TManager>['date']>();

  const internalPropsWithDefaults = React.useMemo(
    () =>
      valueManager.applyDefaultsToFieldInternalProps({
        ...localizationContext,
        internalProps,
      }),
    [valueManager, localizationContext, internalProps],
  );

  // Management of `sectionListRef` (won't be present in `PickersField`)
  const sectionListRef = React.useRef<UseFieldAccessibleDOMGetters>(null);
  const handleSectionListRef = useForkRef(sectionListRefProp, sectionListRef);
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
  }, []);

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

  const [focused, setFocused] = React.useState(false);
  const stateResponse = useFieldState({
    valueManager,
    forwardedProps,
    internalPropsWithDefaults,
  });

  const error = useFieldValidation({
    internalPropsWithDefaults,
    forwardedProps,
    valueManager,
    stateResponse,
  });

  const characterEditingResponse = useFieldCharacterEditing({
    error,
    stateResponse,
  });

  const interactions = useFieldAccessibleDOMInteractions({
    forwardedProps,
    internalPropsWithDefaults,
    stateResponse,
    focused,
    setFocused,
    domGetters,
  });

  const containerProps = useFieldAccessibleContainerProps({
    valueManager,
    internalPropsWithDefaults,
    forwardedProps,
    stateResponse,
    characterEditingResponse,
    interactions,
    domGetters,
    focused,
    setFocused,
  });

  const createSectionContainerProps = useFieldAccessibleSectionContainerProps({ stateResponse });

  const createSectionContentProps = useFieldAccessibleSectionContentProps({
    internalPropsWithDefaults,
    stateResponse,
    characterEditingResponse,
    interactions,
    domGetters,
  });

  const hiddenInputProps = useFieldAccessibleHiddenInputProps({
    valueManager,
    stateResponse,
  });

  const clearValueProps = useFieldClearValueProps({
    internalPropsWithDefaults,
    forwardedProps,
    stateResponse,
    interactions,
  });

  const elements = React.useMemo<PickersSectionElement[]>(
    () =>
      stateResponse.state.sections.map((section, sectionIndex) => ({
        container: createSectionContainerProps(sectionIndex),
        content: createSectionContentProps(section, sectionIndex),
        before: {
          children: section.startSeparator,
        },
        after: {
          children: section.endSeparator,
        },
      })),
    [stateResponse.state.sections, createSectionContainerProps, createSectionContentProps],
  );

  return {
    ...forwardedProps,
    ...hiddenInputProps,
    ...containerProps,
    ...clearValueProps,

    // Forwarded props with a default value
    focused: focusedProp ?? focused,
    autoFocus,
    error,
    sectionListRef: handleSectionListRef,

    // Additional props
    enableAccessibleFieldDOMStructure: true,
    elements,
    areAllSectionsEmpty: stateResponse.areAllSectionsEmpty,
    disabled: internalProps.disabled,
    readOnly: internalProps.readOnly,
  };
};
