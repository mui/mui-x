import {
  UsePickerValueParams,
  UsePickerValueProps,
  UsePickerValueBaseProps,
  UsePickerValueResponse,
} from './usePickerValue.types';
import {
  UsePickerViewsProps,
  UsePickerViewParams,
  UsePickerViewsResponse,
  UsePickerViewsBaseProps,
} from './usePickerViews';
import { PickerOwnerState } from '../../../models';
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
  TExternalProps extends UsePickerViewsProps<TValue, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerValueBaseProps<TValue, TError>,
    UsePickerViewsBaseProps<TValue, TView, TExternalProps, TAdditionalProps>,
    UsePickerProviderProps {}

export interface UsePickerProps<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerValueProps<TValue, TError>,
    UsePickerViewsProps<TValue, TView, TExternalProps, TAdditionalProps>,
    UsePickerProviderProps {}

export interface UsePickerParams<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerProps<TValue, TView, any, any, any>,
  TAdditionalProps extends {},
> extends Pick<
      UsePickerValueParams<TValue, TExternalProps>,
      'valueManager' | 'valueType' | 'variant' | 'validator'
    >,
    Pick<
      UsePickerViewParams<TValue, TView, TExternalProps, TAdditionalProps>,
      'additionalViewProps' | 'autoFocusView' | 'rendererInterceptor' | 'fieldRef'
    >,
    Pick<UsePickerProviderParameters<TValue>, 'localeText'> {
  props: TExternalProps;
}

export interface UsePickerResponse<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
> extends Pick<UsePickerValueResponse<TValue, TError>, 'open' | 'actions' | 'fieldProps'>,
    Omit<UsePickerViewsResponse<TView>, 'layoutProps' | 'views'> {
  ownerState: PickerOwnerState;
  providerProps: UsePickerProviderReturnValue;
  layoutProps: UsePickerValueResponse<TValue, TError>['layoutProps'] &
    UsePickerViewsResponse<TView>['layoutProps'];
}
