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
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarRootVisibleDateContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/BaseCalendarRootVisibleDateContext';
import { DateRangeValidationError } from '../../../../models';
import { RangeCalendarRootContext } from './RangeCalendarRootContext';
import { useRangeCalendarRoot } from './useRangeCalendarRoot';

const RangeCalendarRoot = React.forwardRef(function RangeCalendarRoot(
  props: RangeCalendarRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Form props
    readOnly,
    disabled,
    // Focus and navigation props
    monthPageSize,
    yearPageSize,
    // Value props
    onValueChange,
    defaultValue,
    value,
    timezone,
    referenceDate,
    // Visible date props
    onVisibleDateChange,
    visibleDate,
    defaultVisibleDate,
    // Validation props
    onError,
    minDate,
    maxDate,
    disablePast,
    disableFuture,
    shouldDisableDate,
    // Children
    children,
    // Range position props
    rangePosition,
    defaultRangePosition,
    onRangePositionChange,
    availableRangePositions,
    // Other range-specific parameters
    disableDragEditing,
    disableHoverPreview,

    // Props forwarded to the DOM element
    ...otherProps
  } = props;
  const { getRootProps, context, baseContext, visibleDateContext, isEmpty } = useRangeCalendarRoot({
    readOnly,
    disabled,
    monthPageSize,
    yearPageSize,
    defaultValue,
    onValueChange,
    value,
    timezone,
    referenceDate,
    onVisibleDateChange,
    visibleDate,
    defaultVisibleDate,
    onError,
    shouldDisableDate,
    children,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    rangePosition,
    defaultRangePosition,
    onRangePositionChange,
    disableDragEditing,
    disableHoverPreview,
  });

  const state: RangeCalendarRoot.State = React.useMemo(
    () => ({
      empty: isEmpty,
    }),
    [isEmpty],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getRootProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarRootVisibleDateContext.Provider value={visibleDateContext}>
      <BaseCalendarRootContext.Provider value={baseContext}>
        <RangeCalendarRootContext.Provider value={context}>
          {renderElement()}
        </RangeCalendarRootContext.Provider>
      </BaseCalendarRootContext.Provider>
    </BaseCalendarRootVisibleDateContext.Provider>
  );
});

namespace RangeCalendarRoot {
  export interface State {
    /**
     * Whether no start date and no end date are selected.
     */
    empty: boolean;
  }

  export interface Props
    extends useRangeCalendarRoot.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'value' | 'defaultValue' | 'onError' | 'children'> {}

  export interface ValueChangeHandlerContext
    extends useBaseCalendarRoot.ValueChangeHandlerContext<DateRangeValidationError> {}
}

export { RangeCalendarRoot };
