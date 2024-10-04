import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  UseFieldAccessibleDOMGetters,
  UseFieldDOMInteractions,
  UseFieldForwardedProps,
  UseFieldInternalPropsFromManager,
} from './useField.types';
import { PickerAnyAccessibleValueManagerV8 } from '../../../models';
import { UseFieldStateReturnValue } from './useFieldState';
import { getActiveElement } from '../../utils/utils';
import { parseSelectedSections } from './useField.utils';

export const useFieldAccessibleDOMInteractions = <
  TManager extends PickerAnyAccessibleValueManagerV8,
>(
  parameters: UseFieldAccessibleDOMInteractionsParameters<TManager>,
) => {
  const {
    internalPropsWithDefaults: { unstableFieldRef },
    forwardedProps: { autoFocus },
    stateResponse: { state, parsedSelectedSections, setSelectedSections },
    focused,
    setFocused,
    domGetters,
  } = parameters;

  const interactions: UseFieldDOMInteractions = {
    syncSelectionToDOM: () => {
      const selection = document.getSelection();
      if (!selection) {
        return;
      }

      if (parsedSelectedSections == null) {
        // If the selection contains an element inside the field, we reset it.
        if (
          selection.rangeCount > 0 &&
          domGetters.getRoot().contains(selection.getRangeAt(0).startContainer)
        ) {
          selection.removeAllRanges();
        }

        if (focused) {
          domGetters.getRoot().blur();
        }
        return;
      }

      // On multi input range pickers we want to update selection range only for the active input
      if (!domGetters.getRoot().contains(getActiveElement(document))) {
        return;
      }

      const range = new window.Range();

      let target: HTMLElement;
      if (parsedSelectedSections === 'all') {
        target = domGetters.getRoot();
      } else {
        const section = state.sections[parsedSelectedSections];
        if (section.type === 'empty') {
          target = domGetters.getSectionContainer(parsedSelectedSections);
        } else {
          target = domGetters.getSectionContent(parsedSelectedSections);
        }
      }

      range.selectNodeContents(target);
      target.focus();
      selection.removeAllRanges();
      selection.addRange(range);
    },
    getActiveSectionIndexFromDOM: () => {
      const activeElement = getActiveElement(document) as HTMLElement | undefined;
      if (!activeElement || !domGetters.getRoot().contains(activeElement)) {
        return null;
      }

      return domGetters.getSectionIndexFromDOMElement(activeElement);
    },
    focusField: (newSelectedSections = 0) => {
      const newParsedSelectedSections = parseSelectedSections(
        newSelectedSections,
        state.sections,
      ) as number;

      setFocused(true);
      domGetters.getSectionContent(newParsedSelectedSections).focus();
    },
    setSelectedSections: (newSelectedSections) => {
      const newParsedSelectedSections = parseSelectedSections(newSelectedSections, state.sections);
      const newActiveSectionIndex =
        newParsedSelectedSections === 'all' ? 0 : newParsedSelectedSections;
      setFocused(newActiveSectionIndex !== null);
      setSelectedSections(newSelectedSections);
    },
    isFieldFocused: () => {
      const activeElement = getActiveElement(document);
      return domGetters.getRoot().contains(activeElement);
    },
  };

  React.useImperativeHandle(unstableFieldRef, () => ({
    getSections: () => state.sections as any,
    getActiveSectionIndex: interactions.getActiveSectionIndexFromDOM,
    setSelectedSections: interactions.setSelectedSections,
    focusField: interactions.focusField,
    isFieldFocused: interactions.isFieldFocused,
  }));

  useEnhancedEffect(() => {
    interactions.syncSelectionToDOM();
  });

  useEnhancedEffect(() => {
    if (!focused) {
      return;
    }

    if (parsedSelectedSections === 'all') {
      domGetters.getRoot().focus();
    } else if (typeof parsedSelectedSections === 'number') {
      const domElement = domGetters.getSectionContent(parsedSelectedSections);
      if (domElement) {
        domElement.focus();
      }
    }
  }, [parsedSelectedSections, focused, domGetters]);

  React.useEffect(() => {
    if (autoFocus) {
      domGetters.getSectionContent(0).focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return interactions;
};

interface UseFieldAccessibleDOMInteractionsParameters<
  TManager extends PickerAnyAccessibleValueManagerV8,
> {
  forwardedProps: UseFieldForwardedProps<true>;
  internalPropsWithDefaults: UseFieldInternalPropsFromManager<TManager>;
  stateResponse: UseFieldStateReturnValue<TManager>;
  focused: boolean;
  setFocused: (focused: boolean) => void;
  domGetters: UseFieldAccessibleDOMGetters;
}
