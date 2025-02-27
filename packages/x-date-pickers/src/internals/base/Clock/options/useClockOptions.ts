import * as React from 'react';
import { useClockOptionList } from '../utils/useClockOptionList';
import { useUtils } from '../../../hooks/useUtils';
import { AmPmProps } from '../../../models/props/time';
import { ClockPrecision } from '../utils/types';

export function useClockOptions(parameters: useClockOptions.Parameters) {
  const { children, getItems, precision, step = precision === 'minute' ? 5 : 1, ampm } = parameters;
  const utils = useUtils();

  const format = React.useMemo(() => {
    const formats = utils.formats;
    const hourFormat = ampm ? `${formats.hours12h} ${formats.meridiem}` : formats.hours24h;

    if (precision === 'hour') {
      return hourFormat;
    }

    return `${hourFormat}:${formats.minutes}`;
  }, [precision, utils, ampm]);

  return useClockOptionList({
    section: 'full-time',
    precision,
    children,
    getItems,
    step,
    format,
  });
}

export namespace useClockOptions {
  export interface Parameters extends useClockOptionList.PublicParameters, AmPmProps {
    precision: ClockPrecision;
    /**
     * The step between two consecutive items.
     * The unit is determined by the `precision` prop.
     * @default 5 if the `precision` is `minute` (to help with performances), 1 otherwise
     */
    step?: number;
  }
}
