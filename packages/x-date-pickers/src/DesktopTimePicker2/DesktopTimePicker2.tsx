import * as React from 'react';
import { resolveComponentProps } from '@mui/base/utils';
import { timePickerValueManager } from '../TimePicker/shared';
import { Unstable_TimeField as TimeField } from '../TimeField';
import { DesktopTimePicker2Props } from './DesktopTimePicker2.types';
import { useTimePicker2DefaultizedProps, renderTimeViews } from '../TimePicker2/shared';
import { useLocaleText } from '../internals';
import { Clock } from '../internals/components/icons';
import { useDesktopPicker } from '../internals/hooks/useDesktopPicker';
import { PickerDateSectionModeLookup } from '../internals/hooks/usePicker';
import { ClockPickerView } from '../internals/models';

type DesktopTimePickerComponent = (<TTime>(
  props: DesktopTimePicker2Props<TTime> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const SECTION_MODE_LOOKUP: PickerDateSectionModeLookup<ClockPickerView> = {
  hours: 'field',
  minutes: 'field',
  seconds: 'field',
};

const DesktopTimePicker2 = React.forwardRef(function DesktopTimePicker2<TTime>(
  inProps: DesktopTimePicker2Props<TTime>,
  ref: React.Ref<HTMLDivElement>,
) {
  const localeText = useLocaleText();
  const props = useTimePicker2DefaultizedProps<TTime, DesktopTimePicker2Props<TTime>>(
    inProps,
    'MuiDesktopTimePicker2',
  );

  const {
    components: inComponents,
    componentsProps: inComponentsProps,
    inputRef,
    label,
    ...other
  } = props;

  const components = {
    Field: TimeField,
    OpenPickerIcon: Clock,
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
    valueManager: timePickerValueManager,
    renderViews: (viewProps) =>
      renderTimeViews({ ...other, ...viewProps, components, componentsProps }),
    getOpenDialogAriaText: localeText.openTimePickerDialogue,
    sectionModeLookup: SECTION_MODE_LOOKUP,
  });

  return renderPicker();
}) as DesktopTimePickerComponent;

export { DesktopTimePicker2 };
