import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import { PickerValidDate } from '../../../../../models';
import { GenericHTMLProps } from '../../../base-utils/types';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import {
  applyInitialFocusInList,
  navigateInList,
  NavigateInListChangePage,
  PageListNavigationTarget,
} from '../utils/keyboardNavigation';
import { useMonthsCells } from '../utils/useMonthsCells';

export function useBaseCalendarMonthsList(parameters: useBaseCalendarMonthsList.Parameters) {
  const { children, loop = true, canChangeYear = true } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const monthsCellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { months, monthsListOrGridContext, changePage } = useMonthsCells();
  const pageNavigationTargetRef = React.useRef<PageListNavigationTarget | null>(null);

  const timeout = useTimeout();
  React.useEffect(() => {
    if (pageNavigationTargetRef.current) {
      const target = pageNavigationTargetRef.current;
      timeout.start(0, () => {
        applyInitialFocusInList({ cells: monthsCellRefs.current, target });
      });
    }
  }, [baseRootContext.visibleDate, timeout]);

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    const changeListPage: NavigateInListChangePage = (params) => {
      changePage(params.direction);

      pageNavigationTargetRef.current = params.target;
    };

    navigateInList({
      cells: monthsCellRefs.current,
      event,
      loop,
      changePage: canChangeYear ? changeListPage : undefined,
    });
  });

  const getMonthListProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'radiogroup',
        children: children == null ? null : children({ months }),
        onKeyDown,
      });
    },
    [months, children, onKeyDown],
  );

  return React.useMemo(
    () => ({ getMonthListProps, monthsCellRefs, monthsListOrGridContext }),
    [getMonthListProps, monthsCellRefs, monthsListOrGridContext],
  );
}

export namespace useBaseCalendarMonthsList {
  export interface Parameters {
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
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    months: PickerValidDate[];
  }
}
