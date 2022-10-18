import { CalendarOrClockPickerView } from '../../models';
import { UsePickerParams, UsePickerResponse } from './usePicker.types';
import { usePickerValue } from './usePickerValue';
import { usePickerViews } from './usePickerViews';
import { usePickerLayout } from './usePickerLayout';

export const usePicker = <
  TValue,
  TDate,
  TView extends CalendarOrClockPickerView,
  TViewProps extends {},
>({
  props,
  valueManager,
  wrapperVariant,
  sectionModeLookup,
  inputRef,
  renderViews,
  additionalViewProps,
}: UsePickerParams<TValue, TDate, TView, TViewProps>): UsePickerResponse<TValue, TView> => {
  const pickerValueResponse = usePickerValue({
    props,
    valueManager,
    wrapperVariant,
  });

  const pickerViewsResponse = usePickerViews({
    props: { ...props, ...pickerValueResponse.viewProps },
    additionalViewProps,
    sectionModeLookup,
    inputRef,
    wrapperVariant,
    renderViews,
    actions: pickerValueResponse.actions,
  });

  const pickerLayoutResponse = usePickerLayout({
    props: { ...props, ...pickerValueResponse.layoutProps, ...pickerViewsResponse.layoutProps },
    actions: pickerValueResponse.actions,
    wrapperVariant,
  });

  return {
    // Picker value
    open: pickerValueResponse.open,
    actions: pickerValueResponse.actions,
    fieldProps: pickerValueResponse.fieldProps,

    // Picker views
    renderViews: pickerViewsResponse.renderViews,
    hasPopperView: pickerViewsResponse.hasPopperView,
    shouldRestoreFocus: pickerViewsResponse.shouldRestoreFocus,

    // Picker layout
    layoutProps: pickerLayoutResponse.layoutProps,
  };
};
