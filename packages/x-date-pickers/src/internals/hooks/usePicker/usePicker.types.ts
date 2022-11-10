import { CalendarOrClockPickerView } from '../../models/views';
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
export interface UsePickerBaseProps<TValue, TView extends CalendarOrClockPickerView, TError>
  extends UsePickerValueBaseProps<TValue, TError>,
    UsePickerViewsBaseProps<TView>,
    UsePickerLayoutProps {}

export interface UsePickerProps<TValue, TView extends CalendarOrClockPickerView, TError>
  extends UsePickerValueProps<TValue, TError>,
    UsePickerViewsProps<TView>,
    UsePickerLayoutProps {}

export interface UsePickerParams<
  TValue,
  TDate,
  TView extends CalendarOrClockPickerView,
  TExternalProps extends UsePickerProps<TValue, TView, any>,
  TAdditionalProps extends {},
> extends Pick<
      UsePickerValueParams<TValue, TDate, TExternalProps>,
      'valueManager' | 'wrapperVariant' | 'validator'
    >,
    Pick<
      UsePickerViewParams<TValue, TView, TExternalProps, TAdditionalProps>,
      'viewLookup' | 'additionalViewProps' | 'inputRef'
    > {
  props: TExternalProps;
}

export interface UsePickerResponse<TValue, TView extends CalendarOrClockPickerView, TError>
  extends Omit<UsePickerValueResponse<TValue, TError>, 'viewProps' | 'layoutProps'>,
    Omit<UsePickerViewsResponse<TView>, 'layoutProps'>,
    UsePickerLayoutResponse<TValue, TView> {}
