import * as React from 'react';
import {
  DateOrTimeView,
  BasePickerProps,
  UsePickerParams,
  ExportedBaseToolbarProps,
  StaticOnlyPickerProps,
  UncapitalizeObjectKeys,
} from '@mui/x-date-pickers/internals';
import {
  ExportedPickersLayoutSlotsComponent,
  ExportedPickersLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/PickersLayout';
import { DateRange } from '../../models/range';
import { UseRangePositionProps } from '../useRangePosition';
import { RangeFieldSection } from '../../models/fields';

export interface UseStaticRangePickerSlotsComponent<TDate, TView extends DateOrTimeView>
  extends ExportedPickersLayoutSlotsComponent<DateRange<TDate>, TDate, TView> {}

export interface UseStaticRangePickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  extends ExportedPickersLayoutSlotsComponentsProps<DateRange<TDate>, TDate, TView> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface StaticRangeOnlyPickerProps extends StaticOnlyPickerProps, UseRangePositionProps {}

export interface UseStaticRangePickerProps<
  TDate,
  TView extends DateOrTimeView,
  TError,
  TExternalProps extends UseStaticRangePickerProps<TDate, TView, any, TExternalProps>,
> extends BasePickerProps<DateRange<TDate>, TDate, TView, TError, TExternalProps, {}>,
    StaticRangeOnlyPickerProps {
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<UseStaticRangePickerSlotsComponent<TDate, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseStaticRangePickerSlotsComponentsProps<TDate, TView>;
}

export interface UseStaticRangePickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseStaticRangePickerProps<TDate, TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<DateRange<TDate>, TDate, TView, RangeFieldSection, TExternalProps, {}>,
    'valueManager' | 'validator'
  > {
  props: TExternalProps;
  /**
   * Ref to pass to the root element
   */
  ref: React.Ref<HTMLDivElement> | undefined;
}
