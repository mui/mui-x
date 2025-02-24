'use client';
import * as React from 'react';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockOption } from './useClockOption';
import { useClockOptionWrapper } from './useClockOptionWrapper';

const InnerClockOption = React.forwardRef(function InnerClockOption(
  props: InnerClockOptionProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
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

const MemoizedInnerClockOption = React.memo(InnerClockOption);

const ClockOption = React.forwardRef(function ClockOption(
  props: ClockOption.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useClockOptionWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerClockOption ref={ref} {...props} ctx={ctx} />;
});

namespace ClockOption {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'button', State>, 'value'>,
      Omit<useClockOption.Parameters, 'ctx'> {}
}

interface InnerClockOptionProps
  extends Omit<BaseUIComponentProps<'button', ClockOption.State>, 'value'>,
    useClockOption.Parameters {}

export { ClockOption };
