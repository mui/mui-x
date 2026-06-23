import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
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

  // A single stable handler shared by every section, rather than a per-index
  // factory. The section index is read from the container's `data-sectionindex`
  // at click time, and `useEventCallback` reads the latest `disabled` /
  // `parsedSelectedSections` / `setSelectedSections` internally -- so none of
  // them sit in a dependency array and the `onClick` identity stays stable
  // across renders (`setSelectedSections` is recreated on every render, which
  // would otherwise churn the handler).
  const handleClick = useEventCallback((event: React.MouseEvent<HTMLDivElement>) => {
    // The click event on the clear button would propagate to the input, trigger this handler and result in a wrong section selection.
    // We avoid this by checking if the call to this function is actually intended, or a side effect.
    if (disabled || event.isDefaultPrevented()) {
      return;
    }

    // `currentTarget` is the section container, which always carries
    // `data-sectionindex` (set below). Guard the parse defensively all the
    // same -- `Number(undefined)` is `NaN`, and `NaN === parsedSelectedSections`
    // is always false, so it would otherwise reach `setSelectedSections(NaN)`.
    const sectionIndex = Number(event.currentTarget.dataset.sectionindex);
    if (!Number.isInteger(sectionIndex)) {
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
  internalPropsWithDefaults: UseFieldInternalProps<any, any>;
}

type UseFieldSectionContainerPropsReturnValue = (
  sectionIndex: number,
) => React.HTMLAttributes<HTMLSpanElement>;
