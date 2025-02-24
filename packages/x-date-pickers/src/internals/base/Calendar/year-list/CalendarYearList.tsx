'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { useBaseCalendarYearList } from '../../utils/base-calendar/year-list/useBaseCalendarYearList';
import { BaseCalendarYearCollectionContext } from '../../utils/base-calendar/utils/BaseCalendarYearCollectionContext';

const CalendarYearList = React.forwardRef(function CalendarYearList(
  props: CalendarYearList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, getItems, focusOnMount, loop, ...otherProps } = props;
  const { getYearListProps, cellRefs, yearsListOrGridContext, scrollerRef } =
    useBaseCalendarYearList({
      children,
      getItems,
      focusOnMount,
      loop,
    });
  const state = React.useMemo(() => ({}), []);
  const ref = useForkRef(forwardedRef, scrollerRef);

  const { renderElement } = useComponentRenderer({
    propGetter: getYearListProps,
    render: render ?? 'div',
    ref,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarYearCollectionContext.Provider value={yearsListOrGridContext}>
      <CompositeList elementsRef={cellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarYearCollectionContext.Provider>
  );
});

namespace CalendarYearList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarYearList.Parameters {}
}

export { CalendarYearList };
