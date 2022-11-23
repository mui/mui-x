import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useLocaleText, useUtils } from '../hooks/useUtils';
import { Calendar } from './icons';
import { useMaskedInput } from '../hooks/useMaskedInput';
import { DateInputProps } from './PureDateInput';

export const KeyboardDateInput = React.forwardRef(function KeyboardDateInput<TDate>(
  props: DateInputProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    className,
    components = {},
    disableOpenPicker,
    getOpenDialogAriaText: getOpenDialogAriaTextProp,
    InputAdornmentProps,
    InputProps,
    inputRef,
    openPicker,
    OpenPickerButtonProps,
    renderInput,
    ...other
  } = props;

  const localeText = useLocaleText<TDate>();

  const getOpenDialogAriaText = getOpenDialogAriaTextProp ?? localeText.openDatePickerDialogue;

  const utils = useUtils<TDate>();
  const textFieldProps = useMaskedInput(other);
  const adornmentPosition = InputAdornmentProps?.position || 'end';
  const OpenPickerIcon = components.OpenPickerIcon || Calendar;

  return renderInput({
    ref,
    inputRef,
    className,
    ...textFieldProps,
    InputProps: {
      ...InputProps,
      [`${adornmentPosition}Adornment`]: disableOpenPicker ? undefined : (
        <InputAdornment position={adornmentPosition} {...InputAdornmentProps}>
          <IconButton
            edge={adornmentPosition}
            data-mui-test="open-picker-from-keyboard"
            disabled={other.disabled || other.readOnly}
            aria-label={getOpenDialogAriaText(other.value, utils)}
            {...OpenPickerButtonProps}
            onClick={openPicker}
          >
            <OpenPickerIcon />
          </IconButton>
        </InputAdornment>
      ),
    },
  });
});
