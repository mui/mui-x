'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockFullTimeList } from './useClockFullTimeList';
import { ClockListContext } from '../utils/ClockListContext';
import { CompositeList } from '../../composite/list/CompositeList';

const ClockFullTimeList = React.forwardRef(function ClockFullTimeList(
  props: ClockFullTimeList.Props,
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
    ...otherProps
  } = props;
  const {
    getListProps: getOptionsProps,
    context,
    scrollerRef,
    cellsRef,
  } = useClockFullTimeList({
    children,
    getItems,
    focusOnMount,
    loop,
    step,
    precision,
  });

  const state: ClockFullTimeList.State = React.useMemo(() => ({}), []);
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
