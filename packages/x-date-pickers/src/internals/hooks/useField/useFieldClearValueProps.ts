import useEventCallback from '@mui/utils/useEventCallback';
import {
  SectionOrdering,
  UseFieldForwardedProps,
  UseFieldInternalPropsFromManager,
  UseFieldDOMInteractions,
} from './useField.types';
import { PickerAnyValueManagerV8, PickerManagerProperties } from '../../../models';
import { UseFieldStateReturnValue } from './useFieldState';
import { buildDefaultSectionOrdering } from './useField.utils';

export const useFieldClearValueProps = <TManager extends PickerAnyValueManagerV8>(
  parameters: UseFieldClearValuePropsParameters<TManager>,
) => {
  const {
    forwardedProps: { clearable: inClearable, onClear },
    internalPropsWithDefaults: { readOnly, disabled },
    stateResponse: { setSelectedSections, clearValue, state, areAllSectionsEmpty },
    interactions,
    sectionOrder = buildDefaultSectionOrdering(state.sections.length),
  } = parameters;

  const handleClear = useEventCallback((event: React.MouseEvent, ...args) => {
    event.preventDefault();
    onClear?.(event, ...(args as []));
    clearValue();

    if (!interactions.isFieldFocused()) {
      // setSelectedSections is called internally
      interactions.focusField(0);
    } else {
      setSelectedSections(sectionOrder.startIndex);
    }
  });

  const clearable = Boolean(inClearable && !areAllSectionsEmpty && !readOnly && !disabled);

  return {
    onClear: handleClear,
    clearable,
  };
};

interface UseFieldClearValuePropsParameters<TManager extends PickerAnyValueManagerV8> {
  forwardedProps: UseFieldForwardedProps<
    PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure']
  >;
  internalPropsWithDefaults: UseFieldInternalPropsFromManager<TManager>;
  stateResponse: UseFieldStateReturnValue<TManager>;
  interactions: UseFieldDOMInteractions;
  /**
   * Only define when used with the legacy DOM structure.
   * TODO v9: Remove
   */
  sectionOrder?: SectionOrdering;
}
