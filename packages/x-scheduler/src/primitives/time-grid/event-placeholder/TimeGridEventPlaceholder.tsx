'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useTimeGridRootContext } from '../root/TimeGridRootContext';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { useTimeGridColumnContext } from '../column/TimeGridColumnContext';
import { getTimeGridEventPosition } from '../../utils/date-utils';
import { TimeGridEventPlaceholderCssVars } from './TimeGridEventPlaceholderCssVars';

export const TimeGridEventPlaceholder = React.forwardRef(function TimeGridEventPlaceholder(
  componentProps: TimeGridEventPlaceholder.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const adapter = useAdapter();

  const {
    // Rendering props
    className,
    render,
    // Internal props

    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { placeholder } = useTimeGridRootContext();
  const { start: columnStart, end: columnEnd } = useTimeGridColumnContext();

  const style = React.useMemo(() => {
    if (placeholder == null) {
      return undefined;
    }

    // TODO: Add support for multi-day placeholders
    if (
      !adapter.isAfter(placeholder.start, columnStart) ||
      !adapter.isBefore(placeholder.end, columnEnd)
    ) {
      return undefined;
    }

    const position = getTimeGridEventPosition({
      adapter,
      columnStart,
      columnEnd,
      start: placeholder.start,
      end: placeholder.end,
    });

    return {
      [TimeGridEventPlaceholderCssVars.yPosition]: position.yPosition,
      [TimeGridEventPlaceholderCssVars.height]: position.height,
    } as React.CSSProperties;
  }, [columnStart, columnEnd, placeholder, adapter]);

  const props = React.useMemo(() => ({ style }), [style]);

  return useRenderElement('div', componentProps, {
    enabled: style != null,
    ref: [forwardedRef],
    props: [elementProps, props],
  });
});

export namespace TimeGridEventPlaceholder {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
