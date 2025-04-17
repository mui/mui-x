'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockMeridiemList } from './useClockMeridiemList';
import { ClockListContext } from '../utils/ClockListContext';
import { CompositeList } from '../../composite/list/CompositeList';

const ClockMeridiemList = React.forwardRef(function ClockMeridiemList(
  componentProps: ClockMeridiemList.Props,
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
    ...elementProps
  } = componentProps;

  const { getListProps, context, scrollerRef, cellsRef } = useClockMeridiemList({
    children,
    getItems,
    skipInvalidItems,
    focusOnMount,
    loop,
  });

  const state: ClockMeridiemList.State = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, scrollerRef],
    props: [getListProps, elementProps],
  });

  return (
    <ClockListContext.Provider value={context}>
      <CompositeList elementsRef={cellsRef}>{renderElement()}</CompositeList>
    </ClockListContext.Provider>
  );
});

export namespace ClockMeridiemList {
  export interface State {}

  export interface Props
    extends useClockMeridiemList.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockMeridiemList };
