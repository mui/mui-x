'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseCalendarDayGridBodyContext } from '../../utils/base-calendar/day-grid-body/BaseCalendarDayGridBodyContext';
import { useBaseCalendarDayGridBody } from '../../utils/base-calendar/day-grid-body/useBaseCalendarDayGridBody';
import { CompositeList } from '../../composite/list/CompositeList';

const CalendarDayGridBody = React.forwardRef(function CalendarDayGrid(
  props: CalendarDayGridBody.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    fixedWeekNumber,
    focusOnMount,
    offset,
    freezeMonth,
    ...otherProps
  } = props;
  const { getDayGridBodyProps, rowsRefs, context, scrollerRef } = useBaseCalendarDayGridBody({
    children,
    fixedWeekNumber,
    focusOnMount,
    offset,
    freezeMonth,
  });
  const ref = useForkRef(scrollerRef, forwardedRef);
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDayGridBodyProps,
    render: render ?? 'div',
    ref,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarDayGridBodyContext.Provider value={context}>
      <CompositeList elementsRef={rowsRefs}>{renderElement()}</CompositeList>
    </BaseCalendarDayGridBodyContext.Provider>
  );
});

namespace CalendarDayGridBody {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarDayGridBody.Parameters {}
}

export { CalendarDayGridBody };
