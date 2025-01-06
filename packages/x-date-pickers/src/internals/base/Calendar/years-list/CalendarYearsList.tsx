'use client';
import * as React from 'react';
import { useCalendarYearsList } from './useCalendarYearsList';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { CalendarYearsCellCollectionContext } from '../utils/years-cell-collection/CalendarYearsCellCollectionContext';

const CalendarYearsList = React.forwardRef(function CalendarYearsList(
  props: CalendarYearsList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, loop, ...otherProps } = props;
  const { getYearsListProps, context, yearsCellRefs } = useCalendarYearsList({
    children,
    loop,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getYearsListProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <CalendarYearsCellCollectionContext.Provider value={context}>
      <CompositeList elementsRef={yearsCellRefs}>{renderElement()}</CompositeList>
    </CalendarYearsCellCollectionContext.Provider>
  );
});

export namespace CalendarYearsList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarYearsList.Parameters {}
}

export { CalendarYearsList };
