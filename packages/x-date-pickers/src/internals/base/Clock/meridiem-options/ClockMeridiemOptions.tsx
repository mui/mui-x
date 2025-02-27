'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockMeridiemOptions } from './useClockMeridiemOptions';
import { ClockOptionListContext } from '../utils/ClockOptionListContext';

const ClockMeridiemOptions = React.forwardRef(function ClockMeridiemOptions(
  props: ClockMeridiemOptions.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, getItems, focusOnMount, ...otherProps } = props;
  const { getOptionsProps, context, scrollerRef } = useClockMeridiemOptions({
    children,
    getItems,
    focusOnMount,
  });

  const state: ClockMeridiemOptions.State = React.useMemo(() => ({}), []);
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

export namespace ClockMeridiemOptions {
  export interface State {}

  export interface Props
    extends useClockMeridiemOptions.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockMeridiemOptions };
