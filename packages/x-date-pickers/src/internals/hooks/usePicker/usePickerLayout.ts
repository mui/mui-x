import { UsePickerValueActions, UsePickerValueLayoutResponse } from './usePickerValue';
import { UsePickerViewsLayoutResponse } from './usePickerViews';
import { CalendarOrClockPickerView } from '../../models/views';
import { WrapperVariant } from '../../components/wrappers/WrapperVariantContext';

export interface ExportedUsePickerLayoutProps {
  disabled?: boolean;
  readOnly?: boolean;
  showToolbar?: boolean;
}

export interface UsePickerLayoutProps<TValue, TView extends CalendarOrClockPickerView>
  extends ExportedUsePickerLayoutProps,
    UsePickerValueLayoutResponse<TValue>,
    UsePickerViewsLayoutResponse<TView> {
  hideTabs?: boolean;
}

export interface UsePickerLayoutResponse<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerValueLayoutResponse<TValue>,
    UsePickerViewsLayoutResponse<TView>,
    UsePickerLayoutProps<TValue, TView> {
  isLandscape: boolean;
  wrapperVariant: WrapperVariant;
}

export interface UsePickerLayoutParams<TValue, TView extends CalendarOrClockPickerView> {
  props: UsePickerLayoutProps<TValue, TView>;
  wrapperVariant: WrapperVariant;
  actions: UsePickerValueActions;
  isLandscape: boolean;
}

export const usePickerLayout = <TValue, TView extends CalendarOrClockPickerView>({
  props,
  wrapperVariant,
  isLandscape,
}: UsePickerLayoutParams<TValue, TView>): UsePickerLayoutResponse<TValue, TView> => {
  return {
    isLandscape,
    wrapperVariant,
    disabled: props.disabled,
    readOnly: props.readOnly,
    showToolbar: props.showToolbar,
    hideTabs: props.hideTabs,
    onChange: props.onChange,
    value: props.value,
    view: props.view,
    onViewChange: props.onViewChange,
    views: props.views,
  };
};
