import * as React from 'react';
import TextField from '@mui/material/TextField';

export const FormulaTextField = React.forwardRef((props, ref) => {
  const { value, onChange, ...additionalProps } = props;

  return (
    <TextField
      value={value}
      onChange={onChange}
      slotProps={{
        input: {
          inputRef: ref,
          style: { fontSize: 'inherit' },
        },
      }}
      placeholder="Enter formula (e.g., =SUM(D1:D8))"
      {...additionalProps}
    />
  );
});
