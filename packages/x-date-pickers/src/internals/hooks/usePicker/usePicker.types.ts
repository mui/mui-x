import { CalendarOrClockPickerView } from '../../models/views';
import {
  UsePickerValueParams,
  UsePickerValueProps,
  UsePickerValueResponse,
  UsePickerValueLayoutResponse,
} from './usePickerValue';
import {
  ExportedUsePickerViewProps,
  UsePickerViewParams,
  UsePickerViewsResponse,
  UsePickerViewsLayoutResponse,
} from './usePickerViews';
import { WrapperVariant } from '../../components/wrappers/WrapperVariantContext';

export interface UsePickerProps<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerValueProps<TValue>,
    ExportedUsePickerViewProps<TView>,
    UsePickerLayoutForwardedProps {
  orientation?: 'portrait' | 'landscape';
}

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

interface UsePickerLayoutForwardedProps {
  disabled?: boolean;
  readOnly?: boolean;
  hideTabs?: boolean;
  showToolbar?: boolean;
}

export interface UsePickerLayoutResponse<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerValueLayoutResponse<TValue>,
    UsePickerViewsLayoutResponse<TView>,
    UsePickerLayoutForwardedProps {
  isLandscape: boolean;
  wrapperVariant: WrapperVariant;
}

export interface UsePickerResponse<TValue, TView extends CalendarOrClockPickerView>
  extends Omit<UsePickerValueResponse<TValue>, 'viewProps' | 'layoutProps'>,
    Omit<UsePickerViewsResponse<TView>, 'layoutProps'> {
  isLandscape: boolean;
  layoutProps: UsePickerLayoutResponse<TValue, TView>;
}
