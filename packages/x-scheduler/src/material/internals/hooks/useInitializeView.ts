import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { CalendarViewConfig } from '../../../primitives/models';
import { useEventCalendarContext } from './useEventCalendarContext';

/**
 * Initializes the view on the event calendar.
 * The initialization is only done during the 1st render. If you need to access variables in a callback you can use a ref:
 * ```ts
 * const { daysPerPage = 12 } = props;
 * const daysPerPageRef = React.useRef(daysPerPage);
 * useInitializeView(() => ({
 *   siblingVisibleDateGetter: (date, delta) => adapter.addDays(date, daysPerPageRef.current * delta),
 *  }));
 * ```
 * @param parameters Parameters for the view.
 */
export function useInitializeView(parameters: () => CalendarViewConfig) {
  const { instance } = useEventCalendarContext();
  const initialParameters = React.useRef(parameters);

  useIsoLayoutEffect(() => {
    return instance.setViewConfig(initialParameters.current());
  }, []);
}
