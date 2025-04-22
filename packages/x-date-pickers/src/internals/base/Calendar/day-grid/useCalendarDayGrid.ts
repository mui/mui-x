import * as React from 'react';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeProps } from '../../base-utils/mergeProps';

export function useCalendarDayGrid() {
  const getDayGridProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeProps(externalProps, {
      role: 'grid',
    });
  }, []);

  return React.useMemo(() => ({ getDayGridProps }), [getDayGridProps]);
}

export namespace useCalendarDayGrid {}
