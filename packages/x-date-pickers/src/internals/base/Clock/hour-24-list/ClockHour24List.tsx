'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { ClockListContext } from '../utils/ClockListContext';
import { CompositeList } from '../../base-utils/composite/list/CompositeList';
import { useClockList } from '../utils/useClockList';
import { useUtils } from '../../../hooks/useUtils';

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

  const utils = useUtils();

  const { props, context, ref, cellsRef } = useClockList({
    children,
    getItems,
    skipInvalidItems,
    loop,
    section: 'hour24',
    precision: 'hour',
    step: 1, // TODO: Add step prop?
    format: utils.formats.hours24h,
  });
  const state: ClockHour24List.State = React.useMemo(() => ({}), []);

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

export namespace ClockHour24List {
  export interface State {}

  export interface Props
    extends useClockList.PublicParameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockHour24List };
