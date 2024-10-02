import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import {
  UseFieldDOMInteractions,
  UseFieldForwardedProps,
  UseFieldInternalProps,
} from './useField.types';
import { FieldSection, PickerValidDate } from '../../../models';
import { UseFieldStateResponse } from './useFieldState';
import { getActiveElement } from '../../utils/utils';
import { parseSelectedSections } from './useField.utils';
import { PickersSectionListRef } from '../../../PickersSectionList';

export const useFieldAccessibleDOMInteractions = <
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
>(
  parameters: UseFieldAccessibleDOMInteractionsParameters<TValue, TDate, TSection>,
) => {
  const {
    forwardedProps: { sectionListRef: sectionListRefProp },
    internalProps: { unstableFieldRef },
    stateResponse: { state, parsedSelectedSections, setSelectedSections },
    focused,
    setFocused,
  } = parameters;

  // TODO: Add methods to parameters to access those elements instead of using refs
  const sectionListRef = React.useRef<PickersSectionListRef>(null);
  const handleSectionListRef = useForkRef(sectionListRefProp, sectionListRef);

  const interactions: UseFieldDOMInteractions = {
    syncSelectionToDOM: () => {
      if (!sectionListRef.current) {
        return;
      }

      const selection = document.getSelection();
      if (!selection) {
        return;
      }

      if (parsedSelectedSections == null) {
        // If the selection contains an element inside the field, we reset it.
        if (
          selection.rangeCount > 0 &&
          sectionListRef.current.getRoot().contains(selection.getRangeAt(0).startContainer)
        ) {
          selection.removeAllRanges();
        }

        if (focused) {
          sectionListRef.current.getRoot().blur();
        }
        return;
      }

      // On multi input range pickers we want to update selection range only for the active input
      if (!sectionListRef.current.getRoot().contains(getActiveElement(document))) {
        return;
      }

      const range = new window.Range();

      let target: HTMLElement;
      if (parsedSelectedSections === 'all') {
        target = sectionListRef.current.getRoot();
      } else {
        const section = state.sections[parsedSelectedSections];
        if (section.type === 'empty') {
          target = sectionListRef.current.getSectionContainer(parsedSelectedSections);
        } else {
          target = sectionListRef.current.getSectionContent(parsedSelectedSections);
        }
      }

      range.selectNodeContents(target);
      target.focus();
      selection.removeAllRanges();
      selection.addRange(range);
    },
    getActiveSectionIndexFromDOM: () => {
      const activeElement = getActiveElement(document) as HTMLElement | undefined;
      if (
        !activeElement ||
        !sectionListRef.current ||
        !sectionListRef.current.getRoot().contains(activeElement)
      ) {
        return null;
      }

      return sectionListRef.current.getSectionIndexFromDOMElement(activeElement);
    },
    focusField: (newSelectedSections = 0) => {
      if (!sectionListRef.current) {
        return;
      }

      const newParsedSelectedSections = parseSelectedSections(
        newSelectedSections,
        state.sections,
      ) as number;

      setFocused(true);
      sectionListRef.current.getSectionContent(newParsedSelectedSections).focus();
    },
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
    isFieldFocused: () => {
      const activeElement = getActiveElement(document);
      return !!sectionListRef.current && sectionListRef.current.getRoot().contains(activeElement);
    },
  };

  React.useImperativeHandle(unstableFieldRef, () => ({
    getSections: () => state.sections,
    getActiveSectionIndex: interactions.getActiveSectionIndexFromDOM,
    setSelectedSections: interactions.setSelectedSections,
    focusField: interactions.focusField,
    isFieldFocused: interactions.isFieldFocused,
  }));

  return { sectionListRef, handleSectionListRef, interactions };
};

interface UseFieldAccessibleDOMInteractionsParameters<
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
> {
  forwardedProps: UseFieldForwardedProps<true>;
  internalProps: UseFieldInternalProps<TValue, TDate, TSection, true, unknown>;
  stateResponse: UseFieldStateResponse<TValue, TDate, TSection>;
  focused: boolean;
  setFocused: (focused: boolean) => void;
}
