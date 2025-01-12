import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { getWeekdays } from '../../../../utils/date-utils';
import { useUtils } from '../../../../hooks/useUtils';
import { GenericHTMLProps } from '../../../base-utils/types';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';

export function useBaseCalendarDaysGridHeader(
  parameters: useBaseCalendarDaysGridHeader.Parameters,
) {
  const { children } = parameters;
  const utils = useUtils();
  const baseRootContext = useBaseCalendarRootContext();

  const days = React.useMemo(
    () => getWeekdays(utils, baseRootContext.currentDate),
    [utils, baseRootContext.currentDate],
  );

  const getDaysGridHeaderProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'row',
        children: children == null ? null : children({ days }),
      });
    },
    [days, children],
  );

  return React.useMemo(() => ({ getDaysGridHeaderProps }), [getDaysGridHeaderProps]);
}

export namespace useBaseCalendarDaysGridHeader {
  export interface Parameters {
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    days: PickerValidDate[];
  }
}
