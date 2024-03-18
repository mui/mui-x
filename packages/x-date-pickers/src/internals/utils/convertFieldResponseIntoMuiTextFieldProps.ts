import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldResponse } from '../hooks/useField';

export const convertFieldResponseIntoMuiTextFieldProps = <
  TFieldResponse extends UseFieldResponse<any, any>,
>({
  enableAccessibleFieldDOMStructure,
  ...fieldResponse
}: TFieldResponse): TextFieldProps => {
  if (enableAccessibleFieldDOMStructure) {
    const { InputProps, readOnly, ...other } = fieldResponse;

    return {
      ...other,
      InputProps: { ...(InputProps ?? {}), readOnly },
    } as any;
  }

  const { onPaste, onKeyDown, inputMode, readOnly, InputProps, inputProps, inputRef, ...other } =
    fieldResponse;

  return {
    ...other,
    InputProps: { ...(InputProps ?? {}), readOnly },
    inputProps: { ...(inputProps ?? {}), inputMode, onPaste, onKeyDown, ref: inputRef },
  } as any;
};
