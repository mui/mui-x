import * as React from 'react';
import { mergeProps } from '../../base-utils/mergeProps';

export function useCalendarDayGrid() {
  const getDayGridProps = React.useCallback(
    (externalProps = {}): React.ComponentPropsWithRef<'div'> => {
      return mergeProps(
        {
          role: 'grid',
        },
        externalProps,
      );
    },
    [],
  );

  return React.useMemo(() => ({ getDayGridProps }), [getDayGridProps]);
}

export namespace useCalendarDayGrid {}
