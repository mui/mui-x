'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockHour24List } from './useClockHour24List';
import { ClockListContext } from '../utils/ClockListContext';
import { CompositeList } from '../../composite/list/CompositeList';

const ClockHour24List = React.forwardRef(function ClockHour24List(
  componentProps: ClockHour24List.Props,
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

  const { getListProps, context, scrollerRef, cellsRef } = useClockHour24List({
    children,
    getItems,
    skipInvalidItems,
    focusOnMount,
    loop,
  });

  const state: ClockHour24List.State = React.useMemo(() => ({}), []);

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

export namespace ClockHour24List {
  export interface State {}

  export interface Props
    extends useClockHour24List.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockHour24List };
