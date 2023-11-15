import * as React from 'react';
import {
  BasePickerProps,
  UsePickerParams,
  ExportedBaseToolbarProps,
  StaticOnlyPickerProps,
  DateOrTimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import {
  ExportedPickersLayoutSlotsComponent,
  ExportedPickersLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/PickersLayout';
import { DateRange } from '../../models/range';
import { UseRangePositionProps } from '../useRangePosition';
import { RangeFieldSection } from '../../models/fields';

export interface UseStaticRangePickerSlotsComponent<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlotsComponent<DateRange<TDate>, TDate, TView> {}

export interface UseStaticRangePickerSlotsComponentsProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends ExportedPickersLayoutSlotsComponentsProps<DateRange<TDate>, TDate, TView> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface StaticRangeOnlyPickerProps extends StaticOnlyPickerProps, UseRangePositionProps {}

export interface UseStaticRangePickerProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UseStaticRangePickerProps<TDate, TView, any, TExternalProps>,
> extends BasePickerProps<DateRange<TDate>, TDate, TView, TError, TExternalProps, {}>,
    StaticRangeOnlyPickerProps {
  /**
   * Overridable components.
   * @default {}
   */
  slots?: UseStaticRangePickerSlotsComponent<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseStaticRangePickerSlotsComponentsProps<TDate, TView>;
}

export interface UseStaticRangePickerParams<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseStaticRangePickerProps<TDate, TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<DateRange<TDate>, TDate, TView, RangeFieldSection, TExternalProps, {}>,
    'valueManager' | 'valueType' | 'validator'
  > {
  props: TExternalProps;
  /**
   * Ref to pass to the root element
   */
  ref: React.Ref<HTMLDivElement> | undefined;
}
