'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { CompositeList } from '../../base-utils/composite/list/CompositeList';
import { BaseCalendarYearCollectionContext } from '../../utils/base-calendar/utils/BaseCalendarYearCollectionContext';
import { useYearCells } from '../utils/useYearCells';
import { navigateInList } from '../../Clock/utils/keyboardNavigation';

const CalendarYearList = React.forwardRef(function CalendarYearList(
  componentProps: CalendarYearList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    getItems,
    focusOnMount,
    loop = false,
    ...elementProps
  } = componentProps;

  const cellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { resolvedChildren, yearsListOrGridContext, ref } = useYearCells({
    getItems,
    focusOnMount,
    children,
  });

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    navigateInList({
      cells: cellRefs.current,
      event,
      loop,
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
    <BaseCalendarYearCollectionContext.Provider value={yearsListOrGridContext}>
      <CompositeList elementsRef={cellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarYearCollectionContext.Provider>
  );
});

export namespace CalendarYearList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useYearCells.Parameters {
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loop?: boolean;
  }
}

export { CalendarYearList };
