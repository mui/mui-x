'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { useBaseCalendarYearsList } from '../../utils/base-calendar/years-list/useBaseCalendarYearsList';
import { BaseCalendarYearsGridOrListContext } from '../../utils/base-calendar/years-grid/BaseCalendarYearsGridOrListContext';

const CalendarYearsList = React.forwardRef(function CalendarYearsList(
  props: CalendarYearsList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, loop, ...otherProps } = props;
  const { getYearsListProps, cellRefs, yearsListOrGridContext, scrollerRef } =
    useBaseCalendarYearsList({
      children,
      loop,
    });
  const state = React.useMemo(() => ({}), []);
  const ref = useForkRef(forwardedRef, scrollerRef);

  const { renderElement } = useComponentRenderer({
    propGetter: getYearsListProps,
    render: render ?? 'div',
    ref,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarYearsGridOrListContext.Provider value={yearsListOrGridContext}>
      <CompositeList elementsRef={cellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarYearsGridOrListContext.Provider>
  );
});

export namespace CalendarYearsList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarYearsList.Parameters {}
}

export { CalendarYearsList };
