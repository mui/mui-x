'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { CompositeList } from '../../base-utils/composite/list/CompositeList';
import { BaseCalendarMonthCollectionContext } from '../../utils/base-calendar/utils/BaseCalendarMonthCollectionContext';
import {
  applyInitialFocusInList,
  navigateInList,
  NavigateInListChangePage,
  PageListNavigationTarget,
} from '../../utils/base-calendar/utils/keyboardNavigation';
import { useMonthCells } from '../utils/useMonthCells';
import { useBaseCalendarRootVisibleDateContext } from '../../utils/base-calendar/root/BaseCalendarRootVisibleDateContext';

const CalendarMonthList = React.forwardRef(function CalendarMonthList(
  componentProps: CalendarMonthList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    getItems,
    focusOnMount,
    loop = false,
    canChangeYear,
    ...elementProps
  } = componentProps;

  const baseRootVisibleDateContext = useBaseCalendarRootVisibleDateContext();
  const cellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { resolvedChildren, monthsListOrGridContext, changePage, ref } = useMonthCells({
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

  const props = React.useMemo(
    () => ({
      role: 'radiogroup',
      children: resolvedChildren,
      onKeyDown,
    }),
    [resolvedChildren, onKeyDown],
  );

  const state = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref],
    props: [props, elementProps],
  });

  return (
    <BaseCalendarMonthCollectionContext.Provider value={monthsListOrGridContext}>
      <CompositeList elementsRef={cellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarMonthCollectionContext.Provider>
  );
});

export namespace CalendarMonthList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useMonthCells.Parameters {
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
}

export { CalendarMonthList };
