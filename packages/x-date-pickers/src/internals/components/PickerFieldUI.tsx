import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';
import MuiIconButton, { IconButtonProps } from '@mui/material/IconButton';
import MuiInputAdornment, { InputAdornmentProps } from '@mui/material/InputAdornment';
import { SvgIconProps } from '@mui/material/SvgIcon';
import useSlotProps from '@mui/utils/useSlotProps';
import { MakeOptional, SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { FieldOwnerState } from '../../models';
import { useFieldOwnerState, UseFieldOwnerStateParameters } from '../hooks/useFieldOwnerState';
import { usePickerTranslations } from '../../hooks';
import { ClearIcon as MuiClearIcon } from '../../icons';
import { useNullablePickerContext } from '../hooks/useNullablePickerContext';
import type { UseFieldReturnValue, UseFieldProps } from '../hooks/useField';
import { PickersTextField, PickersTextFieldProps } from '../../PickersTextField';

export const cleanFieldResponse = <
  TFieldResponse extends MakeOptional<
    UseFieldReturnValue<any, ExportedPickerFieldUIProps & { [key: string]: any }>,
    'onClear' | 'clearable'
  >,
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

export const PickerFieldUIContext = React.createContext<PickerFieldUIContextValue>({
  slots: {},
  slotProps: {},
  inputRef: undefined,
});

/**
 * Adds the button to open the Picker and the button to clear the value of the field.
 * @ignore - internal component.
 */
export function PickerFieldUI<
  TEnableAccessibleFieldDOMStructure extends boolean,
  TProps extends UseFieldProps<TEnableAccessibleFieldDOMStructure>,
>(props: PickerFieldUIProps<TEnableAccessibleFieldDOMStructure, TProps>) {
  const { slots, slotProps, fieldResponse, defaultOpenPickerIcon } = props;

  const translations = usePickerTranslations();
  const pickerContext = useNullablePickerContext();
  const pickerFieldUIContext = React.useContext(PickerFieldUIContext);
  const {
    textFieldProps,
    onClear,
    clearable,
    openPickerAriaLabel,
    clearButtonPosition: clearButtonPositionProp = 'end',
    openPickerButtonPosition: openPickerButtonPositionProp = 'end',
  } = cleanFieldResponse(fieldResponse);
  const ownerState = useFieldOwnerState(textFieldProps);

  const handleClickOpeningButton = useEventCallback((event: React.MouseEvent) => {
    event.preventDefault();
    pickerContext?.setOpen((prev) => !prev);
  });

  const triggerStatus = pickerContext ? pickerContext.triggerStatus : 'hidden';
  const clearButtonPosition = clearable ? clearButtonPositionProp : null;
  const openPickerButtonPosition = triggerStatus !== 'hidden' ? openPickerButtonPositionProp : null;

  const TextField =
    slots?.textField ??
    pickerFieldUIContext.slots.textField ??
    (fieldResponse.enableAccessibleFieldDOMStructure === false ? MuiTextField : PickersTextField);

  const InputAdornment =
    slots?.inputAdornment ?? pickerFieldUIContext.slots.inputAdornment ?? MuiInputAdornment;
  const { ownerState: startInputAdornmentOwnerState, ...startInputAdornmentProps } = useSlotProps({
    elementType: InputAdornment,
    externalSlotProps: mergeSlotProps(
      pickerFieldUIContext.slotProps.inputAdornment,
      slotProps?.inputAdornment,
    ),
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

  const OpenPickerButton = pickerFieldUIContext.slots.openPickerButton ?? MuiIconButton;
  // We don't want to forward the `ownerState` to the `<IconButton />` component, see mui/material-ui#34056
  const {
    ownerState: openPickerButtonOwnerState,
    ...openPickerButtonProps
  }: IconButtonProps & { ownerState: any } = useSlotProps({
    elementType: OpenPickerButton,
    externalSlotProps: pickerFieldUIContext.slotProps.openPickerButton,
    additionalProps: {
      disabled: triggerStatus === 'disabled',
      onClick: handleClickOpeningButton,
      'aria-label': openPickerAriaLabel,
      edge:
        // open button is always rendered at the edge
        textFieldProps.variant !== 'standard' ? openPickerButtonPosition : false,
    },
    ownerState,
  });

  const OpenPickerIcon = pickerFieldUIContext.slots.openPickerIcon ?? defaultOpenPickerIcon;
  const openPickerIconProps = useSlotProps({
    elementType: OpenPickerIcon,
    externalSlotProps: pickerFieldUIContext.slotProps.openPickerIcon,
    ownerState,
  });

  const ClearButton = slots?.clearButton ?? pickerFieldUIContext.slots.clearButton ?? MuiIconButton;
  // We don't want to forward the `ownerState` to the `<IconButton />` component, see mui/material-ui#34056
  const { ownerState: clearButtonOwnerState, ...clearButtonProps } = useSlotProps({
    elementType: ClearButton,
    externalSlotProps: mergeSlotProps(
      pickerFieldUIContext.slotProps.clearButton,
      slotProps?.clearButton,
    ),
    className: 'clearButton',
    additionalProps: {
      title: translations.fieldClearLabel,
      tabIndex: -1,
      onClick: onClear,
      disabled: fieldResponse.disabled || fieldResponse.readOnly,
      edge:
        // clear button can only be at the edge if it's position differs from the open button
        textFieldProps.variant !== 'standard' && clearButtonPosition !== openPickerButtonPosition
          ? clearButtonPosition
          : false,
    },
    ownerState,
  });

  const ClearIcon = slots?.clearIcon ?? pickerFieldUIContext.slots.clearIcon ?? MuiClearIcon;
  const clearIconProps = useSlotProps({
    elementType: ClearIcon,
    externalSlotProps: mergeSlotProps(
      pickerFieldUIContext.slotProps.clearIcon,
      slotProps?.clearIcon,
    ),
    additionalProps: {
      fontSize: 'small',
    },
    ownerState,
  });

  textFieldProps.ref = useForkRef(textFieldProps.ref, pickerContext?.rootRef);

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

  if (clearButtonPosition != null) {
    textFieldProps.sx = [
      {
        '& .clearButton': {
          opacity: 1,
        },
        '@media (pointer: fine)': {
          '& .clearButton': {
            opacity: 0,
          },
          '&:hover, &:focus-within': {
            '.clearButton': {
              opacity: 1,
            },
          },
        },
      },
      ...(Array.isArray(textFieldProps.sx) ? textFieldProps.sx : [textFieldProps.sx]),
    ];
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
   * If there is no Picker to open, the button is not rendered
   * @default 'end'
   */
  openPickerButtonPosition?: 'start' | 'end';
}

export interface PickerFieldUIProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
  TProps extends UseFieldProps<TEnableAccessibleFieldDOMStructure>,
> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: PickerFieldUISlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PickerFieldUISlotProps;
  /**
   * Object returned by the `useField` hook or one of its wrapper (for example `useDateField`).
   */
  fieldResponse: UseFieldReturnValue<TEnableAccessibleFieldDOMStructure, TProps>;
  /**
   * The component to use to render the Picker opening icon if none is provided in the Picker's slots.
   */
  defaultOpenPickerIcon: React.ElementType;
}

export interface PickerFieldUISlots {
  /**
   * Form control with an input to render the value.
   * @default <PickersTextField />, or <TextField /> from '@mui/material' if `enableAccessibleFieldDOMStructure` is `false`.
   */
  textField?: React.ElementType;
  /**
   * Component displayed on the start or end input adornment used to open the Picker.
   * @default InputAdornment
   */
  inputAdornment?: React.ElementType<InputAdornmentProps>;
  /**
   * Button to clear the value.
   * @default IconButton
   */
  clearButton?: React.ElementType;
  /**
   * Icon to display in the button used to clean the value.
   * @default ClearIcon
   */
  clearIcon?: React.ElementType;
}

export interface PickerFieldUISlotsFromContext extends PickerFieldUISlots {
  /**
   * Button to open the Picker.
   * @default IconButton
   */
  openPickerButton?: React.ElementType<IconButtonProps>;
  /**
   * Icon to display in the button used to open the Picker.
   */
  openPickerIcon?: React.ElementType;
}

export interface PickerFieldUISlotProps {
  textField?: SlotComponentPropsFromProps<
    Omit<TextFieldProps, 'onKeyDown'> | PickersTextFieldProps,
    {},
    FieldOwnerState
  >;
  inputAdornment?: SlotComponentPropsFromProps<
    InputAdornmentProps,
    {},
    FieldInputAdornmentOwnerState
  >;
  clearIcon?: SlotComponentPropsFromProps<SvgIconProps, {}, FieldOwnerState>;
  clearButton?: SlotComponentPropsFromProps<IconButtonProps, {}, FieldOwnerState>;
}

export interface PickerFieldUISlotPropsFromContext extends PickerFieldUISlotProps {
  openPickerButton?: SlotComponentPropsFromProps<IconButtonProps, {}, FieldOwnerState>;
  openPickerIcon?: SlotComponentPropsFromProps<SvgIconProps, {}, FieldOwnerState>;
}

interface FieldInputAdornmentOwnerState extends FieldOwnerState {
  position: 'start' | 'end';
}

interface PickerFieldUIContextValue {
  inputRef: React.Ref<HTMLInputElement> | undefined;
  slots: PickerFieldUISlotsFromContext;
  slotProps: PickerFieldUISlotPropsFromContext;
}

export function mergeSlotProps<TProps extends {}, TOwnerState extends FieldOwnerState>(
  slotPropsA: SlotComponentPropsFromProps<TProps, {}, TOwnerState> | undefined,
  slotPropsB: SlotComponentPropsFromProps<TProps, {}, TOwnerState> | undefined,
) {
  if (!slotPropsA) {
    return slotPropsB;
  }

  if (!slotPropsB) {
    return slotPropsA;
  }

  return (ownerState: TOwnerState) => {
    return {
      ...resolveComponentProps(slotPropsB, ownerState),
      ...resolveComponentProps(slotPropsA, ownerState),
    };
  };
}

/**
 * The `textField` slot props cannot be handled inside `PickerFieldUI` because it would be a breaking change to not pass the enriched props to `useField`.
 * Once the non-accessible DOM structure will be removed, we will be able to remove the `textField` slot and clean this logic.
 */
export function useFieldTextFieldProps<
  TProps extends UseFieldOwnerStateParameters & { inputProps?: {}; InputProps?: {} },
>(parameters: UseFieldTextFieldPropsParameters) {
  const { ref, externalForwardedProps, slotProps } = parameters;
  const pickerFieldUIContext = React.useContext(PickerFieldUIContext);
  const pickerContext = useNullablePickerContext();
  const ownerState = useFieldOwnerState(externalForwardedProps);

  const { InputProps, inputProps, ...otherExternalForwardedProps } = externalForwardedProps;

  const textFieldProps = useSlotProps({
    elementType: PickersTextField,
    externalSlotProps: mergeSlotProps(
      pickerFieldUIContext.slotProps.textField as any,
      slotProps?.textField as any,
    ),
    externalForwardedProps: otherExternalForwardedProps,
    additionalProps: {
      ref,
      sx: pickerContext?.rootSx,
      label: pickerContext?.label,
      name: pickerContext?.name,
      className: pickerContext?.rootClassName,
      inputRef: pickerFieldUIContext.inputRef,
    },
    ownerState,
  }) as any as TProps;

  // TODO: Remove when mui/material-ui#35088 will be merged
  textFieldProps.inputProps = { ...inputProps, ...textFieldProps.inputProps };
  textFieldProps.InputProps = { ...InputProps, ...textFieldProps.InputProps };

  return textFieldProps;
}

interface UseFieldTextFieldPropsParameters {
  slotProps:
    | {
        textField?: SlotComponentPropsFromProps<
          PickersTextFieldProps | TextFieldProps,
          {},
          FieldOwnerState
        >;
      }
    | undefined;
  ref: React.Ref<HTMLDivElement>;
  externalForwardedProps: any;
}

export function PickerFieldUIContextProvider(props: PickerFieldUIContextProviderProps) {
  const { slots = {}, slotProps = {}, inputRef, children } = props;

  const contextValue = React.useMemo<PickerFieldUIContextValue>(
    () => ({
      inputRef,
      slots: {
        openPickerButton: slots.openPickerButton,
        openPickerIcon: slots.openPickerIcon,
        textField: slots.textField,
        inputAdornment: slots.inputAdornment,
        clearIcon: slots.clearIcon,
        clearButton: slots.clearButton,
      },
      slotProps: {
        openPickerButton: slotProps.openPickerButton,
        openPickerIcon: slotProps.openPickerIcon,
        textField: slotProps.textField,
        inputAdornment: slotProps.inputAdornment,
        clearIcon: slotProps.clearIcon,
        clearButton: slotProps.clearButton,
      },
    }),
    [
      inputRef,
      slots.openPickerButton,
      slots.openPickerIcon,
      slots.textField,
      slots.inputAdornment,
      slots.clearIcon,
      slots.clearButton,
      slotProps.openPickerButton,
      slotProps.openPickerIcon,
      slotProps.textField,
      slotProps.inputAdornment,
      slotProps.clearIcon,
      slotProps.clearButton,
    ],
  );

  return (
    <PickerFieldUIContext.Provider value={contextValue}>{children}</PickerFieldUIContext.Provider>
  );
}

interface PickerFieldUIContextProviderProps {
  children: React.ReactNode;
  inputRef: React.Ref<HTMLInputElement> | undefined;
  slots: PickerFieldUISlotsFromContext | undefined;
  slotProps: PickerFieldUISlotPropsFromContext | undefined;
}
