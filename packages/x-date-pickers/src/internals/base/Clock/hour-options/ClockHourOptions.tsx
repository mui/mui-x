'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useClockHourOptions } from './useClockHourOptions';
import { ClockOptionListContext } from '../utils/ClockOptionListContext';

const ClockHourOptions = React.forwardRef(function ClockHourOptions(
  props: ClockHourOptions.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, getItems, focusOnMount, ...otherProps } = props;
  const { getOptionsProps, context, scrollerRef } = useClockHourOptions({
    children,
    getItems,
    focusOnMount,
  });

  const state: ClockHourOptions.State = React.useMemo(() => ({}), []);
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

export namespace ClockHourOptions {
  export interface State {}

  export interface Props
    extends useClockHourOptions.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'children'> {}
}

export { ClockHourOptions };
