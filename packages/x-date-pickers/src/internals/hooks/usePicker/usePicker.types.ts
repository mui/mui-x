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
import { UsePickerLayoutProps, UsePickerLayoutPropsResponse } from './usePickerLayoutProps';
import { PickerOwnerState } from '../../../models';
import { DateOrTimeViewWithMeridiem } from '../../models';
import { UsePickerProviderParameters, UsePickerProviderReturnValue } from './usePickerProvider';

/**
 * Props common to all picker headless implementations.
 */
export interface UsePickerBaseProps<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<TIsRange, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerValueBaseProps<TIsRange, TError>,
    UsePickerViewsBaseProps<TIsRange, TView, TExternalProps, TAdditionalProps>,
    UsePickerLayoutProps {}

export interface UsePickerProps<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<TIsRange, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerValueProps<TIsRange, TError>,
    UsePickerViewsProps<TIsRange, TView, TExternalProps, TAdditionalProps>,
    UsePickerLayoutProps {}

export interface UsePickerParams<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerProps<TIsRange, TView, any, any, any>,
  TAdditionalProps extends {},
> extends Pick<
      UsePickerValueParams<TIsRange, TExternalProps>,
      'valueManager' | 'valueType' | 'wrapperVariant' | 'validator'
    >,
    Pick<
      UsePickerViewParams<TIsRange, TView, TExternalProps, TAdditionalProps>,
      'additionalViewProps' | 'autoFocusView' | 'rendererInterceptor' | 'fieldRef'
    >,
    Pick<UsePickerProviderParameters<TIsRange>, 'localeText'> {
  props: TExternalProps;
}

export interface UsePickerResponse<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
> extends Omit<UsePickerValueResponse<TIsRange, TError>, 'viewProps' | 'layoutProps'>,
    Omit<UsePickerViewsResponse<TView>, 'layoutProps'>,
    UsePickerLayoutPropsResponse<TIsRange, TView> {
  ownerState: PickerOwnerState;
  providerProps: UsePickerProviderReturnValue;
}
