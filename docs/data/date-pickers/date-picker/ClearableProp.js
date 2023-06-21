import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

export default function ClearableProp() {
  const [cleared, setCleared] = React.useState(false);

  React.useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [cleared]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateField']}>
          <DemoItem label="DateField">
            <DatePicker
              sx={{ width: '300px' }}
              slotProps={{
                field: { clearable: true, onClear: () => setCleared(true) },
              }}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
      {cleared && (
        <Alert sx={{ position: 'absolute', bottom: 0, right: 0 }} severity="success">
          Field cleared!
        </Alert>
      )}
    </Box>
  );
}
