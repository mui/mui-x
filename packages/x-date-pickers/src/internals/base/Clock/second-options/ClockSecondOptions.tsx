'use client';
import * as React from 'react';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockSecondOptions } from './useClockSecondOptions';
import { ClockOptionListContext } from '../utils/ClockOptionListContext';

const ClockSecondOptions = React.forwardRef(function ClockSecondOptions(
  props: ClockSecondOptions.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...otherProps } = props;
  const { getOptionsProps, context } = useClockSecondOptions({
    children,
  });

  const state: ClockSecondOptions.State = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getOptionsProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <ClockOptionListContext.Provider value={context}>
      {renderElement()}
    </ClockOptionListContext.Provider>
  );
});

export namespace ClockSecondOptions {
  export interface State {}

  export interface Props
    extends useClockSecondOptions.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockSecondOptions };
