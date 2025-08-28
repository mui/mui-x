'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { useOnEveryMinuteStart } from '../../utils/useOnEveryMinuteStart';
import { useTimeGridColumnContext } from '../column/TimeGridColumnContext';
import { useElementPositionInCollection } from '../../utils/useElementPositionInCollection';
import { TimeGridCurrentTimeIndicatorCssVars } from './TimeGridCurrentTimeIndicatorCssVars';
import { mergeDateAndTime } from '../../utils/date-utils';

export const TimeGridCurrentTimeIndicator = React.forwardRef(function TimeGridCurrentTimeIndicator(
  componentProps: TimeGridCurrentTimeIndicator.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const adapter = useAdapter();

  const {
    // Rendering props
    className,
    render,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { start: columnStart, end: columnEnd } = useTimeGridColumnContext();

  const [baseNow, setBaseNow] = React.useState(() => adapter.date());
  useOnEveryMinuteStart(() => setBaseNow(adapter.date()));

  const nowForColumn = React.useMemo(
    () => mergeDateAndTime(adapter, columnStart, baseNow),
    [adapter, columnStart, baseNow],
  );

  const endForCalc = React.useMemo(
    () => adapter.addMinutes(nowForColumn, 1),
    [adapter, nowForColumn],
  );

  const { position } = useElementPositionInCollection({
    start: nowForColumn,
    end: endForCalc,
    collectionStart: columnStart,
    collectionEnd: columnEnd,
  });

  const style = React.useMemo(
    () =>
      ({
        [TimeGridCurrentTimeIndicatorCssVars.yPosition]: `${position * 100}%`,
      }) as React.CSSProperties,
    [position],
  );

  const props = React.useMemo(() => ({ style }), [style]);

  const isOutOfRange =
    adapter.isBefore(nowForColumn, columnStart) || adapter.isAfter(nowForColumn, columnEnd);

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
    enabled: !isOutOfRange,
  });
});

export namespace TimeGridCurrentTimeIndicator {
  export interface State {}
  export interface Props extends BaseUIComponentProps<'div', State> {}
}
