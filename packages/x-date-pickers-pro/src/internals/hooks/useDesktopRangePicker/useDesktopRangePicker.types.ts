import {
  PickersPopperSlotsComponent,
  PickersPopperSlotsComponentsProps,
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

export interface UseDesktopRangePickerSlotsComponent<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends UseRangePickerSlotsComponent<TDate, TView>,
    PickersPopperSlotsComponent {}

export interface UseDesktopRangePickerSlotsComponentsProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends UseRangePickerSlotsComponentsProps<TDate, TView>,
    PickersPopperSlotsComponentsProps {
  tabs?: ExportedDateTimeRangePickerTabsProps;
}

export interface DesktopRangeOnlyPickerProps<TDate> extends RangeOnlyPickerProps<TDate> {
  /**
   * If `true`, the start `input` element is focused during the first mount.
   */
  autoFocus?: boolean;
}

export interface UseDesktopRangePickerProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<any, any, TView, any, any>,
> extends UseRangePickerProps<
    TDate,
    TView,
    TError,
    TExternalProps,
    DesktopRangePickerAdditionalViewProps
  > {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UncapitalizeObjectKeys<UseDesktopRangePickerSlotsComponent<TDate, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseDesktopRangePickerSlotsComponentsProps<TDate, TView>;
}

export interface DesktopRangePickerAdditionalViewProps extends RangePickerAdditionalViewProps {}

export interface UseDesktopRangePickerParams<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseDesktopRangePickerProps<TDate, TView, any, TExternalProps>,
> extends UseRangePickerParams<
    TDate,
    TView,
    TExternalProps,
    DesktopRangePickerAdditionalViewProps
  > {}
