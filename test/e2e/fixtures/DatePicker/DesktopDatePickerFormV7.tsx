import * as React from 'react';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function DesktopDatePickerFormV7() {
  const [submittedDate, setSubmittedDate] = React.useState<string | null>(null);
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setSubmittedDate(new FormData(event.target as HTMLFormElement).values().next().value);
  };
  return (
    <form onSubmit={submitHandler}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Desktop Date Picker"
          name="startDate"
          defaultValue={dayjs('2022-04-17')}
          enableAccessibleFieldDOMStructure
        />
      </LocalizationProvider>
      {submittedDate && <label role="status">Submitted: {submittedDate}</label>}
      <button type="submit">Submit</button>
    </form>
  );
}
