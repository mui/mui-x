import * as React from 'react';
import { DesktopPicker } from '../internals/components/DesktopPicker';
import { datePickerValueManager } from '../DatePicker/shared';
import { Unstable_DateField as DateField } from '../DateField';
import { DesktopDatePicker2Props } from './DesktopDatePicker2.types';
import { useDatePicker2DefaultizedProps, renderDateViews } from '../DatePicker2/shared';
import { useLocaleText } from '../internals';
import { Calendar } from '../internals/components/icons';
import { CalendarPickerView } from '../internals/models/views';

type DesktopDatePickerComponent = (<TDate>(
  props: DesktopDatePicker2Props<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const DesktopDatePicker2 = React.forwardRef(function DesktopDatePicker2<TDate>(
  inProps: DesktopDatePicker2Props<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const localeText = useLocaleText();
  const props = useDatePicker2DefaultizedProps<TDate, DesktopDatePicker2Props<TDate>>(
    inProps,
    'MuiDesktopDatePicker2',
  );

  const { components: inComponents, componentsProps: inComponentsProps, label, ...other } = props;

  const components = React.useMemo(
    () => ({
      Field: DateField,
      OpenPickerIcon: Calendar,
      ...inComponents,
    }),
    [inComponents],
  );

  const componentsProps = React.useMemo(
    () => ({
      ...inComponentsProps,
      field: {
        ref,
        label,
      },
    }),
    [inComponentsProps, ref, label],
  );

  return (
    <DesktopPicker<TDate | null, TDate, CalendarPickerView>
      {...other}
      components={components}
      componentsProps={componentsProps}
      valueManager={datePickerValueManager}
      renderViews={renderDateViews}
      getOpenDialogAriaText={localeText.openDatePickerDialogue}
    />
  );
}) as DesktopDatePickerComponent;

export { DesktopDatePicker2 };
