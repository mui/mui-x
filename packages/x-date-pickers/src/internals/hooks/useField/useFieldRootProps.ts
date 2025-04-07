import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import { PickerManager } from '../../../models';
import { UseFieldDOMGetters, UseFieldInternalProps } from './useField.types';
import { useFieldRootHandleKeyDown } from './useFieldRootHandleKeyDown';
import { UseFieldStateReturnValue } from './useFieldState';
import { getActiveElement } from '../../utils/utils';
import { UseFieldCharacterEditingReturnValue } from './useFieldCharacterEditing';
import { syncSelectionToDOM } from './syncSelectionToDOM';

/**
 * Generate the props to pass to the root element of the field.
 * It is not used by the non-accessible DOM structure (with an <input /> element for editing).
 * It should be used in the MUI accessible DOM structure and the Base UI implementation.
 * @param {UseFieldRootPropsParameters} parameters The parameters of the hook.
 * @returns {UseFieldRootPropsReturnValue} The props to forward to the root element of the field.
 */
export function useFieldRootProps(
  parameters: UseFieldRootPropsParameters,
): UseFieldRootPropsReturnValue {
  const {
    manager,
    focused,
    setFocused,
    domGetters,
    stateResponse,
    applyCharacterEditing,
    internalPropsWithDefaults,
    stateResponse: {
      // States and derived states
      parsedSelectedSections,
      sectionOrder,
      state,

      // Methods to update the states
      clearValue,
      setCharacterQuery,
      setSelectedSections,
      updateValueFromValueStr,
    },
    internalPropsWithDefaults: { disabled = false, readOnly = false },
  } = parameters;

  // TODO: Inline onContainerKeyDown once the old DOM structure is removed
  const handleKeyDown = useFieldRootHandleKeyDown({
    manager,
    internalPropsWithDefaults,
    stateResponse,
  });

  const containerClickTimeout = useTimeout();
  const handleClick = useEventCallback((event: React.MouseEvent) => {
    if (disabled || !domGetters.isReady()) {
      return;
    }

    setFocused(true);

    if (parsedSelectedSections === 'all') {
      containerClickTimeout.start(0, () => {
        const cursorPosition = document.getSelection()!.getRangeAt(0).startOffset;

        if (cursorPosition === 0) {
          setSelectedSections(sectionOrder.startIndex);
          return;
        }

        let sectionIndex = 0;
        let cursorOnStartOfSection = 0;

        while (cursorOnStartOfSection < cursorPosition && sectionIndex < state.sections.length) {
          const section = state.sections[sectionIndex];
          sectionIndex += 1;
          cursorOnStartOfSection += `${section.startSeparator}${
            section.value || section.placeholder
          }${section.endSeparator}`.length;
        }

        setSelectedSections(sectionIndex - 1);
      });
    } else if (!focused) {
      setFocused(true);
      setSelectedSections(sectionOrder.startIndex);
    } else {
      const hasClickedOnASection = domGetters.getRoot().contains(event.target as Node);

      if (!hasClickedOnASection) {
        setSelectedSections(sectionOrder.startIndex);
      }
    }
  });

  const handleInput = useEventCallback((event: React.FormEvent<HTMLDivElement>) => {
    if (!domGetters.isReady() || parsedSelectedSections !== 'all') {
      return;
    }

    const target = event.target as HTMLSpanElement;
    const keyPressed = target.textContent ?? '';

    domGetters.getRoot().innerHTML = state.sections
      .map(
        (section) =>
          `${section.startSeparator}${section.value || section.placeholder}${section.endSeparator}`,
      )
      .join('');
    syncSelectionToDOM({ focused, domGetters, stateResponse });

    if (keyPressed.length === 0 || keyPressed.charCodeAt(0) === 10) {
      clearValue();
      setSelectedSections('all');
    } else if (keyPressed.length > 1) {
      updateValueFromValueStr(keyPressed);
    } else {
      if (parsedSelectedSections === 'all') {
        setSelectedSections(0);
      }
      applyCharacterEditing({
        keyPressed,
        sectionIndex: 0,
      });
    }
  });

  const handlePaste = useEventCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    if (readOnly || parsedSelectedSections !== 'all') {
      event.preventDefault();
      return;
    }

    const pastedValue = event.clipboardData.getData('text');
    event.preventDefault();
    setCharacterQuery(null);
    updateValueFromValueStr(pastedValue);
  });

  const handleFocus = useEventCallback(() => {
    if (focused || disabled || !domGetters.isReady()) {
      return;
    }

    const activeElement = getActiveElement(document);

    setFocused(true);

    const isFocusInsideASection = domGetters.getSectionIndexFromDOMElement(activeElement) != null;
    if (!isFocusInsideASection) {
      setSelectedSections(sectionOrder.startIndex);
    }
  });

  const handleBlur = useEventCallback(() => {
    setTimeout(() => {
      if (!domGetters.isReady()) {
        return;
      }

      const activeElement = getActiveElement(document);
      const shouldBlur = !domGetters.getRoot().contains(activeElement);
      if (shouldBlur) {
        setFocused(false);
        setSelectedSections(null);
      }
    });
  });

  return {
    // Event handlers
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onClick: handleClick,
    onPaste: handlePaste,
    onInput: handleInput,

    // Other
    contentEditable: parsedSelectedSections === 'all',
    tabIndex: parsedSelectedSections === 0 ? -1 : 0, // TODO: Try to set to undefined when there is a section selected.
  };
}

interface UseFieldRootPropsParameters {
  manager: PickerManager<any, any, any, any, any>;
  stateResponse: UseFieldStateReturnValue<any>;
  applyCharacterEditing: UseFieldCharacterEditingReturnValue;
  internalPropsWithDefaults: UseFieldInternalProps<any, any, any>;
  domGetters: UseFieldDOMGetters;
  focused: boolean;
  setFocused: (focused: boolean) => void;
}

interface UseFieldRootPropsReturnValue {
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
  onBlur: React.FocusEventHandler<HTMLDivElement>;
  onFocus: React.FocusEventHandler<HTMLDivElement>;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  onPaste: React.ClipboardEventHandler<HTMLDivElement>;
  onInput: React.FormEventHandler<HTMLDivElement>;
  contentEditable: boolean;
  tabIndex: number;
}
