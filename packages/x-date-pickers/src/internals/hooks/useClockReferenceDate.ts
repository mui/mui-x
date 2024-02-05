import * as React from 'react';
import { MuiPickersAdapter, PickersTimezone, PickerValidDate } from '../../models';
import { singleItemValueManager } from '../utils/valueManagers';
import { getTodayDate } from '../utils/date-utils';
import { SECTION_TYPE_GRANULARITY } from '../utils/getDefaultReferenceDate';

export const useClockReferenceDate = <TDate extends PickerValidDate, TProps extends {}>({
  value,
  referenceDate: referenceDateProp,
  utils,
  props,
  timezone,
}: {
  value: TDate;
  referenceDate: TDate | undefined;
  utils: MuiPickersAdapter<TDate>;
  props: TProps;
  timezone: PickersTimezone;
}) => {
  const referenceDate = React.useMemo(
    () =>
      singleItemValueManager.getInitialReferenceValue({
        value,
        utils,
        props,
        referenceDate: referenceDateProp,
        granularity: SECTION_TYPE_GRANULARITY.day,
        timezone,
        getTodayDate: () => getTodayDate(utils, timezone, 'date'),
      }), // We only want to compute the reference date on mount.
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return value ?? referenceDate;
};
