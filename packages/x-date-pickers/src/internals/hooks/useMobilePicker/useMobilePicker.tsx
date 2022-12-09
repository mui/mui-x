import * as React from 'react';
import { resolveComponentProps, useSlotProps } from '@mui/base/utils';
import useForkRef from '@mui/utils/useForkRef';
import { PickersModalDialog } from '../../components/PickersModalDialog';
import { DateOrTimeView } from '../../models';
import { UseMobilePickerParams, UseMobilePickerProps } from './useMobilePicker.types';
import { usePicker } from '../usePicker';
import { onSpaceOrEnter } from '../../utils/utils';
import { useUtils } from '../useUtils';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { WrapperVariantContext } from '../../components/wrappers/WrapperVariantContext';
import { BaseFieldProps } from '../../models/fields';
import { PickersViewLayout } from '../../components/PickersViewLayout';
import { InferError } from '../validation/useValidation';

/**
 * Hook managing all the single-date mobile pickers:
 * - MobileDatePicker
 * - MobileDateTimePicker
 * - MobileTimePicker
 */
export const useMobilePicker = <
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseMobilePickerProps<TDate, TView, any>,
>({
  props,
  valueManager,
  getOpenDialogAriaText,
  viewLookup,
  validator,
}: UseMobilePickerParams<TDate, TView, TExternalProps>) => {
  const { components, componentsProps, className, format, disabled, localeText } = props;

  const utils = useUtils<TDate>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    open,
    actions,
    layoutProps,
    renderCurrentView,
    fieldProps: pickerFieldProps,
  } = usePicker({
    props,
    inputRef,
    viewLookup,
    valueManager,
    validator,
    additionalViewProps: {},
    wrapperVariant: 'mobile',
  });

  const Field = components.Field;
  const fieldProps: BaseFieldProps<TDate | null, InferError<TExternalProps>> = useSlotProps({
    elementType: Field,
    externalSlotProps: componentsProps?.field,
    additionalProps: {
      ...pickerFieldProps,
      readOnly: true,
      disabled,
      className,
      format,
    },
    ownerState: props,
  });

  const componentsPropsForField: BaseFieldProps<TDate, unknown>['componentsProps'] = {
    ...fieldProps.componentsProps,
    input: (ownerState) => {
      const externalInputProps = resolveComponentProps(componentsProps?.input, ownerState);
      const inputPropsPassedByField = resolveComponentProps(
        fieldProps.componentsProps?.input,
        ownerState,
      );

      return {
        ...inputPropsPassedByField,
        ...externalInputProps,
        disabled: props.disabled,
        onClick: props.readOnly || props.disabled ? undefined : actions.onOpen,
        onKeyDown: onSpaceOrEnter(actions.onOpen),
        inputProps: {
          'aria-label': getOpenDialogAriaText(pickerFieldProps.value, utils),
          ...inputPropsPassedByField?.inputProps,
          ...externalInputProps?.inputProps,
        },
      };
    },
  };

  const componentsForField: BaseFieldProps<TDate, unknown>['components'] = {
    ...fieldProps.components,
    Input: components.Input,
  };

  const handleInputRef = useForkRef(inputRef, fieldProps.inputRef);

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="mobile">
        <Field
          {...fieldProps}
          components={componentsForField}
          componentsProps={componentsPropsForField}
          inputRef={handleInputRef}
        />
        <PickersModalDialog
          {...actions}
          open={open}
          components={{
            ...components,
            // Avoids to render 2 action bar, will be removed once `PickersModalDialog` stop displaying the action bar.
            ActionBar: () => null,
          }}
          componentsProps={{
            ...componentsProps,
            actionBar: undefined,
          }}
        >
          <PickersViewLayout
            {...layoutProps}
            components={components}
            componentsProps={componentsProps}
          >
            {renderCurrentView()}
          </PickersViewLayout>
        </PickersModalDialog>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};
