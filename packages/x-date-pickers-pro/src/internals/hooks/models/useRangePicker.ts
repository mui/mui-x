import {
  UsePickerParams,
  BasePickerProps,
  ExportedBaseToolbarProps,
  UsePickerViewsProps,
  BaseNonStaticPickerProps,
  UsePickerValueNonStaticProps,
  UsePickerProviderNonStaticProps,
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

export interface UseRangePickerSlots
  extends ExportedPickersLayoutSlots<PickerRangeValue>,
    RangePickerFieldSlots {}

export interface UseRangePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends ExportedPickersLayoutSlotProps<PickerRangeValue>,
    RangePickerFieldSlotProps<TEnableAccessibleFieldDOMStructure> {
  tabs?: ExportedBaseTabsProps;
  toolbar?: ExportedBaseToolbarProps;
}

export interface RangeOnlyPickerProps
  extends BaseNonStaticPickerProps,
    UsePickerValueNonStaticProps,
    UsePickerProviderNonStaticProps,
    BaseRangeNonStaticPickerProps,
    UseRangePositionProps {}

export interface UseRangePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<any, TView, any>,
> extends RangeOnlyPickerProps,
    BasePickerProps<PickerRangeValue, TView, TError, TExternalProps> {}

export interface RangePickerAdditionalViewProps
  extends Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {}

export interface UseRangePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseRangePickerProps<TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<PickerRangeValue, TView, TExternalProps>,
    'valueManager' | 'valueType' | 'validator' | 'rendererInterceptor'
  > {
  props: TExternalProps;
}
