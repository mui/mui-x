import * as React from 'react';
import { DesktopPicker } from '../internals/components/DesktopPicker';
import { datePickerValueManager } from '../DatePicker/shared';
import { Unstable_DateField as DateField } from '../DateField';

import { DesktopDatePicker2Props } from './DesktopDatePicker2.types';
import { useDatePicker2DefaultizedProps } from './shared';
import { CalendarPickerView } from '../internals/models';
import { PickerViewRenderer } from '../internals/components/PickerViewManager';
import { DayPicker } from '../CalendarPicker/DayPicker';

type DesktopDatePickerComponent = (<TDate>(
  props: DesktopDatePicker2Props<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const datePickerViewRenderers: Record<CalendarPickerView, PickerViewRenderer<any | null>> = {
  year: () => <div>Year</div>,
  month: () => <div>Month</div>,
  day: ({ value }) => <DayPicker selectedDays={[]} currentMonth={value} />,
};

export const DesktopDatePicker2 = React.forwardRef(function DesktopDatePicker<TDate>(
  inProps: DesktopDatePicker2Props<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useDatePicker2DefaultizedProps<TDate, DesktopDatePicker2Props<TDate>>(
    inProps,
    'MuiDesktopDatePicker2',
  );

  const { components: inComponents, componentsProps, ...other } = props;

  const components = React.useMemo(
    () => ({
      ...inComponents,
      Field: DateField,
    }),
    [inComponents],
  );

  return (
    <DesktopPicker
      components={components}
      componentsProps={componentsProps}
      valueManager={datePickerValueManager}
      viewRenderers={datePickerViewRenderers}
      {...other}
    />
  );
}) as DesktopDatePickerComponent;
