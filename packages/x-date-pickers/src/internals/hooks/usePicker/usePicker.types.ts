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
      'valueManager' | 'valueType' | 'variant' | 'validator'
    >,
    Pick<
      UsePickerViewParams<TValue, TView, TExternalProps>,
      'autoFocusView' | 'rendererInterceptor' | 'fieldRef'
    >,
    Pick<UsePickerProviderParameters<TValue, TView, InferError<TExternalProps>>, 'localeText'> {
  props: TExternalProps;
}

export interface UsePickerResponse<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
> extends Pick<UsePickerValueResponse<TValue, TError>, 'fieldProps'>,
    Pick<UsePickerViewsResponse<TView>, 'shouldRestoreFocus' | 'renderCurrentView'> {
  ownerState: PickerOwnerState;
  providerProps: UsePickerProviderReturnValue<TValue>;
  // TODO v8: Remove in https://github.com/mui/mui-x/pull/15671
  hasUIView: boolean;
}
