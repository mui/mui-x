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
import { UsePickerLayoutPropsResponse } from './usePickerLayoutProps';
import { FieldSection, PickerOwnerState } from '../../../models';
import { DateOrTimeViewWithMeridiem } from '../../models';
import {
  UsePickerProviderParameters,
  UsePickerProviderProps,
  UsePickerProviderReturnValue,
} from './usePickerProvider';

/**
 * Props common to all picker headless implementations.
 */
export interface UsePickerBaseProps<
  TValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerValueBaseProps<TValue, TError>,
    UsePickerViewsBaseProps<TValue, TView, TExternalProps, TAdditionalProps>,
    UsePickerProviderProps {}

export interface UsePickerProps<
  TValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerValueProps<TValue, TError>,
    UsePickerViewsProps<TValue, TView, TExternalProps, TAdditionalProps>,
    UsePickerProviderProps {}

export interface UsePickerParams<
  TValue,
  TView extends DateOrTimeViewWithMeridiem,
  TSection extends FieldSection,
  TExternalProps extends UsePickerProps<TValue, TView, any, any, any>,
  TAdditionalProps extends {},
> extends Pick<
      UsePickerValueParams<TValue, TExternalProps>,
      'valueManager' | 'valueType' | 'variant' | 'validator'
    >,
    Pick<
      UsePickerViewParams<TValue, TView, TSection, TExternalProps, TAdditionalProps>,
      'additionalViewProps' | 'autoFocusView' | 'rendererInterceptor' | 'fieldRef'
    >,
    Pick<UsePickerProviderParameters<TValue>, 'localeText'> {
  props: TExternalProps;
}

export interface UsePickerResponse<
  TValue,
  TView extends DateOrTimeViewWithMeridiem,
  TSection extends FieldSection,
  TError,
> extends Omit<UsePickerValueResponse<TValue, TSection, TError>, 'viewProps' | 'layoutProps'>,
    Omit<UsePickerViewsResponse<TView>, 'layoutProps' | 'views'>,
    UsePickerLayoutPropsResponse<TValue, TView> {
  ownerState: PickerOwnerState;
  providerProps: UsePickerProviderReturnValue;
}
