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

export interface UsePickerProps<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerValueProps<TValue>,
    ExportedUsePickerViewProps<TView> {}

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

export interface UsePickerResponse<TValue>
  extends Omit<UsePickerValueResponse<TValue>, 'viewProps'>,
    UsePickerViewsResponse {}
