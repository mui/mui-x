import useEventCallback from '@mui/utils/useEventCallback';
import { PickerAnyAccessibleValueManagerV8 } from '../../../models';
import {
  UseFieldAccessibleDOMGetters,
  UseFieldDOMInteractions,
  UseFieldForwardedProps,
  UseFieldInternalPropsFromManager,
} from './useField.types';
import { UseFieldStateReturnValue } from './useFieldState';
import { UseFieldCharacterEditingReturnValue } from './useFieldCharacterEditing';
import { getActiveElement } from '../../utils/utils';
import { useFieldHandleKeyDown } from './useFieldHandleKeyDown';

export const useFieldAccessibleContainerProps = <
  TManager extends PickerAnyAccessibleValueManagerV8,
>(
  parameters: UseFieldAccessibleContainerPropsParameters<TManager>,
) => {
  const {
    stateResponse,
    stateResponse: {
      state,
      setSelectedSections,
      parsedSelectedSections,
      clearValue,
      updateValueFromValueStr,
    },
    characterEditingResponse,
    characterEditingResponse: { applyCharacterEditing, resetCharacterQuery },
    forwardedProps,
    forwardedProps: { onClick, onPaste, onBlur, onFocus, onInput },
    internalPropsWithDefaults,
    internalPropsWithDefaults: { readOnly = false },
    valueManager,
    interactions,
    focused,
    setFocused,
    domGetters,
  } = parameters;

  const handleContainerClick = useEventCallback((event: React.MouseEvent, ...args) => {
    // The click event on the clear button would propagate to the input, trigger this handler and result in a wrong section selection.
    // We avoid this by checking if the call of `handleContainerClick` is actually intended, or a side effect.
    if (event.isDefaultPrevented()) {
      return;
    }

    setFocused(true);
    onClick?.(event, ...(args as []));

    if (parsedSelectedSections === 'all') {
      setTimeout(() => {
        const cursorPosition = document.getSelection()!.getRangeAt(0).startOffset;

        if (cursorPosition === 0) {
          setSelectedSections(0);
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
      setSelectedSections(0);
    } else {
      const hasClickedOnASection = domGetters.getRoot().contains(event.target as Node);

      if (!hasClickedOnASection) {
        setSelectedSections(0);
      }
    }
  });

  const handleContainerInput = useEventCallback((event: React.FormEvent) => {
    onInput?.(event);

    if (parsedSelectedSections !== 'all') {
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
    interactions.syncSelectionToDOM();

    if (keyPressed.length === 0 || keyPressed.charCodeAt(0) === 10) {
      resetCharacterQuery();
      clearValue();
      setSelectedSections('all');
    } else if (keyPressed.length > 1) {
      updateValueFromValueStr(keyPressed);
    } else {
      applyCharacterEditing({
        keyPressed,
        sectionIndex: 0,
      });
    }
  });

  const handleContainerPaste = useEventCallback((event: React.ClipboardEvent) => {
    onPaste?.(event);
    if (readOnly || parsedSelectedSections !== 'all') {
      event.preventDefault();
      return;
    }

    const pastedValue = event.clipboardData.getData('text');
    event.preventDefault();
    resetCharacterQuery();
    updateValueFromValueStr(pastedValue);
  });

  const handleContainerFocus = useEventCallback((event: React.FocusEvent) => {
    onFocus?.(event);

    if (focused) {
      return;
    }

    setFocused(true);

    const isFocusInsideASection =
      domGetters.getSectionIndexFromDOMElement(getActiveElement(document)) != null;
    if (!isFocusInsideASection) {
      setSelectedSections(0);
    }
  });

  const handleContainerBlur = useEventCallback((event: React.FocusEvent) => {
    onBlur?.(event);
    setTimeout(() => {
      const activeElement = getActiveElement(document);
      const shouldBlur = !domGetters.getRoot().contains(activeElement);
      if (shouldBlur) {
        setFocused(false);
        setSelectedSections(null);
      }
    });
  });

  const handleContainerKeyDown = useFieldHandleKeyDown({
    valueManager,
    internalPropsWithDefaults,
    forwardedProps,
    stateResponse,
    characterEditingResponse,
  });

  return {
    // Event handlers
    onKeyDown: handleContainerKeyDown,
    onBlur: handleContainerBlur,
    onClick: handleContainerClick,
    onFocus: handleContainerFocus,
    onInput: handleContainerInput,
    onPaste: handleContainerPaste,

    // Other
    contentEditable: parsedSelectedSections === 'all',
    // TODO v7: Try to set to undefined when there is a section selected.
    tabIndex: parsedSelectedSections === 0 ? -1 : 0,
  };
};

interface UseFieldAccessibleContainerPropsParameters<
  TManager extends PickerAnyAccessibleValueManagerV8,
> {
  valueManager: TManager;
  forwardedProps: UseFieldForwardedProps<true>;
  internalPropsWithDefaults: UseFieldInternalPropsFromManager<TManager> & {
    minutesStep?: number;
  };
  stateResponse: UseFieldStateReturnValue<TManager>;
  characterEditingResponse: UseFieldCharacterEditingReturnValue;
  interactions: UseFieldDOMInteractions;
  focused: boolean;
  setFocused: (focused: boolean) => void;
  domGetters: UseFieldAccessibleDOMGetters;
}
