'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarYearList } from '@mui/x-date-pickers/internals/base/utils/base-calendar/year-list/useBaseCalendarYearList';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { CompositeList } from '@mui/x-date-pickers/internals/base/composite/list/CompositeList';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarYearGridOrListContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/year-grid/BaseCalendarYearGridOrListContext';

const RangeCalendarYearList = React.forwardRef(function CalendarYearList(
  props: CalendarYearList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, getItems, focusOnMount, loop, ...otherProps } = props;
  const { getYearListProps, cellRefs, yearsListOrGridContext, scrollerRef } =
    useBaseCalendarYearList({
      children,
      getItems,
      focusOnMount,
      loop,
    });
  const state = React.useMemo(() => ({}), []);
  const ref = useForkRef(forwardedRef, scrollerRef);

  const { renderElement } = useComponentRenderer({
    propGetter: getYearListProps,
    render: render ?? 'div',
    ref,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarYearGridOrListContext.Provider value={yearsListOrGridContext}>
      <CompositeList elementsRef={cellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarYearGridOrListContext.Provider>
  );
});

export namespace CalendarYearList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarYearList.Parameters {}
}

export { RangeCalendarYearList };
