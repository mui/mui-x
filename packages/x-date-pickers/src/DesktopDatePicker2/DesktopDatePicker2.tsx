import * as React from 'react';
import {
  DesktopPicker,
  DesktopPickerSlotsComponent,
  DesktopPickerSlotsComponentsProps,
  ExportedDesktopPickerProps,
} from '../internals/components/DesktopPicker';
import { datePickerValueManager } from '../DatePicker/shared';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';

export interface DesktopDatePicker2SlotsComponent extends DesktopPickerSlotsComponent {}

export interface DesktopDatePicker2SlotsComponentsProps extends DesktopPickerSlotsComponentsProps {}

export interface DesktopDatePicker2Props<TDate>
  extends ExportedDesktopPickerProps<TDate | null, TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopDatePicker2SlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopDatePicker2SlotsComponentsProps;
}

type DesktopDatePickerComponent = (<TDate>(
  props: DesktopDatePicker2Props<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

export const DesktopDatePicker2 = React.forwardRef(function DesktopDatePicker<TDate>(
  inProps: DesktopDatePicker2Props<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const { components: inComponents, componentsProps, ...other } = inProps;

  const components = React.useMemo(
    () => ({
      ...inComponents,
      Field: DateField,
    }),
    [inComponents],
  );

  return (
    <DesktopPicker
      components={components}
      componentsProps={componentsProps}
      valueManager={datePickerValueManager}
      {...other}
    />
  );
}) as DesktopDatePickerComponent;
