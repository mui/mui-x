import * as React from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const startOfQ12022 = dayjs('2022-01-01T00:00:00.000');
const endOfQ12022 = dayjs('2022-03-31T23:59:59.999');

export default function RenderErrorUnderField() {
  const [error, setError] = React.useState(null);

  const errorMessage = React.useMemo(() => {
    switch (error) {
      case 'maxDate':
      case 'minDate': {
        return 'Please select a date in the first quarter of 2022';
      }

      case 'invalidDate': {
        return 'Your date is not valid';
      }

      default: {
        return '';
      }
    }
  }, [error]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box width={300}>
        <NextDatePicker
          defaultValue={dayjs('2022-07-12T00:00:00.000')}
          onError={(newError) => setError(newError)}
          componentsProps={{
            input: {
              helperText: errorMessage,
            },
          }}
          minDate={startOfQ12022}
          maxDate={endOfQ12022}
        />
      </Box>
    </LocalizationProvider>
  );
}
