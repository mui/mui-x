import * as React from 'react';
import { UseFieldStateReturnValue } from './useFieldState';
import { UseFieldInternalProps } from './useField.types';

/**
 * Generate the props to pass to the container element of each section of the field.
 * @param {UseFieldSectionContainerPropsParameters} parameters The parameters of the hook.
 * @returns {UseFieldSectionContainerPropsReturnValue} The props to forward to the container element of each section of the field.
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

  const createHandleClick = React.useCallback(
    (sectionIndex: number) => (event: React.MouseEvent<HTMLDivElement>) => {
      // The click event on the clear button would propagate to the input, trigger this handler and result in a wrong section selection.
      // We avoid this by checking if the call to this function is actually intended, or a side effect.
      if (disabled || event.isDefaultPrevented()) {
        return;
      }

      // For pointer input the `mousedown` handler already selected the section
      // before this click bubbles, so bail to avoid a redundant
      // `onSelectedSectionsChange` invocation. On the non-pointer paths
      // (programmatic `element.click()`, some AT activations) `mousedown`
      // didn't run, so `parsedSelectedSections` won't match yet and selection
      // proceeds normally.
      if (parsedSelectedSections === sectionIndex) {
        return;
      }

      setSelectedSections(sectionIndex);
    },
    [disabled, parsedSelectedSections, setSelectedSections],
  );
  return React.useCallback(
    (sectionIndex) => ({
      'data-sectionindex': sectionIndex,
      onClick: createHandleClick(sectionIndex),
    }),
    [createHandleClick],
  );
}

interface UseFieldSectionContainerPropsParameters {
  stateResponse: UseFieldStateReturnValue<any>;
  internalPropsWithDefaults: UseFieldInternalProps<any, any>;
}

type UseFieldSectionContainerPropsReturnValue = (
  sectionIndex: number,
) => React.HTMLAttributes<HTMLSpanElement>;
