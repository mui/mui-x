import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldResponse } from '../hooks/useField';

export const convertFieldResponseIntoMuiTextFieldProps = <
  TFieldResponse extends UseFieldResponse<any>,
>(
  fieldResponse: TFieldResponse,
): TextFieldProps => {
  const { onPaste, onKeyDown, inputMode, readOnly, InputProps, inputProps, inputRef, ...other } =
    fieldResponse;

  return {
    ...other,
    InputProps: { ...(InputProps ?? {}), readOnly },
    inputProps: { ...(inputProps ?? {}), inputMode, onPaste, onKeyDown, ref: inputRef },
  } as any;
};
