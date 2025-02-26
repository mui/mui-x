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
  const { className, render, value, ctx, ...otherProps } = props;
  const { getOptionsProps } = useClockOption({
    value,
    ctx,
  });

  const state: ClockOption.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isInvalid],
  );

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
  const { ref, ctx } = useClockOptionWrapper({
    value: props.value,
    format: props.format,
    forwardedRef,
  });

  return <MemoizedInnerClockOption ref={ref} {...props} ctx={ctx} />;
});

export namespace ClockOption {
  export interface State {
    /**
     * Whether the option is selected.
     */
    selected: boolean;
    /**
     * Whether the option is disabled.
     */
    disabled: boolean;
    /**
     * Whether the option is invalid.
     */
    invalid: boolean;
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'button', State>, 'value'>,
      Omit<useClockOption.Parameters, 'ctx'> {}
}

interface InnerClockOptionProps
  extends Omit<BaseUIComponentProps<'button', ClockOption.State>, 'value'>,
    useClockOption.Parameters {}

export { ClockOption };
