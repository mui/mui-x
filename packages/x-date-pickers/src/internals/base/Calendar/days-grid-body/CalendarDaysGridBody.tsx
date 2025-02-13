'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseCalendarDaysGridBodyContext } from '../../utils/base-calendar/days-grid-body/BaseCalendarDaysGridBodyContext';
import { useBaseCalendarDaysGridBody } from '../../utils/base-calendar/days-grid-body/useBaseCalendarDaysGridBody';
import { CompositeList } from '../../composite/list/CompositeList';

const CalendarDaysGridBody = React.forwardRef(function CalendarDaysGrid(
  props: CalendarDaysGridBody.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    fixedWeekNumber,
    focusOnMount,
    offset,
    freezeCurrentMonth,
    ...otherProps
  } = props;
  const { getDaysGridBodyProps, rowsRefs, context, scrollerRef } = useBaseCalendarDaysGridBody({
    children,
    fixedWeekNumber,
    focusOnMount,
    offset,
    freezeCurrentMonth,
  });
  const ref = useForkRef(scrollerRef, forwardedRef);
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysGridBodyProps,
    render: render ?? 'div',
    ref,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarDaysGridBodyContext.Provider value={context}>
      <CompositeList elementsRef={rowsRefs}>{renderElement()}</CompositeList>
    </BaseCalendarDaysGridBodyContext.Provider>
  );
});

export namespace CalendarDaysGridBody {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarDaysGridBody.Parameters {}
}

export { CalendarDaysGridBody };
