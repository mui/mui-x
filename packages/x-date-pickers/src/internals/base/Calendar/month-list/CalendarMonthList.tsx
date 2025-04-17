'use client';
import * as React from 'react';
import { useCalendarMonthList } from './useCalendarMonthList';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { CompositeList } from '../../composite/list/CompositeList';
import { BaseCalendarMonthCollectionContext } from '../../utils/base-calendar/utils/BaseCalendarMonthCollectionContext';

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
    loop,
    canChangeYear,
    ...elementProps
  } = componentProps;

  const { getMonthListProps, cellRefs, monthsListOrGridContext, scrollerRef } =
    useCalendarMonthList({
      children,
      getItems,
      focusOnMount,
      loop,
      canChangeYear,
    });

  const state = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, scrollerRef],
    props: [getMonthListProps, elementProps],
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
      useCalendarMonthList.Parameters {}
}

export { CalendarMonthList };
