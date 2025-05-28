'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { CalendarDayGridRowContext } from './CalendarDayGridRowContext';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { PickerValidDate } from '../../../../models';
import { useCalendarDayGridBodyContext } from '../../utils/base-calendar/day-grid-body/CalendarDayGridBodyContext';
import { useCompositeListItem } from '../../base-utils/composite/list/useCompositeListItem';

const InnerCalendarDayGridRow = React.forwardRef(function InnerCalendarDayGridRow(
  componentProps: InnerCalendarDayGridRowProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, value, ctx, children, ...elementProps } = componentProps;

  const ref = React.useRef<HTMLDivElement>(null);

  const resolvedChildren = React.useMemo(() => {
    if (!React.isValidElement(children) && typeof children === 'function') {
      return children({ days: ctx.days });
    }

    return children;
  }, [children, ctx.days]);

  const props = React.useMemo(
    () => ({
      ref,
      role: 'row',
      'aria-rowindex': ctx.rowIndex + 1,
      children: resolvedChildren,
    }),
    [ctx.rowIndex, resolvedChildren],
  );

  const context: CalendarDayGridRowContext = React.useMemo(() => ({ ref }), [ref]);

  const state = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: [props, elementProps],
  });

  return (
    <CalendarDayGridRowContext.Provider value={context}>
      {renderElement()}
    </CalendarDayGridRowContext.Provider>
  );
});

const MemoizedInnerCalendarDayGridRow = React.memo(InnerCalendarDayGridRow);

const CalendarDayGridRow = React.forwardRef(function CalendarDayGridRow(
  props: CalendarDayGridRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const baseDayGridBodyContext = useCalendarDayGridBodyContext();
  const { ref: listItemRef, index } = useCompositeListItem();
  const ref = useForkRef(forwardedRef, listItemRef);

  // TODO: Improve how we pass the week to the week row components.
  const days = React.useMemo(
    () => baseDayGridBodyContext.daysGrid.find((week) => week[0] === props.value) ?? [],
    [baseDayGridBodyContext.daysGrid, props.value],
  );

  const ctx = React.useMemo<InnerCalendarDayGridRowContext>(
    () => ({
      days,
      rowIndex: index,
    }),
    [days, index],
  );

  return <MemoizedInnerCalendarDayGridRow {...props} ref={ref} ctx={ctx} />;
});

export namespace CalendarDayGridRow {
  export interface State {}

  export interface Props extends Omit<BaseUIComponentProps<'div', State>, 'children'> {
    /**
     * The date object representing the week.
     */
    value: PickerValidDate;
    /**
     * The children of the component.
     * If a function is provided, it will be called with the days to render as its parameter.
     */
    children?: React.ReactNode | ((parameters: ChildrenParameters) => React.ReactNode);
  }

  export interface ChildrenParameters {
    /**
     * The days of the week.
     */
    days: PickerValidDate[];
  }
}

interface InnerCalendarDayGridRowProps extends CalendarDayGridRow.Props {
  /**
   * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
   */
  ctx: InnerCalendarDayGridRowContext;
}

interface InnerCalendarDayGridRowContext {
  /**
   * The days to render in the row.
   */
  days: PickerValidDate[];
  /**
   * The index of the row in the grid.
   */
  rowIndex: number;
}

export { CalendarDayGridRow };
