import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { FieldSection, PickerValidDate } from '../../../models';
import { UseFieldStateResponse } from './useFieldState';

export const useFieldAccessibleSectionContainerProps = <
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
>(
  parameters: UseFieldAccessibleSectionContainerPropsParameters<TValue, TDate, TSection>,
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
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
> {
  stateResponse: UseFieldStateResponse<TValue, TDate, TSection>;
}
