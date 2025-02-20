'use client';
import * as React from 'react';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockOptions } from './useClockOptions';

const ClockOptions = React.forwardRef(function ClockOptions(
  props: ClockOptions.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, ...otherProps } = props;
  const { getOptionsProps } = useClockOptions();

  const state: ClockOptions.State = React.useMemo(() => ({}), []);

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

export namespace ClockOptions {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}

export { ClockOptions };
