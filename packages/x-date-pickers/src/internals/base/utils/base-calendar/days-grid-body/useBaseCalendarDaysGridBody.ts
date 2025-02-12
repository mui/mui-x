import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { useBaseCalendarDaysGridContext } from '../days-grid/BaseCalendarDaysGridContext';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';
import { GenericHTMLProps } from '../../../base-utils/types';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { BaseCalendarDaysGridBodyContext } from './BaseCalendarDaysGridBodyContext';

export function useBaseCalendarDaysGridBody(parameters: useBaseCalendarDaysGridBody.Parameters) {
  const { children } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const baseDaysGridContext = useBaseCalendarDaysGridContext();
  const ref = React.useRef<HTMLDivElement>(null);

  const getDaysGridBodyProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        ref,
        role: 'rowgroup',
        children:
          children == null
            ? null
            : children({ weeks: baseDaysGridContext.daysGrid.map((week) => week[0]) }),
        onKeyDown: baseRootContext.applyDayGridKeyboardNavigation,
      });
    },
    [baseDaysGridContext.daysGrid, baseRootContext.applyDayGridKeyboardNavigation, children],
  );

  const context: BaseCalendarDaysGridBodyContext = React.useMemo(() => ({ ref }), [ref]);

  return React.useMemo(() => ({ getDaysGridBodyProps, context }), [getDaysGridBodyProps, context]);
}

export namespace useBaseCalendarDaysGridBody {
  export interface Parameters {
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    weeks: PickerValidDate[];
  }
}
