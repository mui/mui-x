import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldResponse } from './useField';

export const useConvertFieldResponseIntoMuiTextFieldProps = <
  TFieldResponse extends UseFieldResponse<any>,
>(
  fieldResponse: TFieldResponse,
): TFieldResponse['textField'] extends 'v6' ? TextFieldProps : TFieldResponse => {
  const { onPaste, onKeyDown, inputMode, readOnly, InputProps, inputProps, inputRef, ...other } =
    fieldResponse;

  return {
    ...other,
    InputProps: { ...(InputProps ?? {}), readOnly },
    inputProps: { ...(inputProps ?? {}), inputMode, onPaste, onKeyDown, ref: inputRef },
  } as any;
};
