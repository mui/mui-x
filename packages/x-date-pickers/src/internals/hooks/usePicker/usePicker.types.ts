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
import { FieldSection } from '../../../models';
import { DateOrTimeViewWithMeridiem } from '../../models';

/**
 * Props common to all picker headless implementations.
 */
export interface UsePickerBaseProps<
  TValue,
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<TValue, TDate, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerValueBaseProps<TValue, TError>,
    UsePickerViewsBaseProps<TValue, TDate, TView, TExternalProps, TAdditionalProps>,
    UsePickerLayoutProps {}

export interface UsePickerProps<
  TValue,
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TSection extends FieldSection,
  TError,
  TExternalProps extends UsePickerViewsProps<TValue, TDate, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerValueProps<TValue, TSection, TError>,
    UsePickerViewsProps<TValue, TDate, TView, TExternalProps, TAdditionalProps>,
    UsePickerLayoutProps {}

export interface UsePickerParams<
  TValue,
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TSection extends FieldSection,
  TExternalProps extends UsePickerProps<TValue, TDate, TView, TSection, any, any, any>,
  TAdditionalProps extends {},
> extends Pick<
      UsePickerValueParams<TValue, TDate, TSection, TExternalProps>,
      'valueManager' | 'valueType' | 'wrapperVariant' | 'validator'
    >,
    Pick<
      UsePickerViewParams<TValue, TDate, TView, TExternalProps, TAdditionalProps>,
      'additionalViewProps' | 'inputRef' | 'autoFocusView'
    > {
  props: TExternalProps;
}

export interface UsePickerResponse<
  TValue,
  TView extends DateOrTimeViewWithMeridiem,
  TSection extends FieldSection,
  TError,
> extends Omit<UsePickerValueResponse<TValue, TSection, TError>, 'viewProps' | 'layoutProps'>,
    Omit<UsePickerViewsResponse<TView>, 'layoutProps'>,
    UsePickerLayoutPropsResponse<TValue, TView> {}
