import * as React from 'react';
import { resolveComponentProps } from '@mui/base/utils';
import { datePickerValueManager } from '../DatePicker/shared';
import { Unstable_DateField as DateField } from '../DateField';
import { DesktopDatePicker2Props } from './DesktopDatePicker2.types';
import { useDatePicker2DefaultizedProps, renderDateViews } from '../DatePicker2/shared';
import { useLocaleText } from '../internals';
import { Calendar } from '../internals/components/icons';
import { CalendarPickerView } from '../internals/models/views';
import { useDesktopPicker } from '../internals/hooks/useDesktopPicker';
import { PickerViewRenderer } from '../internals/hooks/usePicker';

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

  const {
    components: inComponents,
    componentsProps: inComponentsProps,
    inputRef,
    label,
    ...other
  } = props;

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
      field: (ownerState: any) => ({
        ...resolveComponentProps(inComponentsProps?.field, ownerState),
        ref,
        inputRef,
        label,
      }),
    }),
    [inComponentsProps, ref, label, inputRef],
  );

  const renderViews: PickerViewRenderer<TDate | null, CalendarPickerView> = (viewProps) =>
    renderDateViews({ ...other, ...viewProps });

  const { renderPicker } = useDesktopPicker({
    props: { ...other, components, componentsProps },
    valueManager: datePickerValueManager,
    renderViews,
    getOpenDialogAriaText: localeText.openDatePickerDialogue,
  });

  return renderPicker();
}) as DesktopDatePickerComponent;

export { DesktopDatePicker2 };
