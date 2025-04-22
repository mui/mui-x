import * as React from 'react';
import { mergeProps } from '../../../base-ui-copy/merge-props';
import { GenericHTMLProps } from '../../../base-ui-copy/utils/types';

export function useEventGridCell(parameters: useEventGridCell.Parameters) {
  const { start, end } = parameters;

  const getCellProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeProps(externalProps, {});
  }, []);

  return React.useMemo(() => ({ getCellProps }), [getCellProps]);
}

export namespace useEventGridCell {
  export interface Parameters {
    start: Date; // TODO: Use the correct date type
    end: Date; // TODO: Use the correct date type
  }
}
