'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { CalendarDayGridBodyContext } from '../../utils/base-calendar/day-grid-body/CalendarDayGridBodyContext';
import { useBaseCalendarDayGridBody } from '../../utils/base-calendar/day-grid-body/useBaseCalendarDayGridBody';
import { CompositeList } from '../../composite/list/CompositeList';

const CalendarDayGridBody = React.forwardRef(function CalendarDayGrid(
  componentProps: CalendarDayGridBody.Props,
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
    ...elementProps
  } = componentProps;

  const { getDayGridBodyProps, rowsRefs, context, scrollerRef } = useBaseCalendarDayGridBody({
    children,
    fixedWeekNumber,
    focusOnMount,
    offset,
    freezeMonth,
  });

  const state = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, scrollerRef],
    props: [getDayGridBodyProps, elementProps],
  });

  return (
    <CalendarDayGridBodyContext.Provider value={context}>
      <CompositeList elementsRef={rowsRefs}>{renderElement()}</CompositeList>
    </CalendarDayGridBodyContext.Provider>
  );
});

export namespace CalendarDayGridBody {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarDayGridBody.Parameters {}
}

export { CalendarDayGridBody };
