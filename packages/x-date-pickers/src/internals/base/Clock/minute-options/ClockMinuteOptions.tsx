'use client';
import * as React from 'react';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockMinuteOptions } from './useClockMinuteOptions';

const ClockMinuteOptions = React.forwardRef(function ClockMinuteOptions(
  props: ClockMinuteOptions.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...otherProps } = props;
  const { getOptionsProps } = useClockMinuteOptions({
    children,
  });

  const state: ClockMinuteOptions.State = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getOptionsProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

export namespace ClockMinuteOptions {
  export interface State {}

  export interface Props
    extends useClockMinuteOptions.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockMinuteOptions };
