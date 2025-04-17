import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import {
  applyInitialFocusInList,
  navigateInList,
  NavigateInListChangePage,
  PageListNavigationTarget,
} from '../../utils/base-calendar/utils/keyboardNavigation';
import { useMonthCells } from '../utils/useMonthCells';
import { useBaseCalendarRootVisibleDateContext } from '../../utils/base-calendar/root/BaseCalendarRootVisibleDateContext';

export function useCalendarMonthList(parameters: useCalendarMonthList.Parameters) {
  const { children, getItems, focusOnMount, loop = true, canChangeYear = true } = parameters;
  const baseRootVisibleDateContext = useBaseCalendarRootVisibleDateContext();
  const cellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { resolvedChildren, monthsListOrGridContext, changePage, scrollerRef } = useMonthCells({
    getItems,
    focusOnMount,
    children,
  });
  const pageNavigationTargetRef = React.useRef<PageListNavigationTarget | null>(null);

  const timeout = useTimeout();
  React.useEffect(() => {
    if (pageNavigationTargetRef.current) {
      const target = pageNavigationTargetRef.current;
      timeout.start(0, () => {
        applyInitialFocusInList({ cells: cellRefs.current, target });
      });
    }
  }, [baseRootVisibleDateContext.visibleDate, timeout]);

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    const changeListPage: NavigateInListChangePage = (params) => {
      changePage(params.direction);

      pageNavigationTargetRef.current = params.target;
    };

    navigateInList({
      cells: cellRefs.current,
      event,
      loop,
      changePage: canChangeYear ? changeListPage : undefined,
    });
  });

  const getMonthListProps = React.useCallback(
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
    () => ({ getMonthListProps, cellRefs, monthsListOrGridContext, scrollerRef }),
    [getMonthListProps, cellRefs, monthsListOrGridContext, scrollerRef],
  );
}

export namespace useCalendarMonthList {
  export interface Parameters extends useMonthCells.Parameters {
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * It is ignored when the `canChangeYear` prop is true.
     * @default true
     */
    loop?: boolean;
    /**
     * Whether to go to the previous / next year
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    canChangeYear?: boolean;
  }

  export interface ChildrenParameters {
    months: PickerValidDate[];
  }
}
