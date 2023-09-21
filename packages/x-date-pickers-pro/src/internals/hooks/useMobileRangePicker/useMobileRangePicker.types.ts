import {
  PickersModalDialogSlotsComponent,
  PickersModalDialogSlotsComponentsProps,
  UsePickerViewsProps,
  UncapitalizeObjectKeys,
} from '@mui/x-date-pickers/internals';
import { DateOrTimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models';
import { ExportedDateTimeRangePickerTabsProps } from '../../../DateTimeRangePicker/DateTimeRangePickerTabs';
import {
  RangeOnlyPickerProps,
  RangePickerAdditionalViewProps,
  UseRangePickerParams,
  UseRangePickerProps,
  UseRangePickerSlotsComponent,
  UseRangePickerSlotsComponentsProps,
} from '../models';

export interface UseMobileRangePickerSlotsComponent<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends UseRangePickerSlotsComponent<TDate, TView>,
    PickersModalDialogSlotsComponent {}

export interface UseMobileRangePickerSlotsComponentsProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends UseRangePickerSlotsComponentsProps<TDate, TView>,
    PickersModalDialogSlotsComponentsProps {
  tabs?: ExportedDateTimeRangePickerTabsProps;
}

export interface MobileRangeOnlyPickerProps<TDate> extends RangeOnlyPickerProps<TDate> {}

export interface UseMobileRangePickerProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<any, any, TView, any, any>,
> extends UseRangePickerProps<
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
  slots: UncapitalizeObjectKeys<UseMobileRangePickerSlotsComponent<TDate, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseMobileRangePickerSlotsComponentsProps<TDate, TView>;
}

export interface MobileRangePickerAdditionalViewProps extends RangePickerAdditionalViewProps {}

export interface UseMobileRangePickerParams<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseMobileRangePickerProps<TDate, TView, any, TExternalProps>,
> extends UseRangePickerParams<
    TDate,
    TView,
    TExternalProps,
    MobileRangePickerAdditionalViewProps
  > {}
