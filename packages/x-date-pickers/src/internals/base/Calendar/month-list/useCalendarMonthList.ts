import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { getMonthsInYear } from '../../../utils/date-utils';
import { useUtils } from '../../../hooks/useUtils';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';

export function useCalendarMonthList(parameters: useCalendarMonthList.Parameters) {
  const utils = useUtils();
  const calendarRoot = useCalendarRootContext();

  const months = React.useMemo(
    () => getMonthsInYear(utils, calendarRoot.value ?? calendarRoot.referenceDate),
    [utils, calendarRoot.value, calendarRoot.referenceDate],
  );

  const getMonthListProps = React.useCallback(
    (
      externalProps: Omit<GenericHTMLProps, 'children'> & {
        children?: (parameters: useCalendarMonthList.ChildrenParameters) => React.ReactNode;
      },
    ) => {
      const { children, ...otherExternalProps } = externalProps;
      return mergeReactProps(otherExternalProps, {
        role: 'radiogroup',
        children: children == null ? null : children({ months }),
      });
    },
    [months],
  );

  return React.useMemo(() => ({ getMonthListProps }), [getMonthListProps]);
}

export namespace useCalendarMonthList {
  export interface Parameters {
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    months: PickerValidDate[];
  }
}
