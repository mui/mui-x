import * as React from 'react';
import { resolveComponentProps } from '@mui/base/utils';
import { datePickerValueManager } from '../DatePicker/shared';
import { Unstable_DateField as DateField } from '../DateField';
import { DesktopDatePicker2Props } from './DesktopDatePicker2.types';
import { useDatePicker2DefaultizedProps, renderDateViews } from '../DatePicker2/shared';
import { useLocaleText } from '../internals';
import { Calendar } from '../internals/components/icons';
import { useDesktopPicker } from '../internals/hooks/useDesktopPicker';

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

  const components = {
    Field: DateField,
    OpenPickerIcon: Calendar,
    ...inComponents,
  };

  const componentsProps = {
    ...inComponentsProps,
    field: (ownerState: any) => ({
      ...resolveComponentProps(inComponentsProps?.field, ownerState),
      ref,
      inputRef,
      label,
    }),
  };

  const { renderPicker } = useDesktopPicker({
    props: { ...other, components, componentsProps },
    valueManager: datePickerValueManager,
    renderViews: (viewProps) =>
      renderDateViews({ ...other, ...viewProps, components, componentsProps }),
    getOpenDialogAriaText: localeText.openDatePickerDialogue,
  });

  return renderPicker();
}) as DesktopDatePickerComponent;

export { DesktopDatePicker2 };
