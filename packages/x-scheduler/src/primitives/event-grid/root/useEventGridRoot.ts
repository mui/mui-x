import * as React from 'react';
import { mergeProps } from '../../../base-ui-copy/merge-props';
import { GenericHTMLProps } from '../../../base-ui-copy/utils/types';

export function useEventGridRoot(parameters: useEventGridRoot.Parameters) {
  const {} = parameters;

  const getRootProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeProps(externalProps, {});
  }, []);

  return React.useMemo(() => ({ getRootProps }), [getRootProps]);
}

export namespace useEventGridRoot {
  export interface Parameters {}
}
