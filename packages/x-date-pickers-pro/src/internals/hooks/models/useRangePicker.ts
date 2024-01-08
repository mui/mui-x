import {
  UsePickerParams,
  BasePickerProps,
  ExportedBaseToolbarProps,
  UsePickerViewsProps,
  BaseNonStaticPickerProps,
  UsePickerValueNonStaticProps,
  UsePickerViewsNonStaticProps,
  DateOrTimeViewWithMeridiem,
  ExportedBaseTabsProps,
} from '@mui/x-date-pickers/internals';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
} from '@mui/x-date-pickers/PickersLayout';
import { RangeFieldSection, BaseRangeNonStaticPickerProps } from '../../models';
import { UseRangePositionProps, UseRangePositionResponse } from '../useRangePosition';
import {
  RangePickerFieldSlots,
  RangePickerFieldSlotProps,
} from '../useEnrichedRangePickerFieldProps';
import { DateRange } from '../../../models';

export interface UseRangePickerSlots<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlots<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlots {}

export interface UseRangePickerSlotProps<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlotProps<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlotProps<TDate> {
  tabs?: ExportedBaseTabsProps;
  toolbar?: ExportedBaseToolbarProps;
}

export interface RangeOnlyPickerProps<TDate>
  extends BaseNonStaticPickerProps,
    UsePickerValueNonStaticProps<TDate | null, RangeFieldSection>,
    UsePickerViewsNonStaticProps,
    BaseRangeNonStaticPickerProps,
    UseRangePositionProps {}

export interface UseRangePickerProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<any, any, TView, any, any>,
  TAdditionalViewProps extends {},
> extends RangeOnlyPickerProps<TDate>,
    BasePickerProps<DateRange<TDate>, TDate, TView, TError, TExternalProps, TAdditionalViewProps> {}

export interface RangePickerAdditionalViewProps
  extends Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {}

export interface UseRangePickerParams<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseRangePickerProps<
    TDate,
    TView,
    any,
    TExternalProps,
    TAdditionalViewProps
  >,
  TAdditionalViewProps extends {},
> extends Pick<
    UsePickerParams<
      DateRange<TDate>,
      TDate,
      TView,
      RangeFieldSection,
      TExternalProps,
      TAdditionalViewProps
    >,
    'valueManager' | 'valueType' | 'validator' | 'rendererInterceptor'
  > {
  props: TExternalProps;
}
