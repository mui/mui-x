import * as React from 'react';
import {
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
import { DateOrTimeView } from '@mui/x-date-pickers/models';
import { DateOrTimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models';
import { DateRange } from '../../models/range';
import { UseRangePositionProps } from '../useRangePosition';
import { RangeFieldSection } from '../../models/fields';

export interface UseStaticRangePickerSlotsComponent<
  TDate,
  TView extends DateOrTimeViewWithMeridiem | DateOrTimeView,
> extends ExportedPickersLayoutSlotsComponent<DateRange<TDate>, TDate, TView> {}

export interface UseStaticRangePickerSlotsComponentsProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem | DateOrTimeView,
> extends ExportedPickersLayoutSlotsComponentsProps<DateRange<TDate>, TDate, TView> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface StaticRangeOnlyPickerProps extends StaticOnlyPickerProps, UseRangePositionProps {}

export interface UseStaticRangePickerProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem | DateOrTimeView,
  TError,
  TExternalProps extends UseStaticRangePickerProps<TDate, TView, any, TExternalProps>,
> extends BasePickerProps<DateRange<TDate>, TDate, TView, TError, TExternalProps, {}>,
    StaticRangeOnlyPickerProps {
  /**
   * Overridable components.
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
  TView extends DateOrTimeViewWithMeridiem | DateOrTimeView,
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
