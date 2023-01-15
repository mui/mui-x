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
import { PickersLayout } from '../../../PickersLayout';
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
  TExternalProps extends UseDesktopPickerProps<TDate, TView, any, TExternalProps>,
>({
  props,
  valueManager,
  getOpenDialogAriaText,
  validator,
}: UseDesktopPickerParams<TDate, TView, TExternalProps>) => {
  const { slots, slotProps, className, format, readOnly, disabled, autoFocus, localeText } = props;

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
  } = usePicker<TDate | null, TDate, TView, TExternalProps, {}>({
    props,
    inputRef,
    valueManager,
    validator,
    autoFocusView: true,
    additionalViewProps: {},
    wrapperVariant: 'desktop',
  });

  const Field = slots.field;
  const fieldProps: BaseFieldProps<TDate | null, InferError<TExternalProps>> = useSlotProps({
    elementType: Field,
    externalSlotProps: slotProps?.field,
    additionalProps: {
      ...pickerFieldProps,
      readOnly,
      disabled,
      className,
      format,
      autoFocus: autoFocus && !props.open,
    },
    ownerState: props,
  });

  const InputAdornment = slots.inputAdornment ?? MuiInputAdornment;
  const inputAdornmentProps = useSlotProps({
    elementType: InputAdornment,
    externalSlotProps: slotProps?.inputAdornment,
    additionalProps: {
      position: 'end' as const,
    },
    ownerState: props,
  });

  const OpenPickerButton = slots.openPickerButton ?? IconButton;
  const { ownerState: openPickerButtonOwnerState, ...openPickerButtonProps } = useSlotProps({
    elementType: OpenPickerButton,
    externalSlotProps: slotProps?.openPickerButton,
    additionalProps: {
      disabled: disabled || readOnly,
      onClick: actions.onOpen,
      'aria-label': getOpenDialogAriaText(pickerFieldProps.value, utils),
      edge: inputAdornmentProps.position,
    },
    ownerState: props,
  });

  const OpenPickerIcon = slots.openPickerIcon;

  const slotsForField: BaseFieldProps<TDate | null, unknown>['slots'] = {
    textField: slots.textField,
    ...fieldProps.slots,
  };

  const slotPropsForField: BaseFieldProps<TDate | null, unknown>['slotProps'] = {
    ...fieldProps.slotProps,
    textField: (ownerState) => {
      const externalInputProps = resolveComponentProps(slotProps?.textField, ownerState);
      const inputPropsPassedByField = resolveComponentProps(
        fieldProps.slotProps?.textField,
        ownerState,
      );

      return {
        ...inputPropsPassedByField,
        ...externalInputProps,
        InputProps: {
          [`${inputAdornmentProps.position}Adornment`]: hasUIView ? (
            <InputAdornment {...inputAdornmentProps}>
              <OpenPickerButton {...openPickerButtonProps}>
                <OpenPickerIcon {...slotProps?.openPickerIcon} />
              </OpenPickerButton>
            </InputAdornment>
          ) : undefined,
          ...inputPropsPassedByField?.InputProps,
          ...externalInputProps?.InputProps,
        },
      };
    },
  };

  const Layout = slots.layout ?? PickersLayout;

  const handleInputRef = useForkRef(inputRef, fieldProps.inputRef);

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="desktop">
        <Field
          {...fieldProps}
          slots={slotsForField}
          slotProps={slotPropsForField}
          inputRef={handleInputRef}
        />
        <PickersPopper
          role="dialog"
          anchorEl={inputRef.current}
          {...actions}
          open={open}
          slots={{
            ...slots,
            // Avoids to render 2 action bar, will be removed once `PickersPopper` stop displaying the action bar.
            actionBar: () => null,
          }}
          slotProps={{
            ...slotProps,
            actionBar: undefined,
          }}
          shouldRestoreFocus={shouldRestoreFocus}
        >
          <Layout {...layoutProps} {...slotProps?.layout} slots={slots} slotProps={slotProps}>
            {renderCurrentView()}
          </Layout>
        </PickersPopper>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};
