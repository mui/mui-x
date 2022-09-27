import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import MuiInputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import useForkRef from '@mui/utils/useForkRef';
import { PickersPopper } from '../../components/PickersPopper';
import { CalendarOrClockPickerView } from '../../models/views';
import { UseDesktopPickerParams } from './useDesktopPicker.types';
import { useUtils } from '../useUtils';
import { usePicker } from '../usePicker';

export const useDesktopPicker = <TValue, TDate, TView extends CalendarOrClockPickerView>({
  props,
  valueManager,
  renderViews: renderViewsParam,
  getOpenDialogAriaText,
}: UseDesktopPickerParams<TValue, TDate, TView>) => {
  const {
    components,
    componentsProps = {},
    className,
    inputFormat,
    readOnly,
    disabled,
    disableOpenPicker,
  } = props;

  const utils = useUtils<TDate>();

  const {
    fieldProps: pickerStateFieldProps,
    renderViews,
    actions,
    open,
  } = usePicker({ props, valueManager, wrapperVariant: 'desktop', renderViews: renderViewsParam });

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
      onClick: actions.onOpen,
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

  const renderPicker = () => (
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
        {...actions}
        open={open}
        components={components}
        componentsProps={componentsProps}
      >
        {renderViews()}
      </PickersPopper>
    </React.Fragment>
  );

  return { renderPicker };
};
