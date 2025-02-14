'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarMonthList } from '@mui/x-date-pickers/internals/base/utils/base-calendar/month-list/useBaseCalendarMonthList';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { CompositeList } from '@mui/x-date-pickers/internals/base/composite/list/CompositeList';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarMonthCollectionContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/utils/BaseCalendarMonthCollectionContext';

const RangeCalendarMonthList = React.forwardRef(function RangeCalendarMonthList(
  props: RangeCalendarMonthList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    getItems,
    focusOnMount,
    loop,
    canChangeYear,
    ...otherProps
  } = props;
  const { getMonthListProps, cellRefs, monthsListOrGridContext, scrollerRef } =
    useBaseCalendarMonthList({
      children,
      getItems,
      focusOnMount,
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
    <BaseCalendarMonthCollectionContext.Provider value={monthsListOrGridContext}>
      <CompositeList elementsRef={cellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarMonthCollectionContext.Provider>
  );
});

export namespace RangeCalendarMonthList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarMonthList.Parameters {}
}

export { RangeCalendarMonthList };
