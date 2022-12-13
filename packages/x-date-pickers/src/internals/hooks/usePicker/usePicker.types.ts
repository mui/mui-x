import { DateOrTimeView } from '../../models/views';
import {
  UsePickerValueParams,
  UsePickerValueProps,
  UsePickerValueBaseProps,
  UsePickerValueResponse,
} from './usePickerValue';
import {
  UsePickerViewsProps,
  UsePickerViewParams,
  UsePickerViewsResponse,
  UsePickerViewsBaseProps,
} from './usePickerViews';
import { UsePickerLayoutProps, UsePickerLayoutResponse } from './usePickerLayout';

/**
 * Props common to all picker headless implementations.
 */
export interface UsePickerBaseProps<TValue, TView extends DateOrTimeView, TError>
  extends UsePickerValueBaseProps<TValue, TError>,
    UsePickerViewsBaseProps<TView>,
    UsePickerLayoutProps {}

export interface UsePickerProps<TValue, TView extends DateOrTimeView, TError>
  extends UsePickerValueProps<TValue, TError>,
    UsePickerViewsProps<TView>,
    UsePickerLayoutProps {}

export interface UsePickerParams<
  TValue,
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UsePickerProps<TValue, TView, any>,
  TAdditionalProps extends {},
> extends Pick<
      UsePickerValueParams<TValue, TDate, TExternalProps>,
      'valueManager' | 'wrapperVariant' | 'validator'
    >,
    Pick<
      UsePickerViewParams<TValue, TView, TExternalProps, TAdditionalProps>,
      'viewLookup' | 'additionalViewProps' | 'inputRef' | 'autoFocusView'
    > {
  props: TExternalProps;
}

export interface UsePickerResponse<TValue, TView extends DateOrTimeView, TError>
  extends Omit<UsePickerValueResponse<TValue, TError>, 'viewProps' | 'layoutProps'>,
    Omit<UsePickerViewsResponse<TView>, 'layoutProps'>,
    UsePickerLayoutResponse<TValue, TView> {}
