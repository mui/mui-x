'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useBaseCalendarMonthList } from '../../utils/base-calendar/month-list/useBaseCalendarMonthList';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { BaseCalendarMonthCollectionContext } from '../../utils/base-calendar/utils/BaseCalendarMonthCollectionContext';

const CalendarMonthList = React.forwardRef(function CalendarMonthList(
  props: CalendarMonthList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    getItems,
    focusOnMount,
    loop,
    canChangeYear,
    ...otherProps
  } = props;
  const { getMonthListProps, cellRefs, monthsListOrGridContext, scrollerRef } =
    useBaseCalendarMonthList({
      children,
      getItems,
      focusOnMount,
      loop,
      canChangeYear,
    });
  const state = React.useMemo(() => ({}), []);
  const ref = useForkRef(forwardedRef, scrollerRef);

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthListProps,
    render: render ?? 'div',
    ref,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarMonthCollectionContext.Provider value={monthsListOrGridContext}>
      <CompositeList elementsRef={cellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarMonthCollectionContext.Provider>
  );
});

namespace CalendarMonthList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarMonthList.Parameters {}
}

export { CalendarMonthList };
