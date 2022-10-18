import { CalendarOrClockPickerView } from '../../models/views';
import {
  UsePickerValueParams,
  UsePickerValueProps,
  UsePickerValueResponse,
} from './usePickerValue';
import {
  ExportedUsePickerViewProps,
  UsePickerViewParams,
  UsePickerViewsResponse,
} from './usePickerViews';
import { ExportedUsePickerLayoutProps, UsePickerLayoutResponse } from './usePickerLayout';

export interface UsePickerProps<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerValueProps<TValue>,
    ExportedUsePickerViewProps<TView>,
    ExportedUsePickerLayoutProps {}

export interface UsePickerParams<
  TValue,
  TDate,
  TView extends CalendarOrClockPickerView,
  TViewProps extends {},
> extends Pick<UsePickerValueParams<TValue, TDate>, 'valueManager' | 'wrapperVariant'>,
    Pick<
      UsePickerViewParams<TValue, TView, TViewProps>,
      'renderViews' | 'sectionModeLookup' | 'additionalViewProps' | 'inputRef'
    > {
  props: UsePickerProps<TValue, TView>;
}

export interface UsePickerResponse<TValue, TView extends CalendarOrClockPickerView>
  extends Omit<UsePickerValueResponse<TValue>, 'viewProps' | 'layoutProps'>,
    Omit<UsePickerViewsResponse<TView>, 'layoutProps'>,
    UsePickerLayoutResponse<TValue, TView> {}
