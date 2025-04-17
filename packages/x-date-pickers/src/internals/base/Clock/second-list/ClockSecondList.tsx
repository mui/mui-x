'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockSecondList } from './useClockSecondList';
import { ClockListContext } from '../utils/ClockListContext';
import { CompositeList } from '../../composite/list/CompositeList';

const ClockSecondList = React.forwardRef(function ClockSecondList(
  componentProps: ClockSecondList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    getItems,
    step,
    skipInvalidItems,
    focusOnMount,
    loop,
    ...elementProps
  } = componentProps;

  const { getListProps, context, scrollerRef, cellsRef } = useClockSecondList({
    children,
    getItems,
    step,
    skipInvalidItems,
    focusOnMount,
    loop,
  });

  const state: ClockSecondList.State = React.useMemo(() => ({}), []);

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

export namespace ClockSecondList {
  export interface State {}

  export interface Props
    extends useClockSecondList.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockSecondList };
