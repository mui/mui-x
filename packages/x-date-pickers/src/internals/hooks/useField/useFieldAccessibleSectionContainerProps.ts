import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerAnyAccessibleValueManagerV8 } from '../../../models';
import { UseFieldStateReturnValue } from './useFieldState';

export const useFieldAccessibleSectionContainerProps = <
  TManager extends PickerAnyAccessibleValueManagerV8,
>(
  parameters: UseFieldAccessibleSectionContainerPropsParameters<TManager>,
) => {
  const {
    stateResponse: { setSelectedSections },
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
    (sectionIndex: number) => {
      return {
        'data-sectionindex': sectionIndex,
        onClick: createHandleClick(sectionIndex),
      } as React.HTMLAttributes<HTMLSpanElement>;
    },
    [createHandleClick],
  );
};

interface UseFieldAccessibleSectionContainerPropsParameters<
  TManager extends PickerAnyAccessibleValueManagerV8,
> {
  stateResponse: UseFieldStateReturnValue<TManager>;
}
