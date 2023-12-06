import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldResponse } from './useField';

export const useConvertFieldResponseIntoMuiTextFieldProps = <
  TFieldResponse extends UseFieldResponse<any, any>,
>(
  fieldResponse: TFieldResponse,
): TFieldResponse['textField'] extends 'v6' ? TextFieldProps : TFieldResponse => {
  const { textField, ...props } = fieldResponse;

  if (textField === 'v6') {
    const { onPaste, onKeyDown, inputMode, readOnly, InputProps, inputProps, inputRef, ...other } =
      props;

    return {
      ...other,
      InputProps: { ...(InputProps ?? {}), readOnly },
      inputProps: { ...(inputProps ?? {}), inputMode, onPaste, onKeyDown, ref: inputRef },
    } as any;
  }

  const { InputProps, readOnly, ...other } = props;

  return {
    ...other,
    InputProps: { ...(InputProps ?? {}), readOnly },
  } as any;
};
