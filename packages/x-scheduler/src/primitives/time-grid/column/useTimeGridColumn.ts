import * as React from 'react';
import { mergeProps } from '../../../base-ui-copy/merge-props';
import { GenericHTMLProps } from '../../../base-ui-copy/utils/types';
import { PickerValidDate } from '../../utils/adapter/types';

export function useTimeGridColumn(parameters: useTimeGridColumn.Parameters) {
  const { value } = parameters;

  const getColumnProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeProps(externalProps, { children: 'TODO' });
  }, []);

  return React.useMemo(() => ({ getColumnProps }), [getColumnProps]);
}

export namespace useTimeGridColumn {
  export interface Parameters {
    value: PickerValidDate; // TODO: Use the correct date type
  }
}
