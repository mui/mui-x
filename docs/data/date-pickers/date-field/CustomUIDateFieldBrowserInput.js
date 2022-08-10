import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';

const BrowserInputDateField = (props) => {
  const { inputRef, inputProps } = useDateField(props);

  return <input {...inputProps} ref={inputRef} />;
};

export default function CustomUIDateFieldBrowserInput() {
  const [value, setValue] = React.useState(new Date());

  return (
    <CssVarsProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserInputDateField
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </LocalizationProvider>
    </CssVarsProvider>
  );
}
