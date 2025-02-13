'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { CompositeList } from '@mui/x-date-pickers/internals/base/composite/list/CompositeList';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarDaysGridBodyContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-grid-body/BaseCalendarDaysGridBodyContext';
import { useRangeCalendarDaysGridBody } from './useRangeCalendarDaysGridBody';

const RangeCalendarDaysGridBody = React.forwardRef(function CalendarDaysGrid(
  props: RangeCalendarDaysGridBody.Props,
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
  const { getDaysGridBodyProps, rowsRefs, context, scrollerRef } = useRangeCalendarDaysGridBody({
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

export namespace RangeCalendarDaysGridBody {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useRangeCalendarDaysGridBody.Parameters {}
}

export { RangeCalendarDaysGridBody };
