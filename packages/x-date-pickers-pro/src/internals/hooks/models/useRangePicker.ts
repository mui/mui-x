import {
  UsePickerParameters,
  BasePickerProps,
  ExportedBaseToolbarProps,
  UsePickerProps,
  UsePickerNonStaticProps,
  DateOrTimeViewWithMeridiem,
  ExportedBaseTabsProps,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
} from '@mui/x-date-pickers/PickersLayout';
import { BaseRangeNonStaticPickerProps } from '../../models';
import { UseRangePositionProps } from '../useRangePosition';
import { RangePickerFieldSlots, RangePickerFieldSlotProps } from '../useEnrichedRangePickerField';

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
  extends UsePickerNonStaticProps,
    BaseRangeNonStaticPickerProps,
    UseRangePositionProps {}

export interface UseRangePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerProps<PickerRangeValue, TView, TError, any>,
> extends RangeOnlyPickerProps,
    BasePickerProps<PickerRangeValue, TView, TError, TExternalProps> {}

export interface UseRangePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseRangePickerProps<TView, any, TExternalProps>,
> extends Pick<
    UsePickerParameters<PickerRangeValue, TView, TExternalProps>,
    'valueManager' | 'valueType' | 'validator' | 'rendererInterceptor' | 'ref'
  > {
  props: TExternalProps;
}
