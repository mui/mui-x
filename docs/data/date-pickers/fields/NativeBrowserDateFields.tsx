import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';

interface BrowserFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  inputProps?: {
    ref?: React.Ref<any>;
  };
  InputProps?: { endAdornment?: React.ReactNode; startAdornment?: React.ReactNode };
  error?: boolean;
  focused?: boolean;
  ownerState?: any;
  sx?: any;
}

type BrowserFieldComponent = ((
  props: BrowserFieldProps & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const BrowserField = React.forwardRef(
  (props: BrowserFieldProps, ref: React.Ref<HTMLInputElement>) => {
    const {
      disabled,
      id,
      label,
      inputProps: { ref: inputRef } = {},
      InputProps: { startAdornment, endAdornment } = {},
      ...other
    } = props;

    return (
      <form
        id={id}
        style={{
          flexGrow: 1,
        }}
      >
        <label>{label}</label>
        <div
          ref={ref}
          style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
        >
          {startAdornment}
          <input disabled={disabled} {...other} ref={inputRef} />
          {endAdornment}
        </div>
      </form>
    );
  },
) as BrowserFieldComponent;

export default function NativeBrowserDateFields() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'TimeField']}>
        <DemoItem>
          <DateField
            label="Browser date field"
            clearable
            slots={{
              textField: BrowserField,
            }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
