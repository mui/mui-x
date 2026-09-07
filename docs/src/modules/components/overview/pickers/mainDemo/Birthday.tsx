import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import CakeIcon from '@mui/icons-material/Cake';
import { DateField } from '@mui/x-date-pickers/DateField';

export default function Birthday() {
  // Fixed width (not `maxWidth`) so clearing the field doesn't resize the card and shift the layout.
  return (
    <Card variant="outlined" sx={{ padding: 1, width: '265px' }}>
      <Stack sx={{ height: 'fit-content', alignItems: 'center' }} spacing={1}>
        <DateField
          label="Enter your birthday"
          clearable
          fullWidth
          defaultValue={dayjs('2019-07-11T15:30')}
          variant="filled"
          slotProps={{
            textField: {
              slotProps: {
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              },
            },
          }}
        />
        <Button variant="contained" fullWidth size="small">
          Submit
        </Button>
      </Stack>
    </Card>
  );
}
