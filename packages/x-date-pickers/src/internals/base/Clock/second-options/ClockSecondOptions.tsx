'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockSecondOptions } from './useClockSecondOptions';
import { ClockOptionListContext } from '../utils/ClockOptionListContext';
import { CompositeList } from '../../composite/list/CompositeList';

const ClockSecondOptions = React.forwardRef(function ClockSecondOptions(
  props: ClockSecondOptions.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, getItems, step, focusOnMount, loop, ...otherProps } = props;
  const { getOptionsProps, context, scrollerRef, optionsRef } = useClockSecondOptions({
    children,
    getItems,
    step,
    focusOnMount,
    loop,
  });

  const state: ClockSecondOptions.State = React.useMemo(() => ({}), []);
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
      <CompositeList elementsRef={optionsRef}>{renderElement()}</CompositeList>
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
