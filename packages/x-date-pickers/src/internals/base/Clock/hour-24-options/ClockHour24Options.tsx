'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockHour24Options } from './useClockHour24Options';
import { ClockOptionListContext } from '../utils/ClockOptionListContext';

const ClockHour24Options = React.forwardRef(function ClockHour24Options(
  props: ClockHour24Options.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, getItems, focusOnMount, ...otherProps } = props;
  const { getOptionsProps, context, scrollerRef } = useClockHour24Options({
    children,
    getItems,
    focusOnMount,
  });

  const state: ClockHour24Options.State = React.useMemo(() => ({}), []);
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

export namespace ClockHour24Options {
  export interface State {}

  export interface Props
    extends useClockHour24Options.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockHour24Options };
