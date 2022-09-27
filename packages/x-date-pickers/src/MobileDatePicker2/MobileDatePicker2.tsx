import * as React from 'react';
import { resolveComponentProps } from '@mui/base/utils';
import { useMobilePicker } from '../internals/hooks/useMobilePicker';
import { datePickerValueManager } from '../DatePicker/shared';
import { Unstable_DateField as DateField } from '../DateField';
import { MobileDatePicker2Props } from './MobileDatePicker2.types';
import { useDatePicker2DefaultizedProps, renderDateViews } from '../DatePicker2/shared';
import { useLocaleText } from '../internals';
import { Calendar } from '../internals/components/icons';
import { CalendarPickerView } from '../internals/models/views';
import { PickerViewRenderer } from '../internals/hooks/usePicker';

type MobileDatePickerComponent = (<TDate>(
  props: MobileDatePicker2Props<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const MobileDatePicker2 = React.forwardRef(function MobileDatePicker2<TDate>(
  inProps: MobileDatePicker2Props<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const localeText = useLocaleText();
  const props = useDatePicker2DefaultizedProps<TDate, MobileDatePicker2Props<TDate>>(
    inProps,
    'MuiMobileDatePicker2',
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

  const { renderPicker } = useMobilePicker({
    props: { ...other, components, componentsProps },
    valueManager: datePickerValueManager,
    renderViews,
    getOpenDialogAriaText: localeText.openDatePickerDialogue,
  });

  return renderPicker();
}) as MobileDatePickerComponent;

export { MobileDatePicker2 };
