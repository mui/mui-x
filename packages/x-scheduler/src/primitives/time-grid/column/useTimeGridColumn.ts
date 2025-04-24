import * as React from 'react';
import { PickerValidDate } from '../../utils/adapter/types';
import { TimeGridColumnContext } from './TImeGridColumnContext';
import { getAdapter } from '../../utils/adapter/getAdapter';

const adapter = getAdapter();

export function useTimeGridColumn(parameters: useTimeGridColumn.Parameters) {
  const { value } = parameters;

  const contextValue: TimeGridColumnContext = React.useMemo(
    () => ({ start: adapter.startOfDay(value), end: adapter.endOfDay(value) }),
    [value],
  );

  const props = React.useMemo(() => ({ role: 'gridcell' }), []);

  return { props, contextValue };
}

export namespace useTimeGridColumn {
  export interface Parameters {
    value: PickerValidDate;
  }
}
