import { UsePickerViewsProps, UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import { ExportedDateTimeRangePickerTabsProps } from '../../../DateTimeRangePicker/DateTimeRangePickerTabs';
import { DateTimeRangePickerViews } from '../../models/dateTimeRange';
import {
  DesktopRangeOnlyPickerProps,
  UseDesktopRangePickerSlotsComponent,
  UseDesktopRangePickerSlotsComponentsProps,
} from '../useDesktopRangePicker';
import {
  DesktopRangePickerAdditionalViewProps,
  UseDesktopRangePickerParams,
  UseDesktopRangePickerProps,
} from '../useDesktopRangePicker/useDesktopRangePicker.types';

export interface UseDesktopDateTimeRangePickerSlotsComponent<TDate>
  extends UseDesktopRangePickerSlotsComponent<TDate, DateTimeRangePickerViews> {}

export interface UseDesktopDateTimeRangePickerSlotsComponentsProps<TDate>
  extends UseDesktopRangePickerSlotsComponentsProps<TDate, DateTimeRangePickerViews> {
  tabs?: ExportedDateTimeRangePickerTabsProps;
}

export interface DesktopDateTimeRangeOnlyPickerProps<TDate>
  extends DesktopRangeOnlyPickerProps<TDate> {}

export interface UseDesktopDateTimeRangePickerProps<
  TDate,
  TError,
  TExternalProps extends UsePickerViewsProps<any, any, DateTimeRangePickerViews, any, any>,
> extends UseDesktopRangePickerProps<TDate, DateTimeRangePickerViews, TError, TExternalProps> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UncapitalizeObjectKeys<UseDesktopDateTimeRangePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseDesktopDateTimeRangePickerSlotsComponentsProps<TDate>;
}

export interface DesktopDateTimeRangePickerAdditionalViewProps
  extends DesktopRangePickerAdditionalViewProps {}

export interface UseDesktopDateTimeRangePickerParams<
  TDate,
  TExternalProps extends UseDesktopDateTimeRangePickerProps<TDate, any, TExternalProps>,
> extends UseDesktopRangePickerParams<TDate, DateTimeRangePickerViews, TExternalProps> {}
