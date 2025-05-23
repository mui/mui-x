'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { ClockListContext } from '../utils/ClockListContext';
import { CompositeList } from '../../base-utils/composite/list/CompositeList';
import { useClockList } from '../utils/useClockList';
import { useUtils } from '../../../hooks/useUtils';

const ClockMinuteList = React.forwardRef(function ClockMinuteList(
  componentProps: ClockMinuteList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    getItems,
    step = 1,
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
    section: 'minute',
    precision: 'minute',
    step,
    format: utils.formats.minutes,
  });

  const state: ClockMinuteList.State = React.useMemo(() => ({}), []);

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

export namespace ClockMinuteList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useClockList.PublicParameters {
    /**
     * The step in minutes between two consecutive items.
     * @default 1
     */
    step?: number;
  }
}

export { ClockMinuteList };
