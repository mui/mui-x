import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { UseFieldStateReturnValue } from './useFieldState';

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
      // Methods to update the states
      setSelectedSections,
    },
  } = parameters;

  const createHandleClick = useEventCallback(
    (sectionIndex: number) => (event: React.MouseEvent<HTMLDivElement>) => {
      // The click event on the clear button would propagate to the input, trigger this handler and result in a wrong section selection.
      // We avoid this by checking if the call to this function is actually intended, or a side effect.
      if (event.isDefaultPrevented()) {
        return;
      }

      setSelectedSections(sectionIndex);
    },
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
}

type UseFieldSectionContainerPropsReturnValue = (
  sectionIndex: number,
) => React.HTMLAttributes<HTMLSpanElement>;
