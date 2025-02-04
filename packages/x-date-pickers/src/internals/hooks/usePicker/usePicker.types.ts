import {
  UsePickerValueParams,
  UsePickerValueProps,
  UsePickerValueBaseProps,
} from './usePickerValue.types';
import {
  UsePickerViewsProps,
  UsePickerViewParams,
  UsePickerViewsBaseProps,
} from './usePickerViews';
import { InferError, PickerOwnerState } from '../../../models';
import { DateOrTimeViewWithMeridiem, PickerValidValue } from '../../models';
import {
  UsePickerProviderParameters,
  UsePickerProviderProps,
  UsePickerProviderReturnValue,
} from './usePickerProvider';

/**
 * Props common to all picker headless implementations.
 */
export interface UsePickerBaseProps<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any>,
> extends UsePickerValueBaseProps<TValue, TError>,
    UsePickerViewsBaseProps<TValue, TView, TExternalProps>,
    UsePickerProviderProps {}

export interface UsePickerProps<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any>,
> extends UsePickerValueProps<TValue, TError>,
    UsePickerViewsProps<TValue, TView, TExternalProps>,
    UsePickerProviderProps {}

export interface UsePickerParams<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerProps<TValue, TView, any, any>,
> extends Pick<
      UsePickerValueParams<TValue, TExternalProps>,
      'valueManager' | 'valueType' | 'validator'
    >,
    Pick<
      UsePickerViewParams<TValue, TView, TExternalProps>,
      'autoFocusView' | 'viewContainerRole' | 'rendererInterceptor'
    >,
    Pick<
      UsePickerProviderParameters<TValue, TView, InferError<TExternalProps>>,
      'localeText' | 'variant' | 'ref'
    > {
  props: TExternalProps;
}

export interface UsePickerReturnValue<TValue extends PickerValidValue> {
  ownerState: PickerOwnerState;
  renderCurrentView: () => React.ReactNode;
  providerProps: UsePickerProviderReturnValue<TValue>;
}
