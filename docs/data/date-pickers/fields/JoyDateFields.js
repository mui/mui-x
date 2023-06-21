import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Box from '@mui/material/Box';
import {
  useTheme as useMaterialTheme,
  useColorScheme as useMaterialColorScheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
} from '@mui/material/styles';
import {
  extendTheme as extendJoyTheme,
  useColorScheme,
  CssVarsProvider,
  THEME_ID,
} from '@mui/joy/styles';

const joyTheme = extendJoyTheme();

const JoyField = React.forwardRef((props, ref) => {
  const {
    disabled,
    id,
    label,
    inputProps: { ref: inputRef } = {},
    InputProps: { startAdornment, endAdornment } = {},
    formControlSx,
    ...other
  } = props;

  return (
    <FormControl
      disabled={disabled}
      id={id}
      sx={[
        {
          flexGrow: 1,
        },
        ...(Array.isArray(formControlSx) ? formControlSx : [formControlSx]),
      ]}
      ref={ref}
    >
      <FormLabel>{label}</FormLabel>
      <Input
        disabled={disabled}
        slotProps={{ input: { ref: inputRef } }}
        startDecorator={startAdornment}
        endDecorator={endAdornment}
        {...other}
      />
    </FormControl>
  );
});

function SyncThemeMode({ mode }) {
  const { setMode } = useColorScheme();
  const { setMode: setMaterialMode } = useMaterialColorScheme();
  React.useEffect(() => {
    setMode(mode);
    setMaterialMode(mode);
  }, [mode, setMode, setMaterialMode]);
  return null;
}

export default function JoyDateFields() {
  const materialTheme = useMaterialTheme();
  return (
    <MaterialCssVarsProvider>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode mode={materialTheme.palette.mode} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateField', 'TimeField']}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DemoItem>
                <DateField
                  label="Joy date field"
                  clearable
                  slots={{
                    textField: JoyField,
                  }}
                  sx={{ width: '300px' }}
                />
              </DemoItem>

              <DemoItem>
                <TimeField
                  label="Joy time field"
                  clearable
                  slots={{
                    textField: JoyField,
                  }}
                  sx={{ width: '300px' }}
                />
              </DemoItem>
              <DemoItem>
                <SingleInputDateRangeField
                  label="Date Range Field"
                  clearable
                  slots={{
                    textField: JoyField,
                  }}
                  sx={{ width: '300px' }}
                />
              </DemoItem>
            </Box>
          </DemoContainer>
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
