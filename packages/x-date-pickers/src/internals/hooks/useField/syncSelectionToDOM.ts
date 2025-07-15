import { PickerValidValue } from '../../models';
import { getActiveElement } from '../../utils/utils';
import { UseFieldDOMGetters } from './useField.types';
import { UseFieldStateReturnValue } from './useFieldState';

export function syncSelectionToDOM<TValue extends PickerValidValue>(
  parameters: SyncSelectionToDOMParameters<TValue>,
) {
  const {
    focused,
    domGetters,
    stateResponse: {
      // States and derived states
      parsedSelectedSections,
      state,
    },
  } = parameters;

  if (!domGetters.isReady()) {
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
}

export interface SyncSelectionToDOMParameters<TValue extends PickerValidValue> {
  domGetters: UseFieldDOMGetters;
  stateResponse: UseFieldStateReturnValue<TValue>;
  focused: boolean;
}
