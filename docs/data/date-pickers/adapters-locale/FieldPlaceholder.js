import * as React from 'react';
import 'dayjs/locale/de';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { deDE } from '@mui/x-date-pickers/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';

const germanLocale = deDE.components.MuiLocalizationProvider.defaultProps.localeText;
export default function FieldPlaceholder() {
  return (
    <DemoContainer components={['DateField', 'DateField']}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoItem label="English locale (default)">
          <DateField />
        </DemoItem>
      </LocalizationProvider>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        // Define the date locale to have the right format `day.month.year`.
        adapterLocale="de"
        // Define the translations to have the right placeholders (for example `JJJJ` for the year).
        localeText={germanLocale}
      >
        <DemoItem label="German locale">
          <DateField />
        </DemoItem>
      </LocalizationProvider>
    </DemoContainer>
  );
}
