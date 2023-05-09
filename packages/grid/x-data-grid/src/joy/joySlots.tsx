import * as React from 'react';
import { SxProps } from '@mui/system';
import { ColorPaletteProp, Theme, VariantProp } from '@mui/joy/styles';
import JoyCheckbox from '@mui/joy/Checkbox';
import JoyInput from '@mui/joy/Input';
import JoyFormControl from '@mui/joy/FormControl';
import JoyFormLabel from '@mui/joy/FormLabel';
import JoyButton from '@mui/joy/Button';
import JoyIconButton from '@mui/joy/IconButton';
import JoySwitch, { SwitchProps as JoySwitchProps } from '@mui/joy/Switch';
import JoySelect, { SelectProps as JoySelectProps } from '@mui/joy/Select';
import JoyOption, { OptionProps as JoyOptionProps } from '@mui/joy/Option';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import type { UncapitalizeObjectKeys } from '../internals/utils';
import type { GridSlotsComponent, GridSlotsComponentsProps } from '../models';

function convertColor<
  T extends
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
    | 'inherit'
    | 'default',
>(color: T | undefined) {
  if (color === 'secondary') {
    return 'primary';
  }
  if (color === 'error') {
    return 'danger';
  }
  if (color === 'default' || color === 'inherit') {
    return 'neutral';
  }
  return color as ColorPaletteProp;
}

function convertSize<T extends 'small' | 'medium' | 'large'>(size: T | undefined) {
  return (size ? { small: 'sm', medium: 'md', large: 'lg' }[size] : size) as
    | 'sm'
    | 'md'
    | 'lg'
    | undefined;
}

function convertVariant<T extends 'outlined' | 'contained' | 'text' | 'standard' | 'filled'>(
  variant: T | undefined,
  defaultVariant: VariantProp = 'plain',
) {
  if (!variant) {
    return defaultVariant;
  }

  return ({
    standard: 'outlined',
    outlined: 'outlined',
    contained: 'solid',
    text: 'plain',
    filled: 'soft',
  }[variant] || defaultVariant) as VariantProp;
}

const Checkbox = React.forwardRef<
  HTMLElement,
  NonNullable<GridSlotsComponentsProps['baseCheckbox']>
>(
  (
    { touchRippleRef, inputProps, onChange, color, size, checked, sx, value, inputRef, ...props },
    ref,
  ) => {
    return (
      <JoyCheckbox
        {...props}
        slotProps={{ input: { ...(inputProps as any), ref: inputRef } }}
        ref={ref}
        checked={checked}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
      />
    );
  },
);

const TextField = React.forwardRef<
  HTMLDivElement,
  NonNullable<GridSlotsComponentsProps['baseTextField']>
>(({ onChange, label, placeholder, value, inputRef, type, size, variant, ...props }, ref) => {
  const rootRef = useForkRef(ref, props.InputProps?.ref);
  const inputForkRef = useForkRef(inputRef, props?.inputProps?.ref);
  const { startAdornment, endAdornment } = props.InputProps || {};

  return (
    <JoyFormControl ref={rootRef}>
      <JoyFormLabel>{label}</JoyFormLabel>
      <JoyInput
        type={type}
        value={value as any}
        onChange={onChange}
        placeholder={placeholder}
        variant={convertVariant(variant, 'outlined')}
        size={convertSize(size)}
        slotProps={{ input: { ...props?.inputProps, ref: inputForkRef } }}
        startDecorator={startAdornment}
        endDecorator={endAdornment}
      />
    </JoyFormControl>
  );
});

const Button = React.forwardRef<
  HTMLButtonElement,
  NonNullable<GridSlotsComponentsProps['baseButton']>
>(function Button({ startIcon, color, endIcon, size, sx, variant, ...props }, ref) {
  return (
    <JoyButton
      {...props}
      size={convertSize(size)}
      color={convertColor(color)}
      variant={convertVariant(variant)}
      ref={ref}
      startDecorator={startIcon}
      endDecorator={endIcon}
      sx={sx as SxProps<Theme>}
    />
  );
});

const IconButton = React.forwardRef<
  HTMLButtonElement,
  NonNullable<GridSlotsComponentsProps['baseIconButton']>
>(function IconButton({ color, size, sx, touchRippleRef, ...props }, ref) {
  return (
    <JoyIconButton
      {...props}
      size={convertSize(size)}
      color={convertColor(color) ?? 'neutral'}
      variant="plain"
      ref={ref}
      sx={sx as SxProps<Theme>}
    />
  );
});

