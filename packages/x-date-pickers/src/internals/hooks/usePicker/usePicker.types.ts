import { CalendarOrClockPickerView } from '../../models/views';
import {
  UsePickerValueParams,
  UsePickerValueProps,
  UsePickerValueBaseProps,
  UsePickerValueResponse,
} from './usePickerValue';
import { UsePickerViewsProps, UsePickerViewParams, UsePickerViewsResponse } from './usePickerViews';
import { UsePickerLayoutProps, UsePickerLayoutResponse } from './usePickerLayout';

/**
 * Props common to all picker headless implementations.
 */
export interface UsePickerBaseProps<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerValueBaseProps<TValue>,
    UsePickerViewsProps<TView>,
    UsePickerLayoutProps {}

export interface UsePickerProps<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerValueProps<TValue>,
    UsePickerViewsProps<TView>,
    UsePickerLayoutProps {}

export interface UsePickerParams<
  TValue,
  TDate,
  TView extends CalendarOrClockPickerView,
  TExternalProps extends UsePickerProps<TValue, TView>,
  TAdditionalProps extends {},
> extends Pick<UsePickerValueParams<TValue, TDate>, 'valueManager' | 'wrapperVariant'>,
    Pick<
      UsePickerViewParams<TValue, TView, TExternalProps, TAdditionalProps>,
      'viewLookup' | 'additionalViewProps' | 'inputRef'
    > {
  props: TExternalProps;
}

export interface UsePickerResponse<TValue, TView extends CalendarOrClockPickerView>
  extends Omit<UsePickerValueResponse<TValue>, 'viewProps' | 'layoutProps'>,
    Omit<UsePickerViewsResponse<TView>, 'layoutProps'>,
    UsePickerLayoutResponse<TValue, TView> {}
