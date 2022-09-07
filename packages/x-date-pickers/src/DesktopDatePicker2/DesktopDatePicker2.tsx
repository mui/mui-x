import * as React from 'react';
import {
  DesktopWrapper2,
  DesktopWrapper2SlotsComponent,
  DesktopWrapper2SlotsComponentsProps,
} from '../internals/components/wrappers/DesktopWrapper2';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';

export interface DesktopDatePicker2SlotsComponent extends DesktopWrapper2SlotsComponent {}

export interface DesktopDatePicker2SlotsComponentsProps
  extends DesktopWrapper2SlotsComponentsProps {}

export interface DesktopDatePicker2Props<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<DesktopDatePicker2SlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<DesktopDatePicker2SlotsComponentsProps>;
}

type DesktopDatePickerComponent = (<TDate>(
  props: DesktopDatePicker2Props<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

export const DesktopDatePicker2 = React.forwardRef(function DesktopDatePicker<TDate>(
  inProps: DesktopDatePicker2Props<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const { components: inComponents, componentsProps } = inProps;

  const components = React.useMemo(
    () => ({
      ...inComponents,
      Field: DateField,
    }),
    [inComponents],
  );

  return <DesktopWrapper2 components={components} componentsProps={componentsProps} />;
}) as DesktopDatePickerComponent;
