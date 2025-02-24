import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { getWeekdays } from '../../../../utils/date-utils';
import { useUtils } from '../../../../hooks/useUtils';
import { GenericHTMLProps } from '../../../base-utils/types';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';

export function useBaseCalendarDayGridHeader(parameters: useBaseCalendarDayGridHeader.Parameters) {
  const { children } = parameters;
  const utils = useUtils();

  const days = React.useMemo(() => getWeekdays(utils, utils.date()), [utils]);

  const resolvedChildren = React.useMemo(() => {
    if (!React.isValidElement(children) && typeof children === 'function') {
      return children({ days });
    }

    return children;
  }, [children, days]);

  const getDayGridHeaderProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'row',
        children: resolvedChildren,
      });
    },
    [resolvedChildren],
  );

  return React.useMemo(() => ({ getDayGridHeaderProps }), [getDayGridHeaderProps]);
}

namespace useBaseCalendarDayGridHeader {
  export interface Parameters {
    /**
     * The children of the component.
     * If a function is provided, it will be called with the days of the week as its parameter.
     */
    children?: React.ReactNode | ((parameters: ChildrenParameters) => React.ReactNode);
  }

  export interface ChildrenParameters {
    days: PickerValidDate[];
  }
}
