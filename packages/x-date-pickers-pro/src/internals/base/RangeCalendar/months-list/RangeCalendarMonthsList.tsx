'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarMonthsList } from '@mui/x-date-pickers/internals/base/utils/base-calendar/months-list/useBaseCalendarMonthsList';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { CompositeList } from '@mui/x-date-pickers/internals/base/composite/list/CompositeList';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarMonthsGridOrListContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/months-grid/BaseCalendarMonthsGridOrListContext';

const RangeCalendarMonthsList = React.forwardRef(function RangeCalendarMonthsList(
  props: RangeCalendarMonthsList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, loop, canChangeYear, ...otherProps } = props;
  const { getMonthListProps, cellRefs, monthsListOrGridContext, scrollerRef } =
    useBaseCalendarMonthsList({
      children,
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
    <BaseCalendarMonthsGridOrListContext.Provider value={monthsListOrGridContext}>
      <CompositeList elementsRef={cellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarMonthsGridOrListContext.Provider>
  );
});

export namespace RangeCalendarMonthsList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarMonthsList.Parameters {}
}

export { RangeCalendarMonthsList };
