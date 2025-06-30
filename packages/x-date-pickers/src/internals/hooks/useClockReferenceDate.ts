import * as React from 'react';
import { MuiPickersAdapter, PickersTimezone, PickerValidDate } from '../../models';
import { singleItemValueManager } from '../utils/valueManagers';
import { getTodayDate } from '../utils/date-utils';
import { SECTION_TYPE_GRANULARITY } from '../utils/getDefaultReferenceDate';
import { PickerValue } from '../models';

export const useClockReferenceDate = <TProps extends {}>({
  value,
  referenceDate: referenceDateProp,
  adapter,
  props,
  timezone,
}: {
  value: PickerValue;
  referenceDate: PickerValidDate | undefined;
  adapter: MuiPickersAdapter;
  props: TProps;
  timezone: PickersTimezone;
}): PickerValidDate => {
  const referenceDate = React.useMemo(
    () =>
      singleItemValueManager.getInitialReferenceValue({
        value,
        adapter,
        props,
        referenceDate: referenceDateProp,
        granularity: SECTION_TYPE_GRANULARITY.day,
        timezone,
        getTodayDate: () => getTodayDate(adapter, timezone, 'date'),
      }), // We want the `referenceDate` to update on prop and `timezone` change (https://github.com/mui/mui-x/issues/10804)
    [referenceDateProp, timezone], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return value ?? referenceDate;
};
