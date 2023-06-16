import * as React from 'react';
import { MuiPickersAdapter } from '../../models';
import { singleItemValueManager } from '../utils/valueManagers';
import { getTodayDate } from '../utils/date-utils';
import { SECTION_TYPE_GRANULARITY } from '../utils/getDefaultReferenceDate';

export const useClockReferenceDate = <TDate, TProps extends {}>({
  value,
  referenceDate: referenceDateProp,
  utils,
  props,
}: {
  value: TDate;
  referenceDate: TDate | undefined;
  utils: MuiPickersAdapter<TDate>;
  props: TProps;
}) => {
  const referenceDate = React.useMemo(
    () =>
      singleItemValueManager.getInitialReferenceValue({
        value,
        utils,
        props,
        referenceDate: referenceDateProp,
        granularity: SECTION_TYPE_GRANULARITY.day,
        getTodayDate: () => getTodayDate(utils, 'date'),
      }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return value ?? referenceDate;
};
