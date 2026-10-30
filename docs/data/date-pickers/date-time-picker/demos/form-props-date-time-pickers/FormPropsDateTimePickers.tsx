import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function FormPropsDateTimePickers() {
  return (
    // @focus-start @padding 2
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DateTimePicker', 'DateTimePicker', 'DateTimePicker']}
      >
        <DateTimePicker label="disabled" disabled />
        <DateTimePicker label="readOnly" readOnly />
        <DateTimePicker label="name" name="startDateTime" />
      </DemoContainer>
    </LocalizationProvider>
    // @focus-end
  );
}
