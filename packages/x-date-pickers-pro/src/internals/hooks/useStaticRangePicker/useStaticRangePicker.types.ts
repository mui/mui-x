import * as React from 'react';
import {
  BasePickerProps,
  UsePickerParams,
  ExportedBaseToolbarProps,
  StaticOnlyPickerProps,
  DateOrTimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
} from '@mui/x-date-pickers/PickersLayout';
import { DateRange } from '../../../models';
import { UseRangePositionProps } from '../useRangePosition';
import { RangeFieldSection } from '../../models/fields';

export interface UseStaticRangePickerSlots<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlots<DateRange<TDate>, TDate, TView> {}

export interface UseStaticRangePickerSlotProps<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlotProps<DateRange<TDate>, TDate, TView> {
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
  slots?: UseStaticRangePickerSlots<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseStaticRangePickerSlotProps<TDate, TView>;
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
