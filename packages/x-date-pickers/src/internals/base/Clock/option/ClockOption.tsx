'use client';
import * as React from 'react';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockOption } from './useClockOption';

const ClockOption = React.forwardRef(function ClockOption(
  props: ClockOption.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, value, ...otherProps } = props;
  const { getOptionsProps } = useClockOption({
    value,
  });

  const state: ClockOption.State = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getOptionsProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

export namespace ClockOption {
  export interface State {}

  export interface Props
    extends useClockOption.Parameters,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

export { ClockOption };
