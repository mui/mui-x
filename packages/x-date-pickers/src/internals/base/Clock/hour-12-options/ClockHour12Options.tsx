'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockHour12Options } from './useClockHour12Options';
import { ClockOptionListContext } from '../utils/ClockOptionListContext';

const ClockHour12Options = React.forwardRef(function ClockHour12Options(
  props: ClockHour12Options.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, getItems, focusOnMount, ...otherProps } = props;
  const { getOptionsProps, context, scrollerRef } = useClockHour12Options({
    children,
    getItems,
    focusOnMount,
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
      {renderElement()}
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
