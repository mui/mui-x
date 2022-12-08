import * as React from 'react';
import {
  ExportedPickersLayoutSlotsComponent,
  ExportedPickersLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/PickersLayout';
import {
  DateOrTimeView,
  BaseNextPickerProps,
  UsePickerParams,
  PickersSlotsComponent,
  PickersSlotsComponentsProps,
  ExportedBaseToolbarProps,
  StaticOnlyPickerProps,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../../models/range';

export interface UseStaticRangePickerSlotsComponent
  extends ExportedPickersLayoutSlotsComponent<any, any>,
    Pick<PickersSlotsComponent, 'PaperContent'> {}

export interface UseStaticRangePickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  extends ExportedPickersLayoutSlotsComponentsProps<DateRange<TDate>, TView>,
    Pick<PickersSlotsComponentsProps, 'paperContent'> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface StaticRangeOnlyPickerProps extends StaticOnlyPickerProps {}

export interface UseStaticRangePickerProps<TDate, TView extends DateOrTimeView, TError>
  extends BaseNextPickerProps<DateRange<TDate>, TDate, TView, TError>,
    StaticRangeOnlyPickerProps {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: UseStaticRangePickerSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: UseStaticRangePickerSlotsComponentsProps<TDate, TView>;
}

export interface UseStaticRangePickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseStaticRangePickerProps<TDate, TView, any>,
> extends Pick<
    UsePickerParams<DateRange<TDate>, TDate, TView, TExternalProps, {}>,
    'valueManager' | 'viewLookup' | 'validator'
  > {
  props: TExternalProps;
  /**
   * Ref to pass to the root element
   */
  ref: React.Ref<HTMLDivElement> | undefined;
}
