'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarRootContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/BaseCalendarRootContext';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarRoot } from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/useBaseCalendarRoot';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
import { DateRangeValidationError } from '../../../../models';
import { RangeCalendarRootContext } from './RangeCalendarRootContext';
import { useRangeCalendarRoot } from './useRangeCalendarRoot';

const RangeCalendarRoot = React.forwardRef(function RangeCalendarRoot(
  props: RangeCalendarRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    readOnly,
    disabled,
    autoFocus,
    onError,
    defaultValue,
    onValueChange,
    value,
    timezone,
    referenceDate,
    monthPageSize,
    yearPageSize,
    shouldDisableDate,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    availableRangePositions,
    disableHoverPreview,
    disableDragEditing,
    ...otherProps
  } = props;
  const { getRootProps, context, baseContext } = useRangeCalendarRoot({
    readOnly,
    disabled,
    autoFocus,
    onError,
    defaultValue,
    onValueChange,
    value,
    timezone,
    referenceDate,
    monthPageSize,
    yearPageSize,
    shouldDisableDate,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
  });

  const state: RangeCalendarRoot.State = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getRootProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarRootContext.Provider value={baseContext}>
      <RangeCalendarRootContext.Provider value={context}>
        {renderElement()}
      </RangeCalendarRootContext.Provider>
    </BaseCalendarRootContext.Provider>
  );
});

export namespace RangeCalendarRoot {
  export interface State {}

  export interface Props
    extends useRangeCalendarRoot.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'value' | 'defaultValue' | 'onError'> {
    children: React.ReactNode;
  }

  export interface ValueChangeHandlerContext
    extends useBaseCalendarRoot.ValueChangeHandlerContext<DateRangeValidationError> {}
}

export { RangeCalendarRoot };
