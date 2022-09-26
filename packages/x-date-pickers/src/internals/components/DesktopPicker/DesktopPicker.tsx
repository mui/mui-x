import * as React from 'react';
import MuiInputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useSlotProps } from '@mui/base/utils';
import { PickersPopper } from '../PickersPopper';
import { useUtils } from '../../hooks/useUtils';
import { PickerViewManager } from '../PickerViewManager';
import { usePickerState2 } from '../../hooks/usePickerState2';
import { CalendarOrClockPickerView } from '../../models/views';
import { DesktopPickerProps } from './DesktopPicker.types';
import useForkRef from '@mui/utils/useForkRef';

export function DesktopPicker<TValue, TDate, TView extends CalendarOrClockPickerView>(
  props: DesktopPickerProps<TValue, TDate, TView>,
) {
  const {
    // Props provided by the picker
    getOpenDialogAriaText,
    renderViews,
    valueManager,

    // Props provided outside the picker
    components,
    componentsProps = {},
    className,
    inputFormat,
    openTo,
    views,
    onViewChange,
    readOnly,
    disabled,
    disableOpenPicker,
  } = props;

  const utils = useUtils<TDate>();

  const {
    wrapperProps,
    fieldProps: pickerStateFieldProps,
    viewProps,
    openPicker,
  } = usePickerState2(props, valueManager, 'desktop');

  const Field = components.Field;
  const fieldProps = useSlotProps({
    elementType: Field,
    externalSlotProps: componentsProps.field,
    additionalProps: {
      ...pickerStateFieldProps,
      readOnly,
      disabled,
      className,
      format: inputFormat,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const InputAdornment = components.InputAdornment ?? MuiInputAdornment;
  const inputAdornmentProps = useSlotProps({
    elementType: InputAdornment,
    externalSlotProps: componentsProps.inputAdornment,
    additionalProps: {
      position: 'end',
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const OpenPickerButton = components.OpenPickerButton ?? IconButton;
  const { ownerState: openPickerButtonOwnerState, ...openPickerButtonProps } = useSlotProps({
    elementType: OpenPickerButton,
    externalSlotProps: componentsProps.openPickerButton,
    additionalProps: {
      disabled: disabled || readOnly,
      onClick: openPicker,
      // TODO: Correctly support date range
      'aria-label': getOpenDialogAriaText(fieldProps.value as any as TDate, utils),
      edge: inputAdornmentProps.position,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const OpenPickerIcon = components.OpenPickerIcon;
  const { ownerState: openPickerIconOwnerState, ...openPickerIconProps } = useSlotProps({
    elementType: OpenPickerIcon,
    externalSlotProps: componentsProps.openPickerIcon,
    // TODO: Pass owner state
    ownerState: {},
  });

  const Input = components.Input!;
  const inputProps = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps.input,
    additionalProps: {
      InputProps: {
        [`${inputAdornmentProps.position}Adornment`]: disableOpenPicker ? undefined : (
          <InputAdornment {...inputAdornmentProps}>
            <OpenPickerButton {...openPickerButtonProps}>
              <OpenPickerIcon {...openPickerIconProps} />
            </OpenPickerButton>
          </InputAdornment>
        ),
      },
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const inputRef = React.useRef<HTMLInputElement>(null);
  // TODO: Correctly type the field slot
  const handleInputRef = useForkRef(inputRef, (fieldProps as any).inputRef);

  return (
    <React.Fragment>
      <Field
        {...fieldProps}
        components={{
          Input: components.Input,
        }}
        componentsProps={{ input: inputProps }}
        inputRef={handleInputRef}
      />
      <PickersPopper
        role="dialog"
        anchorEl={inputRef.current}
        {...wrapperProps}
        components={components}
        componentsProps={componentsProps}
      >
        <PickerViewManager
          openTo={openTo}
          views={views}
          onViewChange={onViewChange}
          renderViews={renderViews}
          readOnly={readOnly}
          disabled={disabled}
          {...viewProps}
        />
      </PickersPopper>
    </React.Fragment>
  );
}
