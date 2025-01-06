import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { navigateInList } from '../utils/keyboardNavigation';
import { useCalendarMonthsCellCollection } from '../utils/months-cell-collection/useCalendarMonthsCellCollection';

export function useCalendarMonthsList(parameters: useCalendarMonthsList.Parameters) {
  const { children, loop = true } = parameters;
  const monthsCellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { months, context } = useCalendarMonthsCellCollection();

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    navigateInList({
      cells: monthsCellRefs.current,
      event,
      loop,
    });
  });

  const getMonthListProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'radiogroup',
        children: children == null ? null : children({ months }),
        onKeyDown,
      });
    },
    [months, children, onKeyDown],
  );

  return React.useMemo(
    () => ({ getMonthListProps, context, monthsCellRefs }),
    [getMonthListProps, context, monthsCellRefs],
  );
}

export namespace useCalendarMonthsList {
  export interface Parameters {
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loop?: boolean;
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    months: PickerValidDate[];
  }
}
