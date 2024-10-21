import * as React from 'react';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import CakeIcon from '@mui/icons-material/Cake';
import { DateField } from '@mui/x-date-pickers/DateField';

export default function Birthday() {
  return (
    <Card variant="outlined" sx={{ padding: 1, maxWidth: '265px' }}>
      <Stack sx={{ height: 'fit-content' }} spacing={1} alignItems="center">
        <DateField
          label="Enter your birthday"
          clearable
          fullWidth
          value={dayjs('2019-07-11T15:30')}
          variant="filled"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CakeIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" fullWidth size="small">
          Submit
        </Button>
      </Stack>
    </Card>
  );
}
