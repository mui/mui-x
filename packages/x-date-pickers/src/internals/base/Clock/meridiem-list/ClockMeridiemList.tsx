'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { ClockListContext } from '../utils/ClockListContext';
import { CompositeList } from '../../base-utils/composite/list/CompositeList';
import { useClockList } from '../utils/useClockList';
import { useUtils } from '../../../hooks/useUtils';

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

  const utils = useUtils();

  const { props, context, ref, cellsRef } = useClockList({
    children,
    getItems,
    skipInvalidItems,
    loop,
    section: 'meridiem',
    precision: 'meridiem',
    step: 1,
    format: utils.formats.meridiem,
  });

  const state: ClockMeridiemList.State = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref],
    props: [props, elementProps],
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
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useClockList.PublicParameters {}
}

export { ClockMeridiemList };
