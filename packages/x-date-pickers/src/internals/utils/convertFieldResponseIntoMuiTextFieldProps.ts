export const convertFieldResponseIntoMuiTextFieldProps = <
  TFieldResponse extends { enableAccessibleFieldDOMStructure: boolean },
>({
  enableAccessibleFieldDOMStructure,
  ...fieldResponse
}: TFieldResponse) => {
  if (enableAccessibleFieldDOMStructure) {
    const { InputProps, readOnly, ...other } = fieldResponse as any;

    return {
      ...other,
      InputProps: { ...(InputProps ?? {}), readOnly },
    };
  }

  const { onPaste, onKeyDown, inputMode, readOnly, InputProps, inputProps, inputRef, ...other } =
    fieldResponse as any;

  return {
    ...other,
    InputProps: { ...(InputProps ?? {}), readOnly },
    inputProps: { ...(inputProps ?? {}), inputMode, onPaste, onKeyDown, ref: inputRef },
  };
};
