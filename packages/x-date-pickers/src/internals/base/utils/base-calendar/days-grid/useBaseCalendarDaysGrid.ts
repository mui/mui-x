import * as React from 'react';
import { GenericHTMLProps } from '../../../base-utils/types';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';

export function useBaseCalendarDaysGrid() {
  const getDaysGridProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeReactProps(externalProps, {
      role: 'grid',
    });
  }, []);

  return React.useMemo(() => ({ getDaysGridProps }), [getDaysGridProps]);
}

export namespace useBaseCalendarDaysGrid {}
