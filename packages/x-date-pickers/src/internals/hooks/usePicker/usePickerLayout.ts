import { UsePickerValueActions, UsePickerValueLayoutResponse } from './usePickerValue';
import { UsePickerViewsLayoutResponse } from './usePickerViews';
import { CalendarOrClockPickerView } from '../../models/views';
import { WrapperVariant } from '../../components/wrappers/WrapperVariantContext';

export interface ExportedUsePickerLayoutProps {
  disabled?: boolean;
  readOnly?: boolean;
  showToolbar?: boolean;
}

export interface UsePickerLayoutProps extends ExportedUsePickerLayoutProps {
  hideTabs?: boolean;
}

export interface UsePickerLayoutParamsProps<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerLayoutProps,
    UsePickerValueLayoutResponse<TValue>,
    UsePickerViewsLayoutResponse<TView> {}

export interface UsePickerLayoutResponse<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerValueLayoutResponse<TValue>,
    UsePickerViewsLayoutResponse<TView>,
    UsePickerLayoutParamsProps<TValue, TView>,
    UsePickerValueActions {
  isLandscape: boolean;
  wrapperVariant: WrapperVariant;
}

export interface UsePickerLayoutParams<TValue, TView extends CalendarOrClockPickerView> {
  props: UsePickerLayoutParamsProps<TValue, TView>;
  wrapperVariant: WrapperVariant;
  actions: UsePickerValueActions;
  isLandscape: boolean;
}

export const usePickerLayout = <TValue, TView extends CalendarOrClockPickerView>({
  props,
  wrapperVariant,
  isLandscape,
  actions,
}: UsePickerLayoutParams<TValue, TView>): UsePickerLayoutResponse<TValue, TView> => {
  return {
    ...actions,
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
