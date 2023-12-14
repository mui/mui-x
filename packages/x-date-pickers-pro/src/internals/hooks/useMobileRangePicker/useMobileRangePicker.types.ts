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
} from '@mui/x-date-pickers/internals';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
} from '@mui/x-date-pickers/PickersLayout';
import { DateOrTimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models';
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
  TUseV6TextField extends boolean,
> extends PickersModalDialogSlotProps,
    ExportedPickersLayoutSlotProps<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlotProps<TDate, TUseV6TextField> {
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
  TUseV6TextField extends boolean,
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
  slotProps?: UseMobileRangePickerSlotProps<TDate, TView, TUseV6TextField>;
}

export interface MobileRangePickerAdditionalViewProps
  extends Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {}

export interface UseMobileRangePickerParams<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TUseV6TextField extends boolean,
  TExternalProps extends UseMobileRangePickerProps<
    TDate,
    TView,
    TUseV6TextField,
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
