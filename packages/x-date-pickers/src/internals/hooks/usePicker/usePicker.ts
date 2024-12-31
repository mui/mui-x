import { warnOnce } from '@mui/x-internals/warning';
import { UsePickerParams, UsePickerProps, UsePickerResponse } from './usePicker.types';
import { usePickerValue } from './usePickerValue';
import { usePickerViews } from './usePickerViews';
import { InferError } from '../../../models';
import { DateOrTimeViewWithMeridiem, PickerValidValue } from '../../models';
import { usePickerProvider } from './usePickerProvider';

export const usePicker = <
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerProps<TValue, TView, any, any>,
>({
  props,
  valueManager,
  valueType,
  variant,
  validator,
  autoFocusView,
  rendererInterceptor,
  fieldRef,
  localeText,
}: UsePickerParams<TValue, TView, TExternalProps>): UsePickerResponse<
  TValue,
  TView,
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
  const pickerValueResponse = usePickerValue<TValue, TExternalProps>({
    props,
    valueManager,
    valueType,
    variant,
    validator,
  });

  const pickerViewsResponse = usePickerViews<TValue, TView, TExternalProps>({
    props,
    autoFocusView,
    fieldRef,
    propsFromPickerValue: pickerValueResponse.viewProps,
    rendererInterceptor,
  });

  const providerProps = usePickerProvider({
    props,
    localeText,
    valueManager,
    variant,
    paramsFromUsePickerValue: pickerValueResponse.provider,
    paramsFromUsePickerViews: pickerViewsResponse.provider,
  });

  return {
    // Picker value
    fieldProps: pickerValueResponse.fieldProps,

    // Picker views
    renderCurrentView: pickerViewsResponse.renderCurrentView,
    hasUIView: pickerViewsResponse.provider.hasUIView,
    shouldRestoreFocus: pickerViewsResponse.shouldRestoreFocus,

    // Picker provider
    providerProps,

    // Picker owner state
    ownerState: providerProps.privateContextValue.ownerState,
  };
};
