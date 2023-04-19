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
import { FieldSection, DateOrTimeView } from '../../../models';

/**
 * Props common to all picker headless implementations.
 */
export interface UsePickerBaseProps<
  TValue,
  TView extends DateOrTimeView,
  TError,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerValueBaseProps<TValue, TError>,
    UsePickerViewsBaseProps<TValue, TView, TExternalProps, TAdditionalProps>,
    UsePickerLayoutProps {}

export interface UsePickerProps<
  TValue,
  TView extends DateOrTimeView,
  TSection extends FieldSection,
  TError,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerValueProps<TValue, TSection, TError>,
    UsePickerViewsProps<TValue, TView, TExternalProps, TAdditionalProps>,
    UsePickerLayoutProps {}

export interface UsePickerParams<
  TValue,
  TDate,
  TView extends DateOrTimeView,
  TSection extends FieldSection,
  TExternalProps extends UsePickerProps<TValue, TView, TSection, any, any, any>,
  TAdditionalProps extends {},
> extends Pick<
      UsePickerValueParams<TValue, TDate, TSection, TExternalProps>,
      'valueManager' | 'wrapperVariant' | 'validator'
    >,
    Pick<
      UsePickerViewParams<TValue, TView, TExternalProps, TAdditionalProps>,
      'additionalViewProps' | 'inputRef' | 'autoFocusView'
    > {
  props: TExternalProps;
}

export interface UsePickerResponse<
  TValue,
  TView extends DateOrTimeView,
  TSection extends FieldSection,
  TError,
> extends Omit<UsePickerValueResponse<TValue, TSection, TError>, 'viewProps' | 'layoutProps'>,
    Omit<UsePickerViewsResponse<TView>, 'layoutProps'>,
    UsePickerLayoutPropsResponse<TValue, TView> {}
