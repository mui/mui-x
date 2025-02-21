import {
  UsePickerParams,
  BasePickerProps,
  UsePickerViewsProps,
  UsePickerValueNonStaticProps,
  UsePickerProviderNonStaticProps,
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import { BaseRangeNonStaticPickerProps } from '../../models';
import { UseRangePositionProps } from '../useRangePosition';

export interface RangeOnlyPickerProps
  extends UsePickerValueNonStaticProps,
    UsePickerProviderNonStaticProps,
    BaseRangeNonStaticPickerProps,
    UseRangePositionProps {}

export interface UseRangePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<any, TView, any>,
> extends RangeOnlyPickerProps,
    BasePickerProps<PickerRangeValue, TView, TError, TExternalProps> {}

export interface UseRangePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseRangePickerProps<TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<PickerRangeValue, TView, TExternalProps>,
    'valueManager' | 'valueType' | 'validator' | 'rendererInterceptor' | 'ref'
  > {
  props: TExternalProps;
}
