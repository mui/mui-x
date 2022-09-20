import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'dayjs/locale/ar-sa';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const locales = ['en', 'ru', 'ar-sa'];

// prettier-ignore
const ampmOptions = {
  'undefined': undefined,
  true: true,
  false: false };

export default function LocalizedTimePicker() {
  const [locale, setLocale] = React.useState('ru');
  const [value, setValue] = React.useState(dayjs('2022-04-07'));

  const [ampm, setAmpm] = React.useState(undefined);
  const [ampmOption, setAmpmOption] = React.useState('undefined');

  const selectAmpm = (event) => {
    setAmpm(ampmOptions[event.target.value]);
    setAmpmOption(event.target.value);
  };

  const selectLocale = (newLocale) => {
    setLocale(newLocale);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <ToggleButtonGroup value={locale} exclusive sx={{ display: 'block' }}>
            {locales.map((localeItem) => (
              <ToggleButton
                key={localeItem}
                value={localeItem}
                onClick={() => selectLocale(localeItem)}
              >
                {localeItem}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="demo-select-small">ampm</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              label="ampm"
              value={ampmOption}
              onChange={selectAmpm}
            >
              {Object.keys(ampmOptions).map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <TimePicker
          value={value}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(params) => <TextField {...params} />}
          ampm={ampm}
        />
        <DateTimePicker
          value={value}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(params) => <TextField {...params} />}
          ampm={ampm}
        />
      </Stack>
    </LocalizationProvider>
  );
}
