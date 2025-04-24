'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockRoot } from './useClockRoot';
import { ClockRootContext } from './ClockRootContext';

const ClockRoot = React.forwardRef(function ClockRoot(
  componentProps: ClockRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Form props
    readOnly,
    disabled,
    // Value props
    defaultValue,
    onValueChange,
    value,
    timezone,
    referenceDate,
    // Validation props
    onError,
    minTime,
    maxTime,
    disablePast,
    disableFuture,
    shouldDisableTime,
    // Children
    children,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { getRootProps, context, isEmpty } = useClockRoot({
    readOnly,
    disabled,
    defaultValue,
    onValueChange,
    value,
    timezone,
    referenceDate,
    onError,
    minTime,
    maxTime,
    disablePast,
    disableFuture,
    shouldDisableTime,
    children,
  });

  const state: ClockRoot.State = React.useMemo(() => ({ empty: isEmpty }), [isEmpty]);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: [getRootProps, elementProps],
  });

  return <ClockRootContext.Provider value={context}>{renderElement()}</ClockRootContext.Provider>;
});

export namespace ClockRoot {
  export interface State {}

  export interface Props
    extends useClockRoot.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'value' | 'defaultValue' | 'onError' | 'children'> {}

  export interface ValueChangeHandlerContext extends useClockRoot.ValueChangeHandlerContext {}
}

export { ClockRoot };
