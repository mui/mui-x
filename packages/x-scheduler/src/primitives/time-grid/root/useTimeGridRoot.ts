import * as React from 'react';
import { mergeProps } from '../../../base-ui-copy/merge-props';
import { GenericHTMLProps } from '../../../base-ui-copy/utils/types';
import { PickerValidDate } from '../../utils/adapter/types';

export function useTimeGridRoot(parameters: useTimeGridRoot.Parameters) {
  const {} = parameters;

  const getRootProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeProps(externalProps, { role: 'grid' });
  }, []);

  return React.useMemo(() => ({ getRootProps }), [getRootProps]);
}

export namespace useTimeGridRoot {
  export interface Parameters {}

  export interface ChildrenParameters {
    days: PickerValidDate[];
  }
}
