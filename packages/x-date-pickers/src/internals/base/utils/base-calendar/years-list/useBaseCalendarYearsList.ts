import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../../models';
import { GenericHTMLProps } from '../../../base-utils/types';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';
import { navigateInList } from '../utils/keyboardNavigation';
import { useYearsCells } from '../utils/useYearsCells';

export function useBaseCalendarYearsList(parameters: useBaseCalendarYearsList.Parameters) {
  const { children, loop = true } = parameters;
  const cellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { years, yearsListOrGridContext, scrollerRef } = useYearsCells();

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    navigateInList({
      cells: cellRefs.current,
      event,
      loop,
      changePage: undefined,
    });
  });

  const getYearsListProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'radiogroup',
        children: children == null ? null : children({ years }),
        onKeyDown,
      });
    },
    [years, children, onKeyDown],
  );

  return React.useMemo(
    () => ({ getYearsListProps, cellRefs, yearsListOrGridContext, scrollerRef }),
    [getYearsListProps, cellRefs, yearsListOrGridContext, scrollerRef],
  );
}

export namespace useBaseCalendarYearsList {
  export interface Parameters {
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loop?: boolean;
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    years: PickerValidDate[];
  }
}
