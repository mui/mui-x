import { CalendarOrClockPickerView } from '../../models';
import { UsePickerParams, UsePickerProps, UsePickerResponse } from './usePicker.types';
import { usePickerValue } from './usePickerValue';
import { usePickerViews } from './usePickerViews';
import { usePickerLayout } from './usePickerLayout';

export const usePicker = <
  TValue,
  TDate,
  TView extends CalendarOrClockPickerView,
  TExternalProps extends UsePickerProps<TValue, TView>,
  TAdditionalProps extends {},
>({
  props,
  valueManager,
  wrapperVariant,
  viewLookup,
  inputRef,
  additionalViewProps,
}: UsePickerParams<TValue, TDate, TView, TExternalProps, TAdditionalProps>): UsePickerResponse<
  TValue,
  TView
> => {
  const pickerValueResponse = usePickerValue({
    props,
    valueManager,
    wrapperVariant,
  });

  const pickerViewsResponse = usePickerViews({
    props,
    inputRef,
    viewLookup,
    wrapperVariant,
    additionalViewProps,
    propsFromPickerValue: pickerValueResponse.viewProps,
  });

  const pickerLayoutResponse = usePickerLayout({
    props,
    wrapperVariant,
    propsFromPickerValue: pickerValueResponse.layoutProps,
    propsFromPickerViews: pickerViewsResponse.layoutProps,
  });

  return {
    // Picker value
    open: pickerValueResponse.open,
    actions: pickerValueResponse.actions,
    fieldProps: pickerValueResponse.fieldProps,

    // Picker views
    renderCurrentView: pickerViewsResponse.renderCurrentView,
    hasUIView: pickerViewsResponse.hasUIView,
    shouldRestoreFocus: pickerViewsResponse.shouldRestoreFocus,

    // Picker layout
    layoutProps: pickerLayoutResponse.layoutProps,
  };
};
