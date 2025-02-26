'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockOptions } from './useClockOptions';
import { ClockOptionListContext } from '../utils/ClockOptionListContext';

const ClockOptions = React.forwardRef(function ClockOptions(
  props: ClockOptions.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, getItems, focusOnMount, step, precision, ...otherProps } =
    props;
  const { getOptionsProps, context, scrollerRef } = useClockOptions({
    children,
    getItems,
    focusOnMount,
    step,
    precision,
  });

  const state: ClockOptions.State = React.useMemo(() => ({}), []);
  const ref = useForkRef(forwardedRef, scrollerRef);

  const { renderElement } = useComponentRenderer({
    propGetter: getOptionsProps,
    render: render ?? 'div',
    ref,
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

export namespace ClockOptions {
  export interface State {}

  export interface Props
    extends useClockOptions.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockOptions };
