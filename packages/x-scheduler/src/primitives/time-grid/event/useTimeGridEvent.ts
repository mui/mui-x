import * as React from 'react';
import { mergeProps } from '../../../base-ui-copy/merge-props';
import { GenericHTMLProps } from '../../../base-ui-copy/utils/types';
import { PickerValidDate } from '../../utils/adapter/types';
import { TimeGridEventCssVars } from './TimeGridEventCssVars';
import { getAdapter } from '../../utils/adapter/getAdapter';

const adapter = getAdapter();

export function useTimeGridEvent(parameters: useTimeGridEvent.Parameters) {
  const { start, end } = parameters;

  const yPosition = React.useMemo(() => {
    const percentage =
      ((adapter.getHours(start) * 60 + adapter.getMinutes(start)) / (24 * 60)) * 100;
    return `${percentage}%`;
  }, [start]);

  const height = React.useMemo(() => {
    // TODO: Use adapter
    const percentage = (end.diff(start, 'minutes').minutes / (24 * 60)) * 100;

    return `${percentage}%`;
  }, [start, end]);

  const getEventProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeProps(externalProps, {
        style: {
          [TimeGridEventCssVars.yPosition]: yPosition,
          [TimeGridEventCssVars.height]: height,
        },
      });
    },
    [yPosition, height],
  );

  return React.useMemo(() => ({ getEventProps }), [getEventProps]);
}

export namespace useTimeGridEvent {
  export interface Parameters {
    /**
     * The time at which the event starts.
     */
    start: PickerValidDate;
    /**
     * The time at which the event ends.
     */
    end: PickerValidDate;
  }
}
