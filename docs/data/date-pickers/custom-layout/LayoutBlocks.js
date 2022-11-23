import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Unstable_StaticNextDatePicker as StaticNextDatePicker } from '@mui/x-date-pickers/StaticNextDatePicker';
import { Unstable_StaticNextTimePicker as StaticNextTimePicker } from '@mui/x-date-pickers/StaticNextTimePicker';
import { Unstable_StaticNextDateTimePicker as StaticNextDateTimePicker } from '@mui/x-date-pickers/StaticNextDateTimePicker';

export default function LayoutBlocks() {
  const [currentComponent, setCurrentComponent] = React.useState('date');
  const [orientation, setOrientation] = React.useState('portrait');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack sx={{ width: '100%' }} alignItems="center">
        <ToggleButtonGroup
          fullWidth
          color="primary"
          value={orientation}
          onChange={(event, value) => setOrientation(value)}
          exclusive
        >
          <ToggleButton value={'landscape'}>landscape</ToggleButton>
          <ToggleButton value={'portrait'}>portrait</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          fullWidth
          color="primary"
          value={currentComponent}
          onChange={(event, value) => setCurrentComponent(value)}
          exclusive
          sx={{ mb: 2 }}
        >
          <ToggleButton value={'date'}>date picker</ToggleButton>
          <ToggleButton value={'time'}>time picker</ToggleButton>
          <ToggleButton value={'date-time'}>date time picker</ToggleButton>
        </ToggleButtonGroup>

        {currentComponent === 'date' && (
          <StaticNextDatePicker
            orientation={orientation}
            componentsProps={{
              layout: {
                sx: {
                  border: 'solid black 2px',
                  '& .MuiPickersViewLayout-toolbar': {
                    border: 'solid red 4px',
                  },
                  '& .MuiPickersViewLayout-content': {
                    border: 'solid green 4px',
                  },
                  '& .MuiPickersViewLayout-actionbar': {
                    border: 'solid blue 4px',
                  },
                },
              },
            }}
          />
        )}

        {currentComponent === 'time' && (
          <Box sx={{ position: 'relative' }}>
            <StaticNextTimePicker
              orientation={orientation}
              componentsProps={{
                layout: {
                  sx: {
                    border: 'solid black 2px',
                    '& .MuiPickersViewLayout-toolbar': {
                      border: 'solid red 4px',
                    },
                    '& .MuiPickersViewLayout-content': {
                      border: 'solid green 4px',
                    },
                    '& .MuiPickersViewLayout-actionbar': {
                      border: 'solid blue 4px',
                    },
                  },
                },
              }}
            />
          </Box>
        )}

        {currentComponent === 'date-time' && (
          <StaticNextDateTimePicker
            orientation={orientation}
            componentsProps={{
              layout: {
                sx: {
                  border: 'solid black 2px',
                  '& .MuiPickersViewLayout-toolbar': {
                    border: 'solid red 4px',
                  },
                  '& .MuiPickersViewLayout-content': {
                    border: 'solid green 4px',
                  },
                  '& .MuiPickersViewLayout-actionbar': {
                    border: 'solid blue 4px',
                  },
                },
              },
            }}
          />
        )}
      </Stack>
    </LocalizationProvider>
  );
}
