import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';
import MuiIconButton, { IconButtonProps } from '@mui/material/IconButton';
import MuiInputAdornment, { InputAdornmentProps } from '@mui/material/InputAdornment';
import { SvgIconProps } from '@mui/material/SvgIcon';
import useSlotProps from '@mui/utils/useSlotProps';
import { MakeOptional, SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { FieldOwnerState } from '../../models';
import { useFieldOwnerState } from '../hooks/useFieldOwnerState';
import { usePickerTranslations } from '../../hooks';
import { ClearIcon as MuiClearIcon } from '../../icons';
import { useNullablePickerContext } from '../hooks/useNullablePickerContext';
import type { UseFieldResponse } from '../hooks/useField';
import { PickersTextField, PickersTextFieldProps } from '../../PickersTextField';

export const cleanFieldResponse = <
  TFieldResponse extends UseFieldResponse<any, ExportedPickerFieldUIProps & { [key: string]: any }>,
>({
  enableAccessibleFieldDOMStructure,
  ...fieldResponse
}: TFieldResponse): ExportedPickerFieldUIProps & {
  openPickerAriaLabel: string;
  textFieldProps: TextFieldProps | PickersTextFieldProps;
} => {
  if (enableAccessibleFieldDOMStructure) {
    const {
      InputProps,
      readOnly,
      onClear,
      clearable,
      clearButtonPosition,
      openPickerButtonPosition,
      openPickerAriaLabel,
      ...other
    } = fieldResponse;

    return {
      clearable,
      onClear,
      clearButtonPosition,
      openPickerButtonPosition,
      openPickerAriaLabel,
      textFieldProps: {
        ...other,
        InputProps: { ...(InputProps ?? {}), readOnly },
      },
    };
  }

  const {
    onPaste,
    onKeyDown,
    inputMode,
    readOnly,
    InputProps,
    inputProps,
    inputRef,
    onClear,
    clearable,
    clearButtonPosition,
    openPickerButtonPosition,
    openPickerAriaLabel,
    ...other
  } = fieldResponse;

  return {
    clearable,
    onClear,
    clearButtonPosition,
    openPickerButtonPosition,
    openPickerAriaLabel,
    textFieldProps: {
      ...other,
      InputProps: { ...(InputProps ?? {}), readOnly },
      inputProps: { ...(inputProps ?? {}), inputMode, onPaste, onKeyDown, ref: inputRef },
    },
  };
};

/**
 * Adds the button to open the picker and the button to clear the value of the field.
 * @ignore - internal component.
 */
export function PickerFieldUI(props: PickerFieldUIProps) {
  const { slots, slotProps, fieldResponse } = props;

  const translations = usePickerTranslations();
  const pickerContext = useNullablePickerContext();
  const {
    textFieldProps,
    onClear,
    clearable,
    openPickerAriaLabel,
    clearButtonPosition: clearButtonPositionProp = 'end',
    openPickerButtonPosition: openPickerButtonPositionProp = 'end',
  } = cleanFieldResponse(fieldResponse);
  const ownerState = useFieldOwnerState(textFieldProps);

  const handleTogglePicker = useEventCallback(() => pickerContext?.setOpen((prev) => !prev));

  const triggerStatus = pickerContext ? pickerContext.triggerStatus : 'hidden';
  const clearButtonPosition = clearable ? clearButtonPositionProp : null;
  const openPickerButtonPosition = triggerStatus !== 'hidden' ? openPickerButtonPositionProp : null;

  const TextField =
    slots.textField ??
    (fieldResponse.enableAccessibleFieldDOMStructure === false ? MuiTextField : PickersTextField);

  const InputAdornment = slots.inputAdornment ?? MuiInputAdornment;
  const { ownerState: startInputAdornmentOwnerState, ...startInputAdornmentProps } = useSlotProps({
    elementType: InputAdornment,
    externalSlotProps: slotProps?.inputAdornment,
    additionalProps: {
      position: 'start' as const,
    },
    ownerState: { ...ownerState, position: 'start' },
  });
  const { ownerState: endInputAdornmentOwnerState, ...endInputAdornmentProps } = useSlotProps({
    elementType: InputAdornment,
    externalSlotProps: slotProps?.inputAdornment,
    additionalProps: {
      position: 'end' as const,
    },
    ownerState: { ...ownerState, position: 'end' },
  });

  const OpenPickerButton = slots.openPickerButton ?? MuiIconButton;
  // We don't want to forward the `ownerState` to the `<IconButton />` component, see mui/material-ui#34056
  const {
    ownerState: openPickerButtonOwnerState,
    ...openPickerButtonProps
  }: IconButtonProps & { ownerState: any } = useSlotProps({
    elementType: OpenPickerButton,
    externalSlotProps: slotProps?.openPickerButton,
    additionalProps: {
      disabled: triggerStatus === 'disabled',
      onClick: handleTogglePicker,
      'aria-label': openPickerAriaLabel,
      edge:
        clearButtonPosition === 'start' && openPickerButtonPosition === 'start'
          ? undefined
          : openPickerButtonPosition,
    },
    ownerState,
  });

  const OpenPickerIcon = slots.openPickerIcon;
  const openPickerIconProps = useSlotProps({
    elementType: OpenPickerIcon,
    externalSlotProps: slotProps?.openPickerIcon,
    ownerState,
  });

  const ClearButton = slots.clearButton ?? MuiIconButton;
  // We don't want to forward the `ownerState` to the `<IconButton />` component, see mui/material-ui#34056
  const { ownerState: clearButtonOwnerState, ...clearButtonProps } = useSlotProps({
    elementType: ClearButton,
    externalSlotProps: slotProps?.clearButton,
    className: 'clearButton',
    additionalProps: {
      title: translations.fieldClearLabel,
      tabIndex: -1,
      onClick: onClear,
      edge:
        clearButtonPosition === 'end' && openPickerButtonPosition === 'end'
          ? undefined
          : clearButtonPosition,
    },
    ownerState,
  });

  const ClearIcon = slots.clearIcon ?? MuiClearIcon;
  const clearIconProps = useSlotProps({
    elementType: ClearIcon,
    externalSlotProps: slotProps?.clearIcon,
    additionalProps: {
      fontSize: 'small',
    },
    ownerState,
  });

  if (!textFieldProps.InputProps) {
    textFieldProps.InputProps = {};
  }

  if (pickerContext) {
    textFieldProps.InputProps.ref = pickerContext.triggerRef;
  }

  if (
    !textFieldProps.InputProps?.startAdornment &&
    (clearButtonPosition === 'start' || openPickerButtonPosition === 'start')
  ) {
    textFieldProps.InputProps.startAdornment = (
      <InputAdornment {...startInputAdornmentProps}>
        {openPickerButtonPosition === 'start' && (
          <OpenPickerButton {...openPickerButtonProps}>
            <OpenPickerIcon {...openPickerIconProps} />
          </OpenPickerButton>
        )}
        {clearButtonPosition === 'start' && (
          <ClearButton {...clearButtonProps}>
            <ClearIcon {...clearIconProps} />
          </ClearButton>
        )}
      </InputAdornment>
    );
  }

  if (
    !textFieldProps.InputProps?.endAdornment &&
    (clearButtonPosition === 'end' || openPickerButtonPosition === 'end')
  ) {
    textFieldProps.InputProps.endAdornment = (
      <InputAdornment {...endInputAdornmentProps}>
        {clearButtonPosition === 'end' && (
          <ClearButton {...clearButtonProps}>
            <ClearIcon {...clearIconProps} />
          </ClearButton>
        )}
        {openPickerButtonPosition === 'end' && (
          <OpenPickerButton {...openPickerButtonProps}>
            <OpenPickerIcon {...openPickerIconProps} />
          </OpenPickerButton>
        )}
      </InputAdornment>
    );
  }

  return <TextField {...textFieldProps} />;
}

export interface ExportedPickerFieldUIProps {
  /**
   * If `true`, a clear button will be shown in the field allowing value clearing.
   * @default false
   */
  clearable?: boolean;
  /**
   * Callback fired when the clear button is clicked.
   */
  onClear?: React.MouseEventHandler;
  /**
   * The position at which the clear button is placed.
   * If the field is not clearable, the button is not rendered.
   * @default 'end'
   */
  clearButtonPosition?: 'start' | 'end';
  /**
   * The position at which the opening button is placed.
   * If there is no picker to open, the button is not rendered
   * @default 'end'
   */
  openPickerButtonPosition?: 'start' | 'end';
}

export interface PickerFieldUIProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PickerFieldUISlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PickerFieldUISlotProps;
  /**
   * Object returned by the `useField` hook or one of its wrapper (for example `useDateField`).
   */
  fieldResponse: UseFieldResponse<any, any>;
}

