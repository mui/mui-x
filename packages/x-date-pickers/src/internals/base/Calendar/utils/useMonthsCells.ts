import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { getMonthsInYear } from '../../../utils/date-utils';
import { useUtils } from '../../../hooks/useUtils';
import { useCalendarRootContext } from '../root/CalendarRootContext';

export function useMonthsCells(): useMonthsCells.ReturnValue {
  const rootContext = useCalendarRootContext();
  const utils = useUtils();

  const currentYear = React.useMemo(
    () => utils.startOfYear(rootContext.visibleDate),
    [utils, rootContext.visibleDate],
  );

  const months = React.useMemo(() => getMonthsInYear(utils, currentYear), [utils, currentYear]);

  const registerSection = rootContext.registerSection;
  React.useEffect(() => {
    return registerSection({ type: 'month', value: currentYear });
  }, [registerSection, currentYear]);

  return { months };
}

export namespace useMonthsCells {
  export interface ReturnValue {
    months: PickerValidDate[];
  }
}
