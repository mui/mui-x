import {
  DateOrTimeView,
  UsePickerParams,
  BasePickerProps,
  PickersPopperSlotsComponent,
  PickersPopperSlotsComponentsProps,
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

export interface UseDesktopRangePickerSlotsComponent<TDate, TView extends DateOrTimeView>
  extends PickersPopperSlotsComponent,
    ExportedPickersLayoutSlotsComponent<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlotsComponent {}

export interface UseDesktopRangePickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  extends PickersPopperSlotsComponentsProps,
    ExportedPickersLayoutSlotsComponentsProps<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlotsComponentsProps<TDate> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface DesktopRangeOnlyPickerProps<TDate>
  extends BaseNonStaticPickerProps,
    UsePickerValueNonStaticProps<TDate | null, RangeFieldSection>,
    UsePickerViewsNonStaticProps,
    BaseSingleInputNonStaticPickerProps,
    UseRangePositionProps {
  /**
   * If `true`, the start `input` element is focused during the first mount.
   */
  autoFocus?: boolean;
}

export interface UseDesktopRangePickerProps<
  TDate,
  TView extends DateOrTimeView,
  TError,
  TExternalProps extends UsePickerViewsProps<any, TView, any, any>,
> extends DesktopRangeOnlyPickerProps<TDate>,
    BasePickerProps<
      DateRange<TDate>,
      TDate,
      TView,
      TError,
      TExternalProps,
      DesktopRangePickerAdditionalViewProps
    > {
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots: UncapitalizeObjectKeys<UseDesktopRangePickerSlotsComponent<TDate, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseDesktopRangePickerSlotsComponentsProps<TDate, TView>;
}

export interface DesktopRangePickerAdditionalViewProps extends UseRangePositionResponse {}

export interface UseDesktopRangePickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseDesktopRangePickerProps<TDate, TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<
      DateRange<TDate>,
      TDate,
      TView,
      RangeFieldSection,
      TExternalProps,
      DesktopRangePickerAdditionalViewProps
    >,
    'valueManager' | 'validator'
  > {
  props: TExternalProps;
}
