import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { parseSelectedSections } from './useField.utils';
import {
  UseFieldDOMGetters,
  UseFieldParameters,
  UseFieldProps,
  UseFieldReturnValue,
} from './useField.types';
import { getActiveElement } from '../../utils/utils';
import { FieldSectionType } from '../../../models';
import { useSplitFieldProps } from '../../../hooks';
import { PickersSectionElement, PickersSectionListRef } from '../../../PickersSectionList';
import { useFieldCharacterEditing } from './useFieldCharacterEditing';
import { useFieldState } from './useFieldState';
import { useFieldInternalPropsWithDefaults } from './useFieldInternalPropsWithDefaults';
import { PickerValidValue } from '../../models';
import { syncSelectionToDOM } from './syncSelectionToDOM';
import { useFieldRootProps } from './useFieldRootProps';
import { useFieldHiddenInputProps } from './useFieldHiddenInputProps';
import { useFieldSectionContainerProps } from './useFieldSectionContainerProps';
import { useFieldSectionContentProps } from './useFieldSectionContentProps';

export const useFieldV7TextField = <
  TValue extends PickerValidValue,
  TError,
  TValidationProps extends {},
  TProps extends UseFieldProps<true>,
>(
  parameters: UseFieldParameters<TValue, true, TError, TValidationProps, TProps>,
): UseFieldReturnValue<true, TProps> => {
  const {
    props,
    manager,
    skipContextFieldRefAssignment,
    manager: { valueType, internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel },
  } = parameters;

  const { internalProps, forwardedProps } = useSplitFieldProps(props, valueType);
  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    manager,
    internalProps,
    skipContextFieldRefAssignment,
  });

  const {
    sectionListRef: sectionListRefProp,
    onBlur,
    onClick,
    onFocus,
    onInput,
    onPaste,
    onKeyDown,
    onClear,
    clearable,
  } = forwardedProps;

  const {
    disabled = false,
    readOnly = false,
    autoFocus = false,
    focused: focusedProp,
    unstableFieldRef,
  } = internalPropsWithDefaults;

  const sectionListRef = React.useRef<PickersSectionListRef>(null);
  const handleSectionListRef = useForkRef(sectionListRefProp, sectionListRef);

  const domGetters = React.useMemo<UseFieldDOMGetters>(
    () => ({
      isReady: () => sectionListRef.current != null,
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

  const stateResponse = useFieldState({ manager, internalPropsWithDefaults, forwardedProps });
  const {
    // States and derived states
    areAllSectionsEmpty,
    error,
    parsedSelectedSections,
    sectionOrder,
    state,
    value,

    // Methods to update the states
    clearValue,
    setSelectedSections,
  } = stateResponse;

  const applyCharacterEditing = useFieldCharacterEditing({ stateResponse });
  const openPickerAriaLabel = useOpenPickerButtonAriaLabel(value);
  const [focused, setFocused] = React.useState(false);

  function focusField(newSelectedSections: number | FieldSectionType = 0) {
    if (
      !sectionListRef.current ||
      // if the field is already focused, we don't need to focus it again
      getActiveSectionIndex(sectionListRef) != null
    ) {
      return;
    }

    const newParsedSelectedSections = parseSelectedSections(
      newSelectedSections,
      state.sections,
    ) as number;

    setFocused(true);
    sectionListRef.current.getSectionContent(newParsedSelectedSections).focus();
  }

  const rootProps = useFieldRootProps({
    manager,
    internalPropsWithDefaults,
    stateResponse,
    applyCharacterEditing,
    focused,
    setFocused,
    domGetters,
  });
  const hiddenInputProps = useFieldHiddenInputProps({ manager, stateResponse });
  const createSectionContainerProps = useFieldSectionContainerProps({ stateResponse });
  const createSectionContentProps = useFieldSectionContentProps({
    manager,
    stateResponse,
    applyCharacterEditing,
    internalPropsWithDefaults,
    domGetters,
    focused,
  });

  const handleRootKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    rootProps.onKeyDown(event);
  });

  const handleRootBlur = useEventCallback((event: React.FocusEvent<HTMLDivElement>) => {
    onBlur?.(event);
    rootProps.onBlur(event);
  });

  const handleRootFocus = useEventCallback((event: React.FocusEvent<HTMLDivElement>) => {
    onFocus?.(event);
    rootProps.onFocus(event);
  });

  const handleRootClick = useEventCallback((event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    rootProps.onClick(event);
  });

  const handleRootPaste = useEventCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    onPaste?.(event);
    rootProps.onPaste(event);
  });

  const handleRootInput = useEventCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    onInput?.(event);
    rootProps.onInput(event);
  });

  const handleClear = useEventCallback((event: React.MouseEvent, ...args) => {
    event.preventDefault();
    onClear?.(event, ...(args as []));
    clearValue();

    if (!isFieldFocused(sectionListRef)) {
      // setSelectedSections is called internally
      focusField(0);
    } else {
      setSelectedSections(sectionOrder.startIndex);
    }
  });

  const elements = React.useMemo<PickersSectionElement[]>(() => {
    return state.sections.map((section, sectionIndex) => ({
      container: createSectionContainerProps(sectionIndex),
      content: createSectionContentProps(section, sectionIndex),
      before: {
        children: section.startSeparator,
      },
      after: {
        children: section.endSeparator,
      },
    }));
  }, [state.sections, createSectionContainerProps, createSectionContentProps]);

  React.useEffect(() => {
    if (sectionListRef.current == null) {
      throw new Error(
        [
          'MUI X: The `sectionListRef` prop has not been initialized by `PickersSectionList`',
          'You probably tried to pass a component to the `textField` slot that contains an `<input />` element instead of a `PickersSectionList`.',
          '',
          'If you want to keep using an `<input />` HTML element for the editing, please remove the `enableAccessibleFieldDOMStructure` prop from your Picker or Field component:',
          '',
          '<DatePicker slots={{ textField: MyCustomTextField }} />',
          '',
          'Learn more about the field accessible DOM structure on the MUI documentation: https://mui.com/x/react-date-pickers/fields/#fields-to-edit-a-single-element',
        ].join('\n'),
      );
    }

    if (autoFocus && sectionListRef.current) {
      sectionListRef.current.getSectionContent(sectionOrder.startIndex).focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEnhancedEffect(() => {
    if (!focused || !sectionListRef.current) {
      return;
    }

    if (parsedSelectedSections === 'all') {
      sectionListRef.current.getRoot().focus();
    } else if (typeof parsedSelectedSections === 'number') {
      const domElement = sectionListRef.current.getSectionContent(parsedSelectedSections);
      if (domElement) {
        domElement.focus();
      }
    }
  }, [parsedSelectedSections, focused]);

  useEnhancedEffect(() => {
    syncSelectionToDOM({ focused, domGetters, stateResponse });
  });

  React.useImperativeHandle(unstableFieldRef, () => ({
    getSections: () => state.sections,
    getActiveSectionIndex: () => getActiveSectionIndex(sectionListRef),
    setSelectedSections: (newSelectedSections) => {
      if (!sectionListRef.current) {
        return;
      }

      const newParsedSelectedSections = parseSelectedSections(newSelectedSections, state.sections);
      const newActiveSectionIndex =
        newParsedSelectedSections === 'all' ? 0 : newParsedSelectedSections;
      setFocused(newActiveSectionIndex !== null);
      setSelectedSections(newSelectedSections);
    },
    focusField,
    isFieldFocused: () => isFieldFocused(sectionListRef),
  }));

  return {
    // Forwarded
    ...forwardedProps,

    // Root props
    ...rootProps,
    onBlur: handleRootBlur,
    onClick: handleRootClick,
    onFocus: handleRootFocus,
    onInput: handleRootInput,
    onPaste: handleRootPaste,
    onKeyDown: handleRootKeyDown,
    onClear: handleClear,

    // Hidden input props
    ...hiddenInputProps,

    error,
    clearable: Boolean(clearable && !areAllSectionsEmpty && !readOnly && !disabled),
    focused: focusedProp ?? focused,
    sectionListRef: handleSectionListRef,
    // Additional
    enableAccessibleFieldDOMStructure: true,
    elements,
    areAllSectionsEmpty,
    disabled,
    readOnly,
    autoFocus,
    openPickerAriaLabel,
  };
};

function getActiveSectionIndex(sectionListRef: React.RefObject<PickersSectionListRef | null>) {
  const activeElement = getActiveElement(document) as HTMLElement | undefined;
  if (
    !activeElement ||
    !sectionListRef.current ||
    !sectionListRef.current.getRoot().contains(activeElement)
  ) {
    return null;
  }

  return sectionListRef.current.getSectionIndexFromDOMElement(activeElement);
}

function isFieldFocused(sectionListRef: React.RefObject<PickersSectionListRef | null>) {
  const activeElement = getActiveElement(document);
  return !!sectionListRef.current && sectionListRef.current.getRoot().contains(activeElement);
}
