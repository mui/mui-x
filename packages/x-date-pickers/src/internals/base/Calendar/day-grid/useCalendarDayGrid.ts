import * as React from 'react';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';

export function useCalendarDayGrid() {
  const getDayGridProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeReactProps(externalProps, {
      role: 'grid',
    });
  }, []);

  return React.useMemo(() => ({ getDayGridProps }), [getDayGridProps]);
}

export namespace useCalendarDayGrid {}
