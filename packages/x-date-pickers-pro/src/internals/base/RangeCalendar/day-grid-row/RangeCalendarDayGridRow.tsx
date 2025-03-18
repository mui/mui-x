'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDayGridRow } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-grid-row/useBaseCalendarDayGridRow';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDayGridRowWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-grid-row/useBaseCalendarDayGridRowWrapper';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarDayGridRowContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-grid-row/BaseCalendarDayGridRowContext';

const InnerRangeCalendarDayGridRow = React.forwardRef(function InnerRangeCalendarDayGridRow(
  props: InnerRangeCalendarDayGridRowProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, value, ctx, children, ...otherProps } = props;
  const { getDayGridRowProps, context } = useBaseCalendarDayGridRow({
    value,
    ctx,
    children,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDayGridRowProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarDayGridRowContext.Provider value={context}>
      {renderElement()}
    </BaseCalendarDayGridRowContext.Provider>
  );
});

const MemoizedInnerRangeCalendarDayGridRow = React.memo(InnerRangeCalendarDayGridRow);

const RangeCalendarDayGridRow = React.forwardRef(function CalendarDayGridRow(
  props: RangeCalendarDayGridRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { ref, ctx } = useBaseCalendarDayGridRowWrapper({ forwardedRef, value: props.value });
  return <MemoizedInnerRangeCalendarDayGridRow {...props} ref={ref} ctx={ctx} />;
});

export namespace RangeCalendarDayGridRow {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      Omit<useBaseCalendarDayGridRow.Parameters, 'ctx'> {}
}

interface InnerRangeCalendarDayGridRowProps
  extends Omit<BaseUIComponentProps<'div', RangeCalendarDayGridRow.State>, 'children'>,
    useBaseCalendarDayGridRow.Parameters {}

export { RangeCalendarDayGridRow };
