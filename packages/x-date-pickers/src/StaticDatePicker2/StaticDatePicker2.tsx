import * as React from 'react';
import { StaticDatePicker2Props } from './StaticDatePicker2.types';
import { useDatePicker2DefaultizedProps } from '../DatePicker2/shared';
import { datePickerValueManager } from '../DatePicker/shared';
import { useStaticPicker } from '../internals/hooks/useStaticPicker';
import { CalendarPickerView } from '../internals/models';
import { renderDateView } from '../internals/utils/views';

type StaticDatePickerComponent = (<TDate>(
  props: StaticDatePicker2Props<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const VIEW_LOOKUP = {
  day: renderDateView,
  month: renderDateView,
  year: renderDateView,
};

export const StaticDatePicker2 = React.forwardRef(function StaticDatePicker2<TDate>(
  inProps: StaticDatePicker2Props<TDate>,
) {
  const defaultizedProps = useDatePicker2DefaultizedProps<TDate, StaticDatePicker2Props<TDate>>(
    inProps,
    'MuiStaticDatePicker2',
  );

  const displayStaticWrapperAs = defaultizedProps.displayStaticWrapperAs ?? 'mobile';

  // Props with the default values specific to the static variant
  const props = {
    ...defaultizedProps,
    displayStaticWrapperAs,
    showToolbar: defaultizedProps.showToolbar ?? displayStaticWrapperAs === 'mobile',
  };

  const { renderPicker } = useStaticPicker<TDate, CalendarPickerView, typeof props>({
    props,
    valueManager: datePickerValueManager,
    viewLookup: VIEW_LOOKUP,
  });

  return renderPicker();
}) as StaticDatePickerComponent;
