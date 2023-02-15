import {
  DateOrTimeView,
  UsePickerParams,
  BasePickerProps,
  PickersModalDialogSlotsComponent,
  PickersModalDialogSlotsComponentsProps,
  ExportedBaseToolbarProps,
  UsePickerViewsProps,
  UncapitalizeObjectKeys,
  BaseNonStaticPickerProps,
  UsePickerValueNonStaticProps,
  UsePickerViewsNonStaticProps,
  BaseSingleInputNonStaticPickerProps,
} from '@mui/x-date-pickers/internals';
import {
  ExportedPickersLayoutSlotsComponent,
  ExportedPickersLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/PickersLayout';
import { DateRange, RangeFieldSection } from '../../models';
import { UseRangePositionProps, UseRangePositionResponse } from '../useRangePosition';
import {
  RangePickerFieldSlotsComponent,
  RangePickerFieldSlotsComponentsProps,
} from '../useEnrichedRangePickerFieldProps';

export interface UseMobileRangePickerSlotsComponent<TDate, TView extends DateOrTimeView>
  extends PickersModalDialogSlotsComponent,
    ExportedPickersLayoutSlotsComponent<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlotsComponent {}

export interface UseMobileRangePickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  extends PickersModalDialogSlotsComponentsProps,
    ExportedPickersLayoutSlotsComponentsProps<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlotsComponentsProps<TDate> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface MobileRangeOnlyPickerProps<TDate>
  extends BaseNonStaticPickerProps,
    UsePickerValueNonStaticProps<TDate | null, RangeFieldSection>,
    UsePickerViewsNonStaticProps,
    BaseSingleInputNonStaticPickerProps,
    UseRangePositionProps {}

export interface UseMobileRangePickerProps<
  TDate,
  TView extends DateOrTimeView,
  TError,
  TExternalProps extends UsePickerViewsProps<any, TView, any, any>,
> extends MobileRangeOnlyPickerProps<TDate>,
    BasePickerProps<
      DateRange<TDate>,
      TDate,
      TView,
      TError,
      TExternalProps,
      MobileRangePickerAdditionalViewProps
    > {
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots: UncapitalizeObjectKeys<UseMobileRangePickerSlotsComponent<TDate, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseMobileRangePickerSlotsComponentsProps<TDate, TView>;
}

export interface MobileRangePickerAdditionalViewProps extends UseRangePositionResponse {}

export interface UseMobileRangePickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseMobileRangePickerProps<TDate, TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<
      DateRange<TDate>,
      TDate,
      TView,
      RangeFieldSection,
      TExternalProps,
      MobileRangePickerAdditionalViewProps
    >,
    'valueManager' | 'validator'
  > {
  props: TExternalProps;
}
