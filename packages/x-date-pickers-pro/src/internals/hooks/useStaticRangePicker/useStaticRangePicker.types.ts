import * as React from 'react';
import {
  BasePickerProps,
  UsePickerParams,
  ExportedBaseToolbarProps,
  StaticOnlyPickerProps,
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
} from '@mui/x-date-pickers/PickersLayout';
import { RangeFieldSection } from '../../../models';
import { UseRangePositionProps } from '../useRangePosition';

export interface UseStaticRangePickerSlots<TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlots<PickerRangeValue, TView> {}

export interface UseStaticRangePickerSlotProps<TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlotProps<PickerRangeValue, TView> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface StaticRangeOnlyPickerProps extends StaticOnlyPickerProps, UseRangePositionProps {}

export interface UseStaticRangePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UseStaticRangePickerProps<TView, any, TExternalProps>,
> extends BasePickerProps<PickerRangeValue, TView, TError, TExternalProps, {}>,
    StaticRangeOnlyPickerProps {
  /**
   * Overridable components.
   * @default {}
   */
  slots?: UseStaticRangePickerSlots<TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseStaticRangePickerSlotProps<TView>;
}

export interface UseStaticRangePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseStaticRangePickerProps<TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<PickerRangeValue, TView, RangeFieldSection, TExternalProps, {}>,
    'valueManager' | 'valueType' | 'validator'
  > {
  props: TExternalProps;
  /**
   * Ref to pass to the root element
   */
  ref: React.Ref<HTMLDivElement> | undefined;
}
