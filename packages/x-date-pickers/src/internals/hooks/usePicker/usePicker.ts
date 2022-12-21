import { DateOrTimeView } from '../../models';
import { UsePickerParams, UsePickerProps, UsePickerResponse } from './usePicker.types';
import { usePickerValue } from './usePickerValue';
import { usePickerViews } from './usePickerViews';
import { usePickerLayoutProps } from './usePickerLayoutProps';
import { InferError } from '../validation/useValidation';

export const usePicker = <
  TValue,
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UsePickerProps<TValue, TView, any, any, any>,
  TAdditionalProps extends {},
>({
  props,
  valueManager,
  wrapperVariant,
  inputRef,
  additionalViewProps,
  validator,
  autoFocusView,
}: UsePickerParams<TValue, TDate, TView, TExternalProps, TAdditionalProps>): UsePickerResponse<
  TValue,
  TView,
  InferError<TExternalProps>
> => {
  const pickerValueResponse = usePickerValue({
    props,
    valueManager,
    wrapperVariant,
    validator,
  });

  const pickerViewsResponse = usePickerViews<TValue, TView, TExternalProps, TAdditionalProps>({
    props,
    inputRef,
    additionalViewProps,
    autoFocusView,
    propsFromPickerValue: pickerValueResponse.viewProps,
  });

  const pickerLayoutResponse = usePickerLayoutProps({
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