interface PickerFieldUISlots {
  /**
   * Form control with an input to render the value.
   * @default <PickersTextField />, or <TextField /> from '@mui/material' if `enableAccessibleFieldDOMStructure` is `false`.
   */
  textField?: React.ElementType;
  /**
   * Component displayed on the start or end input adornment used to open the picker on desktop.
   * @default InputAdornment
   */
  inputAdornment?: React.ElementType<InputAdornmentProps>;
  /**
   * Button to open the picker on desktop.
   * @default IconButton
   */
  openPickerButton?: React.ElementType<IconButtonProps>;
  /**
   * Icon displayed in the open picker button on desktop.
   */
  openPickerIcon: React.ElementType;
  /**
   * Icon to display inside the clear button.
   * @default ClearIcon
   */
  clearIcon?: React.ElementType;
  /**
   * Button to clear the value.
   * @default IconButton
   */
  clearButton?: React.ElementType;
}

export interface ExportedPickerFieldUISlots
  extends MakeOptional<PickerFieldUISlots, 'openPickerIcon'> {}

export interface PickerFieldUISlotProps {
  textField?: SlotComponentPropsFromProps<
    PickersTextFieldProps | TextFieldProps,
    {},
    FieldOwnerState
  >;
  inputAdornment?: SlotComponentPropsFromProps<
    InputAdornmentProps,
    {},
    FieldInputAdornmentOwnerState
  >;
  openPickerButton?: SlotComponentPropsFromProps<IconButtonProps, {}, FieldOwnerState>;
  openPickerIcon?: SlotComponentPropsFromProps<SvgIconProps, {}, FieldOwnerState>;
  clearIcon?: SlotComponentPropsFromProps<SvgIconProps, {}, FieldOwnerState>;
  clearButton?: SlotComponentPropsFromProps<IconButtonProps, {}, FieldOwnerState>;
}

interface FieldInputAdornmentOwnerState extends FieldOwnerState {
  position: 'start' | 'end';
}
