'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockMeridiemOptions } from './useClockMeridiemOptions';
import { ClockOptionListContext } from '../utils/ClockOptionListContext';
import { CompositeList } from '../../composite/list/CompositeList';

const ClockMeridiemOptions = React.forwardRef(function ClockMeridiemOptions(
  props: ClockMeridiemOptions.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    getItems,
    skipInvalidItems,
    focusOnMount,
    loop,
    ...otherProps
  } = props;

  const { getOptionsProps, context, scrollerRef, optionsRef } = useClockMeridiemOptions({
    children,
    getItems,
    skipInvalidItems,
    focusOnMount,
    loop,
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
      <CompositeList elementsRef={optionsRef}>{renderElement()}</CompositeList>
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
