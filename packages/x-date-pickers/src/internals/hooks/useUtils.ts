import * as React from 'react';
import { PickersTimezone, PickerValidDate } from '../../models';
import { useLocalizationContext, usePickerAdapter } from '../../hooks/usePickerAdapter';

export const useDefaultDates = () => useLocalizationContext().defaultDates;

export const useNow = (timezone: PickersTimezone): PickerValidDate => {
  const adapter = usePickerAdapter();

  const now = React.useRef<PickerValidDate>(undefined);
  if (now.current === undefined) {
    now.current = adapter.date(undefined, timezone);
  }

  return now.current!;
};
