import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { navigateInList } from '../utils/keyboardNavigation';
import { useYearsCells } from '../utils/useYearsCells';

export function useCalendarYearsList(parameters: useCalendarYearsList.Parameters) {
  const { children, loop = true } = parameters;
  const yearsCellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { years } = useYearsCells();

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    navigateInList({
      cells: yearsCellRefs.current,
      event,
      loop,
    });
  });

  const getYearsListProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'radiogroup',
        children: children == null ? null : children({ years }),
        onKeyDown,
      });
    },
    [years, children, onKeyDown],
  );

  return React.useMemo(
    () => ({ getYearsListProps, yearsCellRefs }),
    [getYearsListProps, yearsCellRefs],
  );
}

export namespace useCalendarYearsList {
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
    years: PickerValidDate[];
  }
}
