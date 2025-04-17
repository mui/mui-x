'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useRenderElement } from '@mui/x-date-pickers/internals/base/base-utils/useRenderElement';
// eslint-disable-next-line no-restricted-imports
import { CompositeList } from '@mui/x-date-pickers/internals/base/composite/list/CompositeList';
// eslint-disable-next-line no-restricted-imports
import { CalendarDayGridBodyContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-grid-body/CalendarDayGridBodyContext';
import { useRangeCalendarDayGridBody } from './useRangeCalendarDayGridBody';

const RangeCalendarDayGridBody = React.forwardRef(function CalendarDayGrid(
  componentProps: RangeCalendarDayGridBody.Props,
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

  const { getDayGridBodyProps, rowsRefs, context, scrollerRef } = useRangeCalendarDayGridBody({
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

export namespace RangeCalendarDayGridBody {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useRangeCalendarDayGridBody.Parameters {}
}

export { RangeCalendarDayGridBody };
