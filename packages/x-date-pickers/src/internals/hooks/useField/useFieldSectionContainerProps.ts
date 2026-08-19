import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { UseFieldStateReturnValue } from './useFieldState';
import { UseFieldInternalProps } from './useField.types';

/**
 * Generate the props to pass to the container element of each section of the field.
 * It is not used by the non-accessible DOM structure (with an <input /> element for editing).
 * It should be used in the MUI accessible DOM structure and the Base UI implementation.
 * @param {UseFieldRootPropsParameters} parameters The parameters of the hook.
 * @returns {UseFieldRootPropsReturnValue} The props to forward to the container element of each section of the field.
 */
export function useFieldSectionContainerProps(
  parameters: UseFieldSectionContainerPropsParameters,
): UseFieldSectionContainerPropsReturnValue {
  const {
    stateResponse: {
      // States and derived states
      parsedSelectedSections,
      // Methods to update the states
      setSelectedSections,
    },
    internalPropsWithDefaults: { disabled = false },
  } = parameters;

  // A single stable handler shared by every section, rather than a per-index
  // factory. The section index is read from the container's `data-sectionindex`
  // at click time.
  const handleClick = useEventCallback((event: React.MouseEvent<HTMLDivElement>) => {
    // The click event on the clear button would propagate to the input, trigger this handler and result in a wrong section selection.
    // We avoid this by checking if the call to this function is actually intended, or a side effect.
    if (disabled || event.isDefaultPrevented()) {
      return;
    }

    const sectionIndex = Number(event.currentTarget.dataset.sectionindex);
    if (!Number.isInteger(sectionIndex)) {
      return;
    }

    // For pointer input the `mousedown` handler already selected the section
    // before this click bubbles, so bail to avoid a redundant
    // `onSelectedSectionsChange` invocation.
    if (parsedSelectedSections === sectionIndex) {
      return;
    }

    setSelectedSections(sectionIndex);
  });

  return React.useCallback(
    (sectionIndex) => ({
      'data-sectionindex': sectionIndex,
      onClick: handleClick,
    }),
    [handleClick],
  );
}

interface UseFieldSectionContainerPropsParameters {
  stateResponse: UseFieldStateReturnValue<any>;
  internalPropsWithDefaults: UseFieldInternalProps<any, any, any>;
}

type UseFieldSectionContainerPropsReturnValue = (
  sectionIndex: number,
) => React.HTMLAttributes<HTMLSpanElement>;
