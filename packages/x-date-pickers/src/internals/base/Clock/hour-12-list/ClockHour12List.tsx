'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockHour12List } from './useClockHour12List';
import { ClockListContext } from '../utils/ClockListContext';
import { CompositeList } from '../../composite/list/CompositeList';

const ClockHour12List = React.forwardRef(function ClockHour12List(
  componentProps: ClockHour12List.Props,
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

  const { getListProps, context, scrollerRef, cellsRef } = useClockHour12List({
    children,
    getItems,
    skipInvalidItems,
    focusOnMount,
    loop,
  });

  const state: ClockHour12List.State = React.useMemo(() => ({}), []);

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

export namespace ClockHour12List {
  export interface State {}

  export interface Props
    extends useClockHour12List.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockHour12List };
