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
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
} from '@mui/x-date-pickers/PickersLayout';
import { BaseRangeNonStaticPickerProps } from '../../models';
import { UseRangePositionProps, UseRangePositionResponse } from '../useRangePosition';
import {
  RangePickerFieldSlots,
  RangePickerFieldSlotProps,
} from '../useEnrichedRangePickerFieldProps';

export interface UseRangePickerSlots<TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlots<PickerRangeValue, TView>,
    RangePickerFieldSlots {}

export interface UseRangePickerSlotProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends ExportedPickersLayoutSlotProps<PickerRangeValue, TView>,
    RangePickerFieldSlotProps<TEnableAccessibleFieldDOMStructure> {
  tabs?: ExportedBaseTabsProps;
  toolbar?: ExportedBaseToolbarProps;
}

export interface RangeOnlyPickerProps
  extends BaseNonStaticPickerProps,
    UsePickerValueNonStaticProps,
    UsePickerViewsNonStaticProps,
    BaseRangeNonStaticPickerProps,
    UseRangePositionProps {}

export interface UseRangePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<any, TView, any, any>,
  TAdditionalViewProps extends {},
> extends RangeOnlyPickerProps,
    BasePickerProps<PickerRangeValue, TView, TError, TExternalProps, TAdditionalViewProps> {}

export interface RangePickerAdditionalViewProps
  extends Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {}

export interface UseRangePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseRangePickerProps<TView, any, TExternalProps, TAdditionalViewProps>,
  TAdditionalViewProps extends {},
> extends Pick<
    UsePickerParams<PickerRangeValue, TView, TExternalProps, TAdditionalViewProps>,
    'valueManager' | 'valueType' | 'validator' | 'rendererInterceptor'
  > {
  props: TExternalProps;
}
