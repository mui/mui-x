import {
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
  DateOrTimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import {
  ExportedPickersLayoutSlotsComponent,
  ExportedPickersLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/PickersLayout';
import { DateRange, RangeFieldSection, BaseRangeNonStaticPickerProps } from '../../models';
import { UseRangePositionProps, UseRangePositionResponse } from '../useRangePosition';
import {
  RangePickerFieldSlotsComponent,
  RangePickerFieldSlotsComponentsProps,
} from '../useEnrichedRangePickerFieldProps';

export interface UseDesktopRangePickerSlotsComponent<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends PickersPopperSlotsComponent,
    ExportedPickersLayoutSlotsComponent<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlotsComponent {}

export interface UseDesktopRangePickerSlotsComponentsProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends ExportedUseDesktopRangePickerSlotsComponentsProps<TDate, TView> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface ExportedUseDesktopRangePickerSlotsComponentsProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends PickersPopperSlotsComponentsProps,
    ExportedPickersLayoutSlotsComponentsProps<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlotsComponentsProps<TDate> {}

export interface DesktopRangeOnlyPickerProps<TDate>
  extends BaseNonStaticPickerProps,
    UsePickerValueNonStaticProps<TDate | null, RangeFieldSection>,
    UsePickerViewsNonStaticProps,
    BaseRangeNonStaticPickerProps,
    UseRangePositionProps {
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

export interface DesktopRangePickerAdditionalViewProps
  extends Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {}

export interface UseDesktopRangePickerParams<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
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
    'valueManager' | 'valueType' | 'validator'
  > {
  props: TExternalProps;
  /**
   * If `true`, the popper will always be aligned on the currently focused input.
   * This is helpful when the view only renders information about one of the dates.
   */
  shouldMovePopperToFocusedInput: boolean;
}
