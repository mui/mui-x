import {
  UsePickerParams,
  BasePickerProps,
  ExportedBaseToolbarProps,
  UsePickerViewsProps,
  BaseNonStaticPickerProps,
  UsePickerValueNonStaticProps,
  UsePickerViewsNonStaticProps,
} from '@mui/x-date-pickers/internals';
import { DateOrTimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models';
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

export interface UseRangePickerSlotsComponent<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlotsComponent<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlotsComponent {}

export interface UseRangePickerSlotsComponentsProps<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlotsComponentsProps<DateRange<TDate>, TDate, TView>,
    RangePickerFieldSlotsComponentsProps<TDate> {
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
