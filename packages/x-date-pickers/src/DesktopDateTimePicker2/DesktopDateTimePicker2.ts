import * as React from 'react';
import { resolveComponentProps } from '@mui/base/utils';
import { datePickerValueManager } from '../DatePicker/shared';
import { Unstable_DateField as DateField } from '../DateField';
import { DesktopDateTimePicker2Props } from './DesktopDateTimePicker2.types';
import { useDateTimePicker2DefaultizedProps } from '../DateTimePicker2/shared';
import { useLocaleText } from '../internals';
import { Calendar } from '../internals/components/icons';
import { useDesktopPicker } from '../internals/hooks/useDesktopPicker';

type DesktopDateTimePickerComponent = (<TDate>(
  props: DesktopDateTimePicker2Props<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const DesktopDateTimePicker2 = React.forwardRef(function DesktopDateTimePicker2<TDate>(
  inProps: DesktopDateTimePicker2Props<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const localeText = useLocaleText();
  const props = useDateTimePicker2DefaultizedProps<TDate, DesktopDateTimePicker2Props<TDate>>(
    inProps,
    'MuiDesktopDateTimePicker2',
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
    renderViews: () => null,
    getOpenDialogAriaText: localeText.openDatePickerDialogue,
  });

  return renderPicker();
}) as DesktopDateTimePickerComponent;

export { DesktopDateTimePicker2 };
