import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { navigateInList } from '../../utils/base-calendar/utils/keyboardNavigation';
import { useYearCells } from '../utils/useYearCells';

export function useCalendarYearList(parameters: useCalendarYearList.Parameters) {
  const { children, getItems, focusOnMount, loop = true } = parameters;
  const cellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { resolvedChildren, yearsListOrGridContext, scrollerRef } = useYearCells({
    getItems,
    focusOnMount,
    children,
  });

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    navigateInList({
      cells: cellRefs.current,
      event,
      loop,
      changePage: undefined,
    });
  });

  const getYearListProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'radiogroup',
        children: resolvedChildren,
        onKeyDown,
      });
    },
    [resolvedChildren, onKeyDown],
  );

  return React.useMemo(
    () => ({ getYearListProps, cellRefs, yearsListOrGridContext, scrollerRef }),
    [getYearListProps, cellRefs, yearsListOrGridContext, scrollerRef],
  );
}

export namespace useCalendarYearList {
  export interface Parameters extends useYearCells.Parameters {
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loop?: boolean;
  }
}
