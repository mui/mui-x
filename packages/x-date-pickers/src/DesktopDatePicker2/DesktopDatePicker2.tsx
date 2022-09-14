import * as React from 'react';
import { DesktopPicker } from '../internals/components/DesktopPicker';
import { datePickerValueManager } from '../DatePicker/shared';
import { Unstable_DateField as DateField } from '../DateField';
import { DesktopDatePicker2Props } from './DesktopDatePicker2.types';
import { useDatePicker2DefaultizedProps, renderDateViews } from './shared';
import { useLocaleText } from '../internals';
import { Calendar } from '../internals/components/icons';

type DesktopDatePickerComponent = (<TDate>(
  props: DesktopDatePicker2Props<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

export const DesktopDatePicker2 = React.forwardRef(function DesktopDatePicker<TDate>(
  inProps: DesktopDatePicker2Props<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useDatePicker2DefaultizedProps<TDate, DesktopDatePicker2Props<TDate>>(
    inProps,
    'MuiDesktopDatePicker2',
  );

  const localeText = useLocaleText();

  const { components: inComponents, componentsProps, ...other } = props;

  const components = React.useMemo(
    () => ({
      Field: DateField,
      OpenPickerIcon: Calendar,
      ...inComponents,
    }),
    [inComponents],
  );

  return (
    <DesktopPicker
      components={components}
      componentsProps={componentsProps}
      valueManager={datePickerValueManager}
      renderViews={renderDateViews}
      getOpenDialogAriaText={localeText.openDatePickerDialogue}
      {...other}
    />
  );
}) as DesktopDatePickerComponent;
