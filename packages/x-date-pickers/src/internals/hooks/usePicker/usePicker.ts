import { UsePickerParams, UsePickerProps, UsePickerResponse } from './usePicker.types';
import { usePickerValue } from './usePickerValue';
import { usePickerViews } from './usePickerViews';
import { usePickerLayoutProps } from './usePickerLayoutProps';
import { InferError } from '../useValidation';
import { warnOnce } from '../../utils/warning';
import { FieldSection, PickerValidDate } from '../../../models';
import { DateOrTimeViewWithMeridiem } from '../../models';

export const usePicker = <
  TValue,
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
  TSection extends FieldSection,
  TExternalProps extends UsePickerProps<TValue, TDate, TView, any, any, any>,
  TAdditionalProps extends {},
>({
  props,
  valueManager,
  valueType,
  wrapperVariant,
  additionalViewProps,
  validator,
  autoFocusView,
  rendererInterceptor,
  fieldRef,
}: UsePickerParams<
  TValue,
  TDate,
  TView,
  TSection,
  TExternalProps,
  TAdditionalProps
>): UsePickerResponse<TValue, TView, TSection, InferError<TExternalProps>> => {
  if (process.env.NODE_ENV !== 'production') {
    if ((props as any).renderInput != null) {
      warnOnce([
        'MUI X: The `renderInput` prop has been removed in version 6.0 of the Date and Time Pickers.',
        'You can replace it with the `textField` component slot in most cases.',
        'For more information, please have a look at the migration guide (https://mui.com/x/migration/migration-pickers-v5/#input-renderer-required-in-v5).',
      ]);
    }
  }
  const pickerValueResponse = usePickerValue({
    props,
    valueManager,
    valueType,
    wrapperVariant,
    validator,
  });

  const pickerViewsResponse = usePickerViews<
    TValue,
    TDate,
    TView,
    TSection,
    TExternalProps,
    TAdditionalProps
  >({
    props,
    additionalViewProps,
    autoFocusView,
    fieldRef,
    propsFromPickerValue: pickerValueResponse.viewProps,
    rendererInterceptor,
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
