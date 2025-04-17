'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { CompositeList } from '../../composite/list/CompositeList';
import { useCalendarYearList } from './useCalendarYearList';
import { BaseCalendarYearCollectionContext } from '../../utils/base-calendar/utils/BaseCalendarYearCollectionContext';

const CalendarYearList = React.forwardRef(function CalendarYearList(
  componentProps: CalendarYearList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, getItems, focusOnMount, loop, ...elementProps } =
    componentProps;
  const { getYearListProps, cellRefs, yearsListOrGridContext, scrollerRef } = useCalendarYearList({
    children,
    getItems,
    focusOnMount,
    loop,
  });
  const state = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, scrollerRef],
    props: [getYearListProps, elementProps],
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
      useCalendarYearList.Parameters {}
}

export { CalendarYearList };
