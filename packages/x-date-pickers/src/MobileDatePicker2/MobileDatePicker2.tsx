import * as React from 'react';
import { resolveComponentProps } from '@mui/base/utils';
import { useMobilePicker } from '../internals/hooks/useMobilePicker';
import { datePickerValueManager } from '../DatePicker/shared';
import { Unstable_DateField as DateField } from '../DateField';
import { MobileDatePicker2Props } from './MobileDatePicker2.types';
import { useDatePicker2DefaultizedProps, renderDateViews } from '../DatePicker2/shared';
import { useLocaleText } from '../internals';
import { Calendar } from '../internals/components/icons';

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

  const { renderPicker } = useMobilePicker({
    props: { ...other, components, componentsProps },
    valueManager: datePickerValueManager,
    renderViews: (viewProps) =>
      renderDateViews({ ...other, ...viewProps, components, componentsProps }),
    getOpenDialogAriaText: localeText.openDatePickerDialogue,
  });

  return renderPicker();
}) as MobileDatePickerComponent;

export { MobileDatePicker2 };
