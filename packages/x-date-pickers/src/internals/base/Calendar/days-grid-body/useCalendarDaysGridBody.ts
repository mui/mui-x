import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { useCalendarDaysGridContext } from '../days-grid/CalendarDaysGridContext';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { GenericHTMLProps } from '../../utils/types';
import { navigateInGrid } from '../utils/keyboardNavigation';

export function useCalendarDaysGridBody(parameters: useCalendarDaysGridBody.Parameters) {
  const { children } = parameters;
  const calendarDaysGridContext = useCalendarDaysGridContext();

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    // TODO: Implement keyboard navigation
    navigateInGrid({
      cells: [],
      target: event.target as HTMLElement,
      key: event.key,
    });
  });

  const getDaysGridBodyProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'rowgroup',
        children:
          children == null
            ? null
            : children({ weeks: calendarDaysGridContext.daysGrid.map((week) => week[0]) }),
        onKeyDown,
      });
    },
    [calendarDaysGridContext.daysGrid, children, onKeyDown],
  );

  return React.useMemo(() => ({ getDaysGridBodyProps }), [getDaysGridBodyProps]);
}

export namespace useCalendarDaysGridBody {
  export interface Parameters {
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    weeks: PickerValidDate[];
  }
}
