import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { CalendarViewConfig } from '../../../primitives/models';
import { useEventCalendarContext } from './useEventCalendarContext';

/**
 * Initializes the view on the event calendar.
 * The initialization is only done during the 1st render, if you need to access variables inside some of the callbacks, make sure to use a ref.
 * @param parameters Parameters for the view.
 */
export function useInitializeView(parameters: () => CalendarViewConfig) {
  const { instance } = useEventCalendarContext();
  const initialParameters = React.useRef(parameters);

  useIsoLayoutEffect(() => {
    return instance.setViewConfig(initialParameters.current());
  }, []);
}
