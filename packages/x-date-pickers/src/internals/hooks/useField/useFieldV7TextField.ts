import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useId from '@mui/utils/useId';
import { getSectionValueNow, getSectionValueText, parseSelectedSections } from './useField.utils';
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
import { usePickerTranslations } from '../../../hooks/usePickerTranslations';
import { useUtils } from '../useUtils';
import { useFieldCharacterEditing } from './useFieldCharacterEditing';
import { useFieldState } from './useFieldState';
import { useFieldInternalPropsWithDefaults } from './useFieldInternalPropsWithDefaults';
import { PickerValidValue } from '../../models';
import { syncSelectionToDOM } from './syncSelectionToDOM';
import { useFieldRootProps } from './useFieldRootProps';

export const useFieldV7TextField = <
  TValue extends PickerValidValue,
  TError,
  TValidationProps extends {},
  TProps extends UseFieldProps<true>,
>(
  parameters: UseFieldParameters<TValue, true, TError, TValidationProps, TProps>,
): UseFieldReturnValue<true, TProps> => {
  const translations = usePickerTranslations();
  const utils = useUtils();
  const id = useId();

  const {
    props,
    manager,
    skipContextFieldRefAssignment,
    manager: {
      valueType,
      internal_fieldValueManager: fieldValueManager,
      internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel,
    },
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
    sectionsValueBoundaries,
    state,
    value,

    // Methods to update the states
    clearValue,
    clearActiveSection,
    setCharacterQuery,
    setSelectedSections,
    updateSectionValue,
    updateValueFromValueStr,
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

  /**
   * If a section content has been updated with a value we don't want to keep,
   * Then we need to imperatively revert it (we can't let React do it because the value did not change in his internal representation).
   */
  const revertDOMSectionChange = useEventCallback((sectionIndex: number) => {
    if (!sectionListRef.current) {
      return;
    }

    const section = state.sections[sectionIndex];

    sectionListRef.current.getSectionContent(sectionIndex).innerHTML =
      section.value || section.placeholder;
    syncSelectionToDOM({ focused, domGetters, stateResponse });
  });

  const getInputContainerClickHandler = useEventCallback(
    (sectionIndex: number) => (event: React.MouseEvent<HTMLDivElement>) => {
      // The click event on the clear button would propagate to the input, trigger this handler and result in a wrong section selection.
      // We avoid this by checking if the call to this function is actually intended, or a side effect.
      if (event.isDefaultPrevented()) {
        return;
      }

      setSelectedSections(sectionIndex);
    },
  );

  const rootProps = useFieldRootProps({
    manager,
    internalPropsWithDefaults,
    stateResponse,
    applyCharacterEditing,
    focused,
    setFocused,
    domGetters,
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

  const handleInputContentMouseUp = useEventCallback((event: React.MouseEvent) => {
    // Without this, the browser will remove the selected when clicking inside an already-selected section.
    event.preventDefault();
  });

  const getInputContentFocusHandler = useEventCallback((sectionIndex: number) => () => {
    setSelectedSections(sectionIndex);
  });

  const handleInputContentPaste = useEventCallback(
    (event: React.ClipboardEvent<HTMLSpanElement>) => {
      // prevent default to avoid the input `onInput` handler being called
      event.preventDefault();

      if (readOnly || disabled || typeof parsedSelectedSections !== 'number') {
        return;
      }

      const activeSection = state.sections[parsedSelectedSections];
      const pastedValue = event.clipboardData.getData('text');
      const lettersOnly = /^[a-zA-Z]+$/.test(pastedValue);
      const digitsOnly = /^[0-9]+$/.test(pastedValue);
      const digitsAndLetterOnly = /^(([a-zA-Z]+)|)([0-9]+)(([a-zA-Z]+)|)$/.test(pastedValue);
      const isValidPastedValue =
        (activeSection.contentType === 'letter' && lettersOnly) ||
        (activeSection.contentType === 'digit' && digitsOnly) ||
        (activeSection.contentType === 'digit-with-letter' && digitsAndLetterOnly);

      if (isValidPastedValue) {
        setCharacterQuery(null);
        updateSectionValue({
          section: activeSection,
          newSectionValue: pastedValue,
          shouldGoToNextSection: true,
        });
      }
      // If the pasted value corresponds to a single section, but not the expected type, we skip the modification
      else if (!lettersOnly && !digitsOnly) {
        setCharacterQuery(null);
        updateValueFromValueStr(pastedValue);
      }
    },
  );

  const handleInputContentDragOver = useEventCallback((event: React.DragEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'none';
  });

  const handleInputContentInput = useEventCallback((event: React.FormEvent<HTMLSpanElement>) => {
    if (!sectionListRef.current) {
      return;
    }

    const target = event.target as HTMLSpanElement;
    const keyPressed = target.textContent ?? '';
    const sectionIndex = sectionListRef.current.getSectionIndexFromDOMElement(target)!;
    const section = state.sections[sectionIndex];

    if (readOnly || !sectionListRef.current) {
      revertDOMSectionChange(sectionIndex);
      return;
    }

    if (keyPressed.length === 0) {
      if (section.value === '') {
        revertDOMSectionChange(sectionIndex);
        return;
      }

      const inputType = (event.nativeEvent as InputEvent).inputType;
      if (inputType === 'insertParagraph' || inputType === 'insertLineBreak') {
        revertDOMSectionChange(sectionIndex);
        return;
      }

      revertDOMSectionChange(sectionIndex);
      clearActiveSection();
      return;
    }

    applyCharacterEditing({
      keyPressed,
      sectionIndex,
    });

    // The DOM value needs to remain the one React is expecting.
    revertDOMSectionChange(sectionIndex);
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

  const isContainerEditable = parsedSelectedSections === 'all';
  const elements = React.useMemo<PickersSectionElement[]>(() => {
    return state.sections.map((section, index) => {
      const isEditable = !isContainerEditable && !disabled && !readOnly;
      const sectionBoundaries = sectionsValueBoundaries[section.type]({
        currentDate: fieldValueManager.getDateFromSection(value, section),
        contentType: section.contentType,
        format: section.format,
      });

      return {
        container: {
          'data-sectionindex': index,
          onClick: getInputContainerClickHandler(index),
        } as React.HTMLAttributes<HTMLSpanElement>,
        content: {
          tabIndex: isContainerEditable || index > 0 ? -1 : 0,
          contentEditable: !isContainerEditable && !disabled && !readOnly,
          role: 'spinbutton',
          id: `${id}-${section.type}`,
          'aria-labelledby': `${id}-${section.type}`,
          'aria-readonly': readOnly,
          'aria-valuenow': getSectionValueNow(section, utils),
          'aria-valuemin': sectionBoundaries.minimum,
          'aria-valuemax': sectionBoundaries.maximum,
          'aria-valuetext': section.value
            ? getSectionValueText(section, utils)
            : translations.empty,
          'aria-label': translations[section.type],
          'aria-disabled': disabled,
          spellCheck: isEditable ? false : undefined,
          autoCapitalize: isEditable ? 'off' : undefined,
          autoCorrect: isEditable ? 'off' : undefined,
          [parseInt(React.version, 10) >= 17 ? 'enterKeyHint' : 'enterkeyhint']: isEditable
            ? 'next'
            : undefined,
          children: section.value || section.placeholder,
          onInput: handleInputContentInput,
          onPaste: handleInputContentPaste,
          onFocus: getInputContentFocusHandler(index),
          onDragOver: handleInputContentDragOver,
          onMouseUp: handleInputContentMouseUp,
          inputMode: section.contentType === 'letter' ? 'text' : 'numeric',
        },
        before: {
          children: section.startSeparator,
        },
        after: {
          children: section.endSeparator,
        },
      };
    });
  }, [
    disabled,
    fieldValueManager,
    getInputContainerClickHandler,
    getInputContentFocusHandler,
    handleInputContentDragOver,
    handleInputContentInput,
    handleInputContentMouseUp,
    handleInputContentPaste,
    id,
    isContainerEditable,
    readOnly,
    sectionsValueBoundaries,
    state.sections,
    translations,
    utils,
    value,
  ]);

  const handleValueStrChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    updateValueFromValueStr(event.target.value);
  });

  const valueStr = React.useMemo(
    () =>
      areAllSectionsEmpty
        ? ''
        : fieldValueManager.getV7HiddenInputValueFromSections(state.sections),
    [areAllSectionsEmpty, state.sections, fieldValueManager],
  );

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

    error,
    clearable: Boolean(clearable && !areAllSectionsEmpty && !readOnly && !disabled),
    focused: focusedProp ?? focused,
    sectionListRef: handleSectionListRef,
    // Additional
    enableAccessibleFieldDOMStructure: true,
    elements,
    value: valueStr,
    onChange: handleValueStrChange,
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
