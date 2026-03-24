import * as React from 'react';
import { PickersDay, pickersDayClasses, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: 'red',
        },
      },
    },
  },
});

function CustomDay(props: PickersDayProps) {
  return <PickersDay {...props} className={pickersDayClasses.root} />;
}

const sx = {
  '& .MuiPickersDay-root': {
    backgroundColor: 'blue',
  },
};
