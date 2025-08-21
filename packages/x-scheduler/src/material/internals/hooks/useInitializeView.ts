import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { SchedulerValidDate } from '../../../primitives/models';
import { useEventCalendarContext } from './useEventCalendarContext';

export function useInitializeView(parameters: UseInitializeViewParameters) {
  const { instance } = useEventCalendarContext();
  const initialParameters = React.useRef(parameters);

  useIsoLayoutEffect(() => {
    return instance.setSiblingVisibleDateGetter(initialParameters.current.siblingVisibleDateGetter);
  }, []);
}

export interface UseInitializeViewParameters {
  siblingVisibleDateGetter: (date: SchedulerValidDate, delta: 1 | -1) => SchedulerValidDate;
}
