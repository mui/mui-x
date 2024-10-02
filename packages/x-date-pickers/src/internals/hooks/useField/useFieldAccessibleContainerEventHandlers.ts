import useEventCallback from '@mui/utils/useEventCallback';
import { FieldSection, PickerValidDate } from '../../../models';
import {
  FieldValueManager,
  UseFieldAccessibleDOMGetters,
  UseFieldDOMInteractions,
  UseFieldForwardedProps,
  UseFieldInternalProps,
} from './useField.types';
import { UseFieldStateResponse } from './useFieldState';
import { UseFieldCharacterEditingReturnValue } from './useFieldCharacterEditing';
import { getActiveElement } from '../../utils/utils';
import { useFieldHandleKeyDown } from './useFieldHandleKeyDown';

export const useFieldAccessibleContainerEventHandlers = <
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
>(
  parameters: UseFieldAccessibleContainerEventHandlersParameters<TValue, TDate, TSection>,
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
    internalProps,
    internalProps: { readOnly = false },
    fieldValueManager,
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

  const handleContainerInput = useEventCallback((event: React.FormEvent<HTMLDivElement>) => {
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

  const handleContainerPaste = useEventCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
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

  const handleContainerFocus = useEventCallback((...args) => {
    onFocus?.(...(args as []));

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

  const handleContainerBlur = useEventCallback((...args) => {
    onBlur?.(...(args as []));
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
    fieldValueManager,
    internalProps,
    forwardedProps,
    stateResponse,
    characterEditingResponse,
  });

  return {
    onKeyDown: handleContainerKeyDown,
    onBlur: handleContainerBlur,
    onClick: handleContainerClick,
    onFocus: handleContainerFocus,
    onInput: handleContainerInput,
    onPaste: handleContainerPaste,
  };
};

interface UseFieldAccessibleContainerEventHandlersParameters<
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
> {
  fieldValueManager: FieldValueManager<TValue, TDate, TSection>;
  forwardedProps: UseFieldForwardedProps<true>;
  internalProps: UseFieldInternalProps<TValue, TDate, TSection, true, any> & {
    minutesStep?: number;
  };
  stateResponse: UseFieldStateResponse<TValue, TDate, TSection>;
  characterEditingResponse: UseFieldCharacterEditingReturnValue;
  interactions: UseFieldDOMInteractions;
  focused: boolean;
  setFocused: (focused: boolean) => void;
  domGetters: UseFieldAccessibleDOMGetters;
}
