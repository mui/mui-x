import {
  UsePickerParams,
  BasePickerProps,
  PickersModalDialogSlots,
  PickersModalDialogSlotProps,
  ExportedBaseToolbarProps,
  UsePickerViewsProps,
  BaseNonStaticPickerProps,
  UsePickerValueNonStaticProps,
  UsePickerViewsNonStaticProps,
  DateOrTimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import { FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
} from '@mui/x-date-pickers/PickersLayout';
import { RangeFieldSection } from '../../../models';
import { DateRange, BaseRangeNonStaticPickerProps } from '../../models';
import { UseRangePositionProps, UseRangePositionResponse } from '../useRangePosition';
import {
  RangePickerFieldSlots,
  RangePickerFieldSlotProps,
} from '../useEnrichedRangePickerFieldProps';

export interface UseMobileRangePickerSlots<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends PickersModalDialogSlots,
    ExportedPickersLayoutSlots<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlots {}

export interface UseMobileRangePickerSlotProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends PickersModalDialogSlotProps,
    ExportedPickersLayoutSlotProps<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlotProps<TDate, TTextFieldVersion> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface MobileRangeOnlyPickerProps
  extends BaseNonStaticPickerProps,
    UsePickerValueNonStaticProps,
    UsePickerViewsNonStaticProps,
    BaseRangeNonStaticPickerProps,
    UseRangePositionProps {}

export interface UseMobileRangePickerProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TTextFieldVersion extends FieldTextFieldVersion,
  TError,
  TExternalProps extends UsePickerViewsProps<any, any, TView, any, any>,
> extends MobileRangeOnlyPickerProps,
    BasePickerProps<
      DateRange<TDate>,
      TDate,
      TView,
      TError,
      TExternalProps,
      MobileRangePickerAdditionalViewProps
    > {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseMobileRangePickerSlots<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseMobileRangePickerSlotProps<TDate, TView, TTextFieldVersion>;
}

export interface MobileRangePickerAdditionalViewProps
  extends Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {}

export interface UseMobileRangePickerParams<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TTextFieldVersion extends FieldTextFieldVersion,
  TExternalProps extends UseMobileRangePickerProps<
    TDate,
    TView,
    TTextFieldVersion,
    any,
    TExternalProps
  >,
> extends Pick<
    UsePickerParams<
      DateRange<TDate>,
      TDate,
      TView,
      RangeFieldSection,
      TExternalProps,
      MobileRangePickerAdditionalViewProps
    >,
    'valueManager' | 'valueType' | 'validator'
  > {
  props: TExternalProps;
}
