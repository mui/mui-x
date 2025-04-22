'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockFullTimeList } from './useClockFullTimeList';
import { ClockListContext } from '../utils/ClockListContext';
import { CompositeList } from '../../base-utils/composite/list/CompositeList';

const ClockFullTimeList = React.forwardRef(function ClockFullTimeList(
  componentProps: ClockFullTimeList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    getItems,
    focusOnMount,
    loop,
    step,
    precision,
    ...elementProps
  } = componentProps;

  const { getListProps, context, scrollerRef, cellsRef } = useClockFullTimeList({
    children,
    getItems,
    focusOnMount,
    loop,
    step,
    precision,
  });

  const state: ClockFullTimeList.State = React.useMemo(() => ({}), []);

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

export namespace ClockFullTimeList {
  export interface State {}

  export interface Props
    extends useClockFullTimeList.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockFullTimeList };
