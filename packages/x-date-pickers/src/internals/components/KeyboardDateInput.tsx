import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useLocaleText, useUtils } from '../hooks/useUtils';
import { Calendar } from './icons';
import { useMaskedInput } from '../hooks/useMaskedInput';
import { DateInputProps } from './PureDateInput';

export const KeyboardDateInput = React.forwardRef(function KeyboardDateInput<TInputDate, TDate>(
  props: DateInputProps<TInputDate, TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
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

  const localeText = useLocaleText();

  const getOpenDialogAriaText = getOpenDialogAriaTextProp ?? localeText.openDatePickerDialogue;

  const utils = useUtils<TDate>();
  const textFieldProps = useMaskedInput(other);
  const adornmentPosition = InputAdornmentProps?.position || 'end';
  const OpenPickerIcon = components.OpenPickerIcon || Calendar;

  return renderInput({
    ref,
    inputRef,
    ...textFieldProps,
    InputProps: {
      ...InputProps,
      [`${adornmentPosition}Adornment`]: disableOpenPicker ? undefined : (
        <InputAdornment position={adornmentPosition} {...InputAdornmentProps}>
          <IconButton
            edge={adornmentPosition}
            data-mui-test="open-picker-from-keyboard"
            disabled={other.disabled || other.readOnly}
            aria-label={getOpenDialogAriaText(other.rawValue, utils)}
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

KeyboardDateInput.propTypes = {
  acceptRegex: PropTypes.instanceOf(RegExp),
  getOpenDialogAriaText: PropTypes.func,
  mask: PropTypes.string,
  OpenPickerButtonProps: PropTypes.object,
  renderInput: PropTypes.func.isRequired,
  rifmFormatter: PropTypes.func,
};
