import * as React from 'react';
import { PickerDay, pickerDayClasses, PickerDayProps } from '@mui/x-date-pickers/PickerDay';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiPickerDay: {
      styleOverrides: {
        root: {
          color: 'red',
        },
      },
    },
  },
});

function CustomDay(props: PickerDayProps) {
  return <PickerDay {...props} className={pickerDayClasses.root} />;
}

const sx = {
  '& .MuiPickerDay-root': {
    backgroundColor: 'blue',
  },
};
