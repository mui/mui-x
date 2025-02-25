'use client';
import * as React from 'react';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockHourOptions } from './useClockHourOptions';
import { ClockOptionListContext } from '../utils/ClockOptionListContext';

const ClockHourOptions = React.forwardRef(function ClockHourOptions(
  props: ClockHourOptions.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...otherProps } = props;
  const { getOptionsProps, context } = useClockHourOptions({
    children,
  });

  const state: ClockHourOptions.State = React.useMemo(() => ({}), []);

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

export namespace ClockHourOptions {
  export interface State {}

  export interface Props
    extends useClockHourOptions.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockHourOptions };
