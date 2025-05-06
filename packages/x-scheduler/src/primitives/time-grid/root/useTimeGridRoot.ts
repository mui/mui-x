import * as React from 'react';
import { SchedulerValidDate } from '../../utils/adapter/types';

export function useTimeGridRoot(parameters: useTimeGridRoot.Parameters) {
  // eslint-disable-next-line no-empty-pattern
  const {} = parameters;

  const props = React.useMemo(() => ({ role: 'grid' }), []);

  return { props };
}

export namespace useTimeGridRoot {
  export interface Parameters {}

  export interface ChildrenParameters {
    days: SchedulerValidDate[];
  }
}
