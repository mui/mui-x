import { warnOnce } from '@mui/x-internals/warning';
import { UsePickerParams, UsePickerProps, UsePickerResponse } from './usePicker.types';
import { usePickerValue } from './usePickerValue';
import { usePickerViews } from './usePickerViews';
import { FieldSection, InferError } from '../../../models';
import { DateOrTimeViewWithMeridiem } from '../../models';
import { usePickerProvider } from './usePickerProvider';

export const usePicker = <
  TValue,
  TView extends DateOrTimeViewWithMeridiem,
  TSection extends FieldSection,
  TExternalProps extends UsePickerProps<TValue, TView, any, any, any>,
  TAdditionalProps extends {},
>({
  props,
  valueManager,
  valueType,
  variant,
  additionalViewProps,
  validator,
  autoFocusView,
  rendererInterceptor,
  fieldRef,
  localeText,
}: UsePickerParams<TValue, TView, TSection, TExternalProps, TAdditionalProps>): UsePickerResponse<
  TValue,
  TView,
  TSection,
  InferError<TExternalProps>
> => {
  if (process.env.NODE_ENV !== 'production') {
    if ((props as any).renderInput != null) {
      warnOnce([
        'MUI X: The `renderInput` prop has been removed in version 6.0 of the Date and Time Pickers.',
        'You can replace it with the `textField` component slot in most cases.',
        'For more information, please have a look at the migration guide (https://mui.com/x/migration/migration-pickers-v5/#input-renderer-required-in-v5).',
      ]);
    }
  }
  const pickerValueResponse = usePickerValue<TValue, TSection, TExternalProps>({
    props,
    valueManager,
    valueType,
    variant,
    validator,
  });

  const pickerViewsResponse = usePickerViews<
    TValue,
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

  const providerProps = usePickerProvider({
    props,
    pickerValueResponse,
    localeText,
    valueManager,
    variant,
    views: pickerViewsResponse.views,
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
    layoutProps: {
      ...pickerViewsResponse.layoutProps,
      ...pickerValueResponse.layoutProps,
    },

    // Picker provider
    providerProps,

    // Picker owner state
    ownerState: providerProps.privateContextValue.ownerState,
  };
};
