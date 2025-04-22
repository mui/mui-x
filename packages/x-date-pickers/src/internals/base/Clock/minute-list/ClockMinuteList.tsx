'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockMinuteList } from './useClockMinuteList';
import { ClockListContext } from '../utils/ClockListContext';
import { CompositeList } from '../../base-utils/composite/list/CompositeList';

const ClockMinuteList = React.forwardRef(function ClockMinuteList(
  componentProps: ClockMinuteList.Props,
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

  const { getListProps, context, scrollerRef, cellsRef } = useClockMinuteList({
    children,
    getItems,
    step,
    skipInvalidItems,
    focusOnMount,
    loop,
  });

  const state: ClockMinuteList.State = React.useMemo(() => ({}), []);

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

export namespace ClockMinuteList {
  export interface State {}

  export interface Props
    extends useClockMinuteList.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockMinuteList };
