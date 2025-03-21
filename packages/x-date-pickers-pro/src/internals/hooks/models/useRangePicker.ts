import {
  UsePickerParameters,
  BasePickerProps,
  UsePickerProps,
  UsePickerNonStaticProps,
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import { BaseRangeNonStaticPickerProps } from '../../models';
import { UseRangePositionProps } from '../useRangePosition';
import { PickerRangeStep } from '../useRangePickerStepNavigation';

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
  /**
   * Steps available for the picker.
   * This will be used to generate the "previous" and "next" actions.
   * If null, the picker will not have any step navigation.
   */
  steps: PickerRangeStep[] | null;
}
