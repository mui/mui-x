'use client';
import * as React from 'react';
import { useButton } from '../../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridEventCssVars } from './TimeGridEventCssVars';
import { getAdapter } from '../../utils/adapter/getAdapter';
import { useTimeGridColumnContext } from '../column/TimeGridColumnContext';
import { useEvent } from '../../utils/useEvent';
import { SchedulerValidDate } from '../../models';

const adapter = getAdapter();

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

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  const { getButtonProps, buttonRef } = useButton({ disabled: !isInteractive });

  const { start: columnStart, end: columnEnd } = useTimeGridColumnContext();

  const style = React.useMemo(() => {
    const getMinutes = (date: SchedulerValidDate) =>
      adapter.getHours(date) * 60 + adapter.getMinutes(date);

    const minutesInColumn = getMinutes(columnEnd) - getMinutes(columnStart);

    const isStartingBeforeColumnStart = adapter.isBefore(start, columnStart);
    const isEndingAfterColumnEnd = adapter.isAfter(end, columnEnd);
    const startTime = isStartingBeforeColumnStart ? 0 : getMinutes(start) - getMinutes(columnStart);
    const endTime = isEndingAfterColumnEnd
      ? minutesInColumn
      : getMinutes(end) - getMinutes(columnStart);

    const yPositionInt = isStartingBeforeColumnStart ? 0 : (startTime / minutesInColumn) * 100;

    const heightInt = isEndingAfterColumnEnd
      ? 100 - yPositionInt
      : ((endTime - startTime) / minutesInColumn) * 100;

    return {
      [TimeGridEventCssVars.yPosition]: `${yPositionInt}%`,
      [TimeGridEventCssVars.height]: `${heightInt}%`,
    } as React.CSSProperties;
  }, [columnStart, columnEnd, start, end]);

  const props = React.useMemo(() => ({ style }), [style]);

  const state = useEvent({ start, end });

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef],
    props: [props, elementProps, getButtonProps],
  });
});

export namespace TimeGridEvent {
  export interface State extends useEvent.ReturnValue {}

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {}
}
