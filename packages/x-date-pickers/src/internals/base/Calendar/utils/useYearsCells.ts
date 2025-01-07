import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { useUtils } from '../../../hooks/useUtils';
import { useCalendarRootContext } from '../root/CalendarRootContext';

export function useYearsCells(): useYearsCells.ReturnValue {
  const rootContext = useCalendarRootContext();
  const utils = useUtils();

  const years = React.useMemo(
    () =>
      utils.getYearRange([
        rootContext.validationProps.minDate,
        rootContext.validationProps.maxDate,
      ]),
    [utils, rootContext.validationProps.minDate, rootContext.validationProps.maxDate],
  );

  const registerSection = rootContext.registerSection;
  React.useEffect(() => {
    return registerSection({ type: 'month', value: rootContext.visibleDate });
  }, [registerSection, rootContext.visibleDate]);

  return { years };
}

export namespace useYearsCells {
  export interface ReturnValue {
    years: PickerValidDate[];
  }
}
