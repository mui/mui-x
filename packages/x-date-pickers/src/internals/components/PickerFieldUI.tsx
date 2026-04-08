'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import MuiIconButton, { IconButtonProps } from '@mui/material/IconButton';
import MuiInputAdornment, { InputAdornmentProps } from '@mui/material/InputAdornment';
import { SvgIconProps } from '@mui/material/SvgIcon';
import useSlotProps from '@mui/utils/useSlotProps';
import { warnOnce } from '@mui/x-internals/warning';
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
    UseFieldReturnValue<ExportedPickerFieldUIProps & { [key: string]: any }>,
    'onClear' | 'clearable'
  >,
>(
  fieldResponse: TFieldResponse,
): ExportedPickerFieldUIProps & {
  openPickerAriaLabel: string;
  textFieldProps: Partial<PickersTextFieldProps>;
} => {
  const {
    readOnly,
    onClear,
    clearable,
    clearButtonPosition,
    openPickerButtonPosition,
    openPickerAriaLabel,
    // TODO v10: remove
    // Explicitly discard legacy props that are no longer supported on `PickersTextField`.
    // Without this, any leftover values would silently leak into `...other` and end up spread
    // as unknown attributes on the underlying form control.
    InputProps: legacyInputProps,
    inputProps: legacyHtmlInputProps,
    InputLabelProps: legacyInputLabelProps,
    FormHelperTextProps: legacyFormHelperTextProps,
    ...other
  } = fieldResponse as TFieldResponse & {
    InputProps?: unknown;
    inputProps?: unknown;
    InputLabelProps?: unknown;
    FormHelperTextProps?: unknown;
  };

  if (process.env.NODE_ENV !== 'production') {
    if (
      legacyInputProps ||
      legacyHtmlInputProps ||
      legacyInputLabelProps ||
      legacyFormHelperTextProps
    ) {
      warnOnce([
        'MUI X: The `InputProps`, `inputProps`, `InputLabelProps` and `FormHelperTextProps` props are no longer supported on Picker / Field components.',
        'They have been silently dropped because they would otherwise be forwarded as unknown attributes on the underlying form control.',
        'Use the `slotProps` shape instead (`slotProps.input`, `slotProps.htmlInput`, `slotProps.inputLabel`, `slotProps.formHelperText`).',
        'See https://mui.com/x/migration/migration-pickers-v8/#textfield-props for migration details.',
      ]);
    }
  }

  return {
    clearable,
    onClear,
    clearButtonPosition,
    openPickerButtonPosition,
    openPickerAriaLabel,
    textFieldProps: {
      ...other,
      slotProps: {
        ...other?.slotProps,
        input: { ...other?.slotProps?.input, readOnly },
      },
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
export function PickerFieldUI<TProps extends UseFieldProps>(props: PickerFieldUIProps<TProps>) {
  const { fieldResponse, defaultOpenPickerIcon } = props;

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
    // Force open instead of toggling to avoid conflicts with field-level open-on-focus logic
    pickerContext?.setOpen(true);
  });

  const triggerStatus = pickerContext ? pickerContext.triggerStatus : 'hidden';
  const clearButtonPosition = clearable ? clearButtonPositionProp : null;
  const openPickerButtonPosition = triggerStatus !== 'hidden' ? openPickerButtonPositionProp : null;

  const TextField = pickerFieldUIContext.slots.textField ?? PickersTextField;

  const InputAdornment = pickerFieldUIContext.slots.inputAdornment ?? MuiInputAdornment;
  const { ownerState: startInputAdornmentOwnerState, ...startInputAdornmentProps } = useSlotProps({
    elementType: InputAdornment,
    externalSlotProps: pickerFieldUIContext.slotProps.inputAdornment,
    additionalProps: {
      position: 'start' as const,
    },
    ownerState: { ...ownerState, position: 'start' },
  });
  const { ownerState: endInputAdornmentOwnerState, ...endInputAdornmentProps } = useSlotProps({
    elementType: InputAdornment,
    externalSlotProps: pickerFieldUIContext.slotProps.inputAdornment,
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
      // Mark this element so field handlers can ignore its events
      'data-mui-picker-open-button': 'true',
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

  const ClearButton = pickerFieldUIContext.slots.clearButton ?? MuiIconButton;
  // We don't want to forward the `ownerState` to the `<IconButton />` component, see mui/material-ui#34056
  const { ownerState: clearButtonOwnerState, ...clearButtonProps } = useSlotProps({
    elementType: ClearButton,
    externalSlotProps: pickerFieldUIContext.slotProps.clearButton,
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

  const ClearIcon = pickerFieldUIContext.slots.clearIcon ?? MuiClearIcon;
  const clearIconProps = useSlotProps({
    elementType: ClearIcon,
    externalSlotProps: pickerFieldUIContext.slotProps.clearIcon,
    additionalProps: {
      fontSize: 'small',
    },
    ownerState,
  });

  textFieldProps.ref = useForkRef(textFieldProps.ref, pickerContext?.rootRef);

  const externalInputSlotProps = textFieldProps.slotProps?.input;
  const additionalInputSlotProps: NonNullable<PickersTextFieldProps['slotProps']>['input'] = {};

  const forkedInputRef = useForkRef(externalInputSlotProps?.ref, pickerContext?.triggerRef);
  if (pickerContext) {
    additionalInputSlotProps.ref = forkedInputRef;
  }

  if (
    !externalInputSlotProps?.startAdornment &&
    (clearButtonPosition === 'start' || openPickerButtonPosition === 'start')
  ) {
    additionalInputSlotProps.startAdornment = (
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
    !externalInputSlotProps?.endAdornment &&
    (clearButtonPosition === 'end' || openPickerButtonPosition === 'end')
  ) {
    additionalInputSlotProps.endAdornment = (
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
  // handle the case of showing custom `inputAdornment` for Field components
  if (
    !additionalInputSlotProps.endAdornment &&
    !additionalInputSlotProps.startAdornment &&
    pickerFieldUIContext.slots.inputAdornment
  ) {
    additionalInputSlotProps.endAdornment = <InputAdornment {...endInputAdornmentProps} />;
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

  textFieldProps.slotProps = {
    ...textFieldProps.slotProps,
    input: { ...externalInputSlotProps, ...additionalInputSlotProps },
  };

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

export interface PickerFieldUIProps<TProps extends UseFieldProps> {
  /**
   * Object returned by the `useField` hook or one of its wrapper (for example `useDateField`).
   */
  fieldResponse: UseFieldReturnValue<TProps>;
  /**
   * The component to use to render the Picker opening icon if none is provided in the Picker's slots.
   */
  defaultOpenPickerIcon: React.ElementType;
}

export interface PickerFieldUISlots {
  /**
   * Form control with an input to render the value.
   * @default <PickersTextField />
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
  textField?: SlotComponentPropsFromProps<PickersTextFieldProps, {}, FieldOwnerState>;
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
 * TODO: Remove the `textField` slot and clean this logic up.
 */
export function useFieldTextFieldProps<TProps extends UseFieldOwnerStateParameters>(
  parameters: UseFieldTextFieldPropsParameters,
) {
  const { ref, externalForwardedProps, slotProps } = parameters;
  const pickerFieldUIContext = React.useContext(PickerFieldUIContext);
  const pickerContext = useNullablePickerContext();
  const ownerState = useFieldOwnerState(externalForwardedProps);

  // TODO v10: remove
  // Strip the legacy `InputProps` / `inputProps` / `InputLabelProps` / `FormHelperTextProps`
  // before they reach `PickersTextField`, which would silently ignore them. JS users without
  // TypeScript checks would otherwise see their configuration vanish.
  const {
    InputProps: legacyInputProps,
    inputProps: legacyHtmlInputProps,
    InputLabelProps: legacyInputLabelProps,
    FormHelperTextProps: legacyFormHelperTextProps,
    ...sanitizedExternalForwardedProps
  } = (externalForwardedProps ?? {}) as Record<string, unknown>;

  if (process.env.NODE_ENV !== 'production') {
    if (
      legacyInputProps ||
      legacyHtmlInputProps ||
      legacyInputLabelProps ||
      legacyFormHelperTextProps
    ) {
      warnOnce([
        'MUI X: Field components no longer accept the `InputProps`, `inputProps`, `InputLabelProps` and `FormHelperTextProps` props.',
        'They have been dropped to avoid leaking unknown attributes onto the underlying form control.',
        'Use the nested `slotProps.textField.slotProps.{input,htmlInput,inputLabel,formHelperText}` shape instead.',
      ]);
    }
  }

  const textFieldProps = useSlotProps({
    elementType: PickersTextField,
    externalSlotProps: mergeSlotProps(
      pickerFieldUIContext.slotProps.textField as any,
      slotProps?.textField as any,
    ),
    externalForwardedProps: sanitizedExternalForwardedProps,
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

  // When requested, open the picker when the user focuses/clicks the field to edit
  if (
    pickerContext &&
    pickerContext.keepOpenDuringFieldFocus &&
    pickerContext.triggerStatus === 'enabled' &&
    !pickerContext.open &&
    !pickerContext.readOnly &&
    !pickerContext.disabled
  ) {
    const prevOnFocus = (textFieldProps as any).onFocus as React.FocusEventHandler | undefined;
    const prevOnMouseDown = (textFieldProps as any).onMouseDown as
      | React.MouseEventHandler
      | undefined;

    const isFromOpenButton = (event: React.SyntheticEvent) => {
      const nativeEvent: any = (event as any).nativeEvent ?? event;
      const path: any[] | undefined = nativeEvent?.composedPath?.();
      if (Array.isArray(path)) {
        for (const el of path) {
          if (el && el.getAttribute && el.getAttribute('data-mui-picker-open-button') === 'true') {
            return true;
          }
        }
      }
      const target = event.target as Element | null;
      if (target && (target as any).closest) {
        return Boolean((target as any).closest('[data-mui-picker-open-button="true"]'));
      }
      return false;
    };

    (textFieldProps as any).onFocus = (event: React.FocusEvent) => {
      prevOnFocus?.(event);
      // Avoid opening if event was prevented by user code
      if (!event.isDefaultPrevented() && !isFromOpenButton(event)) {
        pickerContext.setOpen(true);
      }
    };

    (textFieldProps as any).onMouseDown = (event: React.MouseEvent) => {
      prevOnMouseDown?.(event);
      if (!event.isDefaultPrevented() && !isFromOpenButton(event)) {
        pickerContext.setOpen(true);
      }
    };
  }

  return textFieldProps;
}

interface UseFieldTextFieldPropsParameters {
  slotProps:
    | {
        textField?: PickerFieldUISlotProps['textField'];
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
