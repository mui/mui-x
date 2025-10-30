import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function RespectLeadingZerosFieldFormat() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DatePicker']}>
        <DateField
          label="Date Field"
          format="M/D/YYYY"
          defaultValue={dayjs('2022-04-17')}
          shouldRespectLeadingZeros
        />
        <DatePicker
          label="Date Picker"
          format="M/D/YYYY"
          defaultValue={dayjs('2022-04-17')}
          slotProps={{ field: { shouldRespectLeadingZeros: true } }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
