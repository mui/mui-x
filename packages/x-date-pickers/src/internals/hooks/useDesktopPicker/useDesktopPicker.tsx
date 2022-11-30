import * as React from 'react';
import { resolveComponentProps, useSlotProps } from '@mui/base/utils';
import MuiInputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import useForkRef from '@mui/utils/useForkRef';
import { PickersPopper } from '../../components/PickersPopper';
import { DateOrTimeView } from '../../models/views';
import { UseDesktopPickerParams, UseDesktopPickerProps } from './useDesktopPicker.types';
import { useUtils } from '../useUtils';
import { usePicker } from '../usePicker';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { WrapperVariantContext } from '../../components/wrappers/WrapperVariantContext';
import { BaseFieldProps } from '../../models/fields';
import { PickersViewLayout } from '../../components/PickersViewLayout';
import { InferError } from '../validation/useValidation';

/**
 * Hook managing all the single-date desktop pickers:
 * - DesktopDatePicker
 * - DesktopDateTimePicker
 * - DesktopTimePicker
 */
export const useDesktopPicker = <
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseDesktopPickerProps<TDate, TView, any>,
>({
  props,
  valueManager,
  getOpenDialogAriaText,
  viewLookup,
  validator,
}: UseDesktopPickerParams<TDate, TView, TExternalProps>) => {
  const { components, componentsProps, className, format, readOnly, disabled, localeText } = props;

  const utils = useUtils<TDate>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    open,
    actions,
    hasUIView,
    layoutProps,
    renderCurrentView,
    shouldRestoreFocus,
    fieldProps: pickerFieldProps,
  } = usePicker({
    props,
    inputRef,
    viewLookup,
    valueManager,
    validator,
    additionalViewProps: {},
    wrapperVariant: 'desktop',
  });

  const Field = components.Field;
  const fieldProps: BaseFieldProps<TDate | null, InferError<TExternalProps>> = useSlotProps({
    elementType: Field,
    externalSlotProps: componentsProps?.field,
    additionalProps: {
      ...pickerFieldProps,
      readOnly,
      disabled,
      className,
      format,
    },
    ownerState: props,
  });

  const InputAdornment = components.InputAdornment ?? MuiInputAdornment;
  const inputAdornmentProps = useSlotProps({
    elementType: InputAdornment,
    externalSlotProps: componentsProps?.inputAdornment,
    additionalProps: {
      position: 'end' as const,
    },
    ownerState: props,
  });

  const OpenPickerButton = components.OpenPickerButton ?? IconButton;
  const { ownerState: openPickerButtonOwnerState, ...openPickerButtonProps } = useSlotProps({
    elementType: OpenPickerButton,
    externalSlotProps: componentsProps?.openPickerButton,
    additionalProps: {
      disabled: disabled || readOnly,
      onClick: actions.onOpen,
      'aria-label': getOpenDialogAriaText(pickerFieldProps.value, utils),
      edge: inputAdornmentProps.position,
    },
    ownerState: props,
  });

  const OpenPickerIcon = components.OpenPickerIcon;

  const componentsForField: BaseFieldProps<TDate | null, unknown>['components'] = {
    ...fieldProps.components,
    Input: components.Input,
  };

  const componentsPropsForField: BaseFieldProps<TDate | null, unknown>['componentsProps'] = {
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
        InputProps: {
          [`${inputAdornmentProps.position}Adornment`]: hasUIView ? (
            <InputAdornment {...inputAdornmentProps}>
              <OpenPickerButton {...openPickerButtonProps}>
                <OpenPickerIcon {...componentsProps?.openPickerIcon} />
              </OpenPickerButton>
            </InputAdornment>
          ) : undefined,
          ...inputPropsPassedByField?.InputProps,
          ...externalInputProps?.InputProps,
        },
      };
    },
  };

  const handleInputRef = useForkRef(inputRef, fieldProps.inputRef);

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="desktop">
        <Field
          {...fieldProps}
          components={componentsForField}
          componentsProps={componentsPropsForField}
          inputRef={handleInputRef}
        />
        <PickersPopper
          role="dialog"
          anchorEl={inputRef.current}
          {...actions}
          open={open}
          components={{
            ...components,
            // Avoids to render 2 action bar, will be removed once `PickersPopper` stop displaying the action bar.
            ActionBar: () => null,
          }}
          componentsProps={{
            ...componentsProps,
            actionBar: undefined,
          }}
          shouldRestoreFocus={shouldRestoreFocus}
        >
          <PickersViewLayout
            {...layoutProps}
            components={components}
            componentsProps={componentsProps}
          >
            {renderCurrentView()}
          </PickersViewLayout>
        </PickersPopper>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};
