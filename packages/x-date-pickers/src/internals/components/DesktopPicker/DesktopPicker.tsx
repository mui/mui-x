import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useSlotProps } from '@mui/base/utils';
import { PickersPopper } from '../PickersPopper';
import { useUtils } from '../../hooks/useUtils';
import { PickerViewManager } from '../PickerViewManager';
import { usePickerState2 } from '../../hooks/usePickerState2';
import { CalendarOrClockPickerView } from '../../models/views';
import { Calendar } from '../icons';
import { DesktopPickerProps } from './DesktopPicker.types';

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
    openTo,
    views,
    inputFormat,
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
  const inputRef = React.useRef<HTMLInputElement>(null);

  // TODO: Add prop
  const adornmentPosition = 'end';

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

  const OpenPickerButton = components.OpenPickerButton ?? IconButton;
  const { ownerState: _openPickerButtonOwnerState, ...openPickerButtonProps } = useSlotProps({
    elementType: OpenPickerButton,
    externalSlotProps: componentsProps.openPickerButton,
    additionalProps: {
      disabled: disabled || readOnly,
      onClick: openPicker,
      // TODO: Correctly support date range
      'aria-label': getOpenDialogAriaText(fieldProps.value as any as TDate, utils),
      edge: adornmentPosition,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const OpenPickerIcon = components.OpenPickerIcon ?? Calendar;
  const { ownerState: _openPickerIconOwnerState, ...openPickerIconProps } = useSlotProps({
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
        [`${adornmentPosition}Adornment`]: disableOpenPicker ? undefined : (
          <InputAdornment position={adornmentPosition}>
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

  return (
    <React.Fragment>
      <Field
        {...fieldProps}
        components={{
          Input: components.Input,
        }}
        componentsProps={{ input: inputProps }}
        inputRef={inputRef}
      />
      <PickersPopper
        role="dialog"
        anchorEl={inputRef.current}
        {...wrapperProps}
        onClose={wrapperProps.onDismiss}
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
