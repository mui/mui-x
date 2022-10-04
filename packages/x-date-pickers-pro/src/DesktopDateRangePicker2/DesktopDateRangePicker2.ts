import * as React from 'react';
import { resolveComponentProps } from '@mui/base/utils';
import { useLocaleText } from '@mui/x-date-pickers/internals';
import { dateRangePickerValueManager } from '../DateRangePicker/shared';
import { DesktopDateRangePicker2Props } from './DesktopDateRangePicker2.types';
import { useDatePicker2DefaultizedProps, renderDateRangeViews } from '../DateRangePicker2/shared';
import { useDesktopRangePicker } from '../internal/hooks/useDesktopRangePicker';
import { Unstable_MultiInputDateRangeField as MultiInputDateRangeField } from '../MultiInputDateRangeField';

type DesktopDateRangePickerComponent = (<TDate>(
  props: DesktopDateRangePicker2Props<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const DesktopDateRangePicker2 = React.forwardRef(function DesktopDateRangePicker2<TDate>(
  inProps: DesktopDateRangePicker2Props<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const localeText = useLocaleText();
  const props = useDatePicker2DefaultizedProps<TDate, DesktopDateRangePicker2Props<TDate>>(
    inProps,
    'MuiDesktopDateRangePicker2',
  );

  const { components: inComponents, componentsProps: inComponentsProps, ...other } = props;

  const components = {
    Field: MultiInputDateRangeField,
    ...inComponents,
  };

  const componentsProps = {
    ...inComponentsProps,
    field: (ownerState: any) => ({
      ...resolveComponentProps(inComponentsProps?.field, ownerState),
      ref,
    }),
  };

  const { renderPicker } = useDesktopRangePicker({
    props: { ...other, components, componentsProps, views: ['day'], openTo: 'day' },
    valueManager: dateRangePickerValueManager,
    renderViews: (viewProps) =>
      renderDateRangeViews({ ...other, ...viewProps, components, componentsProps }),
    getOpenDialogAriaText: localeText.openDatePickerDialogue,
  });

  return renderPicker();
}) as DesktopDateRangePickerComponent;

export { DesktopDateRangePicker2 };
