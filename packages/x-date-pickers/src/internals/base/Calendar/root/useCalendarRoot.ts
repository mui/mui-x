import * as React from 'react';
import { DateValidationError } from '../../../../models';
import { useDateManager } from '../../../../managers';
import { ExportedValidateDateProps } from '../../../../validation/validateDate';
import { useUtils } from '../../../hooks/useUtils';
import { PickerValue } from '../../../models';
import { CalendarRootContext } from './CalendarRootContext';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { GenericHTMLProps } from '../../base-utils/types';
import { useBaseCalendarRoot } from '../../utils/base-calendar/root/useBaseCalendarRoot';

export function useCalendarRoot(parameters: useCalendarRoot.Parameters) {
  const { ...baseParameters } = parameters;
  const utils = useUtils();
  const manager = useDateManager();

  const {
    value,
    setValue,
    referenceValue,
    setVisibleDate,
    isDateCellVisible,
    context: baseContext,
  } = useBaseCalendarRoot({
    ...baseParameters,
    manager,
    getInitialVisibleDate: (referenceValueParam) => referenceValueParam,
  });

  const [prevValue, setPrevValue] = React.useState<PickerValue>(value);
  if (value !== prevValue && utils.isValid(value)) {
    setPrevValue(value);
    if (isDateCellVisible(value)) {
      setVisibleDate(value);
    }
  }

  const context: CalendarRootContext = React.useMemo(
    () => ({
      value,
      setValue,
      referenceValue,
    }),
    [value, setValue, referenceValue],
  );

  const getRootProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeReactProps(externalProps, {});
  }, []);

  return React.useMemo(
    () => ({ getRootProps, context, baseContext }),
    [getRootProps, context, baseContext],
  );
}

export namespace useCalendarRoot {
  export interface Parameters
    extends Omit<
        useBaseCalendarRoot.Parameters<PickerValue, DateValidationError>,
        'manager' | 'getInitialVisibleDate'
      >,
      ExportedValidateDateProps {}
}
