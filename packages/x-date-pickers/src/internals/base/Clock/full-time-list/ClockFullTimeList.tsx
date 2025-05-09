'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { ClockListContext } from '../utils/ClockListContext';
import { CompositeList } from '../../base-utils/composite/list/CompositeList';
import { useClockList } from '../utils/useClockList';
import { useUtils } from '../../../hooks/useUtils';
import { AmPmProps } from '../../../models/props/time';
import { ClockPrecision } from '../utils/types';

const ClockFullTimeList = React.forwardRef(function ClockFullTimeList(
  componentProps: ClockFullTimeList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    getItems,
    focusOnMount,
    loop,
    ampm,
    precision,
    step = precision === 'minute' ? 5 : 1,
    ...elementProps
  } = componentProps;

  const utils = useUtils();

  const format = React.useMemo(() => {
    const formats = utils.formats;
    const hourFormat = ampm ? `${formats.hours12h} ${formats.meridiem}` : formats.hours24h;

    if (precision === 'hour') {
      return hourFormat;
    }

    return `${hourFormat}:${formats.minutes}`;
  }, [precision, utils, ampm]);

  const { props, context, ref, cellsRef } = useClockList({
    section: 'full-time',
    precision,
    children,
    getItems,
    step,
    format,
  });

  const state: ClockFullTimeList.State = React.useMemo(() => ({}), []);

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

export namespace ClockFullTimeList {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useClockList.PublicParameters,
      AmPmProps {
    precision: ClockPrecision;
    /**
     * The step between two consecutive items.
     * The unit is determined by the `precision` prop.
     * @default 5 if the `precision` is `minute` (to help with performances), 1 otherwise
     */
    step?: number;
  }
}

export { ClockFullTimeList };
