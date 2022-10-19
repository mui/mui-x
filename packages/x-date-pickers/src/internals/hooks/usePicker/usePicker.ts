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
    propsFromPickerValue: pickerValueResponse.viewProps,
    additionalViewProps,
    viewLookup,
    inputRef,
    wrapperVariant,
    actions: pickerValueResponse.actions,
  });

  const pickerLayoutResponse = usePickerLayout({
    props,
    propsFromPickerValue: pickerValueResponse.layoutProps,
    propsFromPickerViews: pickerViewsResponse.layoutProps,
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
