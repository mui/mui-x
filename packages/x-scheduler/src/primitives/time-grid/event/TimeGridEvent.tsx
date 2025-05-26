'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridEventCssVars } from './TimeGridEventCssVars';
import { getAdapter } from '../../utils/adapter/getAdapter';
import { useTimeGridColumnContext } from '../column/TimeGridColumnContext';
import { useEvent } from '../../utils/useEvent';

const adapter = getAdapter();

const MINUTES_IN_DAY = 24 * 60;

export const TimeGridEvent = React.forwardRef(function TimeGridEvent(
  componentProps: TimeGridEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    start,
    end,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { start: columnStart, end: columnEnd } = useTimeGridColumnContext();

  const style = React.useMemo(() => {
    const isStartingBeforeColumnStart = adapter.isBefore(start, columnStart);
    const isEndingAfterColumnEnd = adapter.isAfter(end, columnEnd);
    const startTime = isStartingBeforeColumnStart
      ? 0
      : adapter.getHours(start) * 60 + adapter.getMinutes(start);
    const endTime = isEndingAfterColumnEnd
      ? MINUTES_IN_DAY
      : adapter.getHours(end) * 60 + adapter.getMinutes(end);

    const yPositionInt = isStartingBeforeColumnStart ? 0 : (startTime / MINUTES_IN_DAY) * 100;

    const heightInt = isEndingAfterColumnEnd
      ? 100 - yPositionInt
      : ((endTime - startTime) / MINUTES_IN_DAY) * 100;

    return {
      [TimeGridEventCssVars.yPosition]: `${yPositionInt}%`,
      [TimeGridEventCssVars.height]: `${heightInt}%`,
    } as React.CSSProperties;
  }, [columnStart, columnEnd, start, end]);

  const props = React.useMemo(() => ({ style }), [style]);

  const state = useEvent({ start, end });

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace TimeGridEvent {
  export interface State extends useEventState.ReturnValue {}

  export interface Props extends BaseUIComponentProps<'div', State>, useEventState.Parameters {}
}