const Switch = React.forwardRef<
  HTMLDivElement,
  NonNullable<GridSlotsComponentsProps['baseSwitch']>
>(function Switch(
  {
    name,
    checkedIcon,
    color: colorProp,
    disableRipple,
    disableFocusRipple,
    disableTouchRipple,
    edge,
    icon,
    inputProps,
    inputRef,
    size,
    sx,
    onChange,
    onClick,
    ...props
  },
  ref,
) {
  return (
    <JoySwitch
      {...(props as JoySwitchProps)}
      onChange={onChange as JoySwitchProps['onChange']}
      size={convertSize(size)}
      color={convertColor(colorProp)}
      ref={ref}
      slotProps={{
        input: {
          ...inputProps,
          name,
          onClick: onClick as JSX.IntrinsicElements['input']['onClick'],
          ref: inputRef,
        },
        thumb: {
          children: icon,
        },
      }}
      sx={
        [
          {
            ...(edge === 'start' && { ml: '-8px' }),
            ...(edge === 'end' && { mr: '-8px' }),
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ] as SxProps<Theme>
      }
    />
  );
});

const Select = React.forwardRef<
  HTMLButtonElement,
  NonNullable<GridSlotsComponentsProps['baseSelect']>
>(
  (
    {
      open,
      onOpen,
      value,
      onChange,
      size,
      color,
      variant,
      inputProps,
      MenuProps,
      inputRef,
      error,
      native,
      fullWidth,
      labelId,
      ...props
    },
    ref,
  ) => {
    const handleChange: JoySelectProps<any>['onChange'] = (event, newValue) => {
      if (event && onChange) {
        // Same as in https://github.com/mui/material-ui/blob/e5558282a8f36856aef1299f3a36f3235e92e770/packages/mui-material/src/Select/SelectInput.js#L288-L300

        // Redefine target to allow name and value to be read.
        // This allows seamless integration with the most popular form libraries.
        // https://github.com/mui/material-ui/issues/13485#issuecomment-676048492
        // Clone the event to not override `target` of the original event.
        const nativeEvent = (event as React.SyntheticEvent).nativeEvent || event;
        // @ts-ignore The nativeEvent is function, not object
        const clonedEvent = new nativeEvent.constructor(nativeEvent.type, nativeEvent);

        Object.defineProperty(clonedEvent, 'target', {
          writable: true,
          value: { value: newValue, name: props.name },
        });
        onChange(clonedEvent, null);
      }
    };

    return (
      <JoySelect
        {...(props as JoySelectProps<any>)}
        listboxOpen={open}
        onListboxOpenChange={(isOpen) => {
          if (isOpen) {
            onOpen?.({} as React.SyntheticEvent);
          } else {
            MenuProps?.onClose?.({} as React.KeyboardEvent, undefined as any);
          }
        }}
        size={convertSize(size)}
        color={convertColor(color)}
        variant={convertVariant(variant, 'outlined')}
        ref={ref}
        value={value}
        onChange={handleChange}
        slotProps={{
          button: {
            'aria-labelledby': labelId,
            ref: inputRef,
          },
          listbox: {
            disablePortal: false,
            sx: {
              zIndex: 1350,
            },
          },
        }}
      />
    );
  },
);

const Option = React.forwardRef<
  HTMLLIElement,
  NonNullable<GridSlotsComponentsProps['baseSelectOption']>
>(({ native, ...props }, ref) => {
  return <JoyOption {...(props as JoyOptionProps)} ref={ref} />;
});

const InputLabel = React.forwardRef<
  HTMLLabelElement,
  NonNullable<GridSlotsComponentsProps['baseInputLabel']>
>(({ shrink, variant, sx, ...props }, ref) => {
  return <JoyFormLabel {...props} ref={ref} sx={sx as SxProps<Theme>} />;
});

const joySlots: UncapitalizeObjectKeys<Partial<GridSlotsComponent>> = {
  baseCheckbox: Checkbox,
  baseTextField: TextField,
  baseButton: Button,
  baseIconButton: IconButton,
  baseSwitch: Switch,
  baseSelect: Select,
  baseSelectOption: Option,
  baseInputLabel: InputLabel,
  baseFormControl: JoyFormControl,
  // BaseTooltip: MUITooltip,
  // BasePopper: MUIPopper,
};

export default joySlots;
