import * as React from 'react';
import { resolveComponentProps } from '@mui/base/utils';
import { datePickerValueManager } from '../DatePicker/shared';
import { Unstable_DateTimeField as DateTimeField } from '../DateTimeField';
import { DesktopDateTimePicker2Props } from './DesktopDateTimePicker2.types';
import { useDateTimePicker2DefaultizedProps, renderDateTimeViews } from '../DateTimePicker2/shared';
import { useLocaleText } from '../internals';
import { Calendar } from '../internals/components/icons';
import { useDesktopPicker } from '../internals/hooks/useDesktopPicker';
import { PickerDateSectionModeLookup } from '../internals/hooks/usePicker';
import { CalendarOrClockPickerView } from '../internals/models';

type DesktopDateTimePickerComponent = (<TDate>(
  props: DesktopDateTimePicker2Props<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const SECTION_MODE_LOOKUP: PickerDateSectionModeLookup<CalendarOrClockPickerView> = {
  year: 'view',
  month: 'view',
  day: 'view',
  hours: 'field',
  minutes: 'field',
  seconds: 'field',
};

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
    Field: DateTimeField,
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
      renderDateTimeViews({ ...other, ...viewProps, components, componentsProps }),
    getOpenDialogAriaText: localeText.openDatePickerDialogue,
    sectionModeLookup: SECTION_MODE_LOOKUP,
  });

  return renderPicker();
}) as DesktopDateTimePickerComponent;

export { DesktopDateTimePicker2 };
