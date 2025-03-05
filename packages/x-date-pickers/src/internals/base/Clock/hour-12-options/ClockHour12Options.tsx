'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockHour12Options } from './useClockHour12Options';
import { ClockOptionListContext } from '../utils/ClockOptionListContext';
import { CompositeList } from '../../composite/list/CompositeList';

const ClockHour12Options = React.forwardRef(function ClockHour12Options(
  props: ClockHour12Options.Props,
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
    ...otherProps
  } = props;

  const { getOptionsProps, context, scrollerRef, optionsRef } = useClockHour12Options({
    children,
    getItems,
    skipInvalidItems,
    focusOnMount,
    loop,
  });

  const state: ClockHour12Options.State = React.useMemo(() => ({}), []);
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
    <ClockOptionListContext.Provider value={context}>
      <CompositeList elementsRef={optionsRef}>{renderElement()}</CompositeList>
    </ClockOptionListContext.Provider>
  );
});

export namespace ClockHour12Options {
  export interface State {}

  export interface Props
    extends useClockHour12Options.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockHour12Options };
