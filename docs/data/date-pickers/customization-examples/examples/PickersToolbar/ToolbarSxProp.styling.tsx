import * as React from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

export default function ToolbarSxProp() {
  return (
    <StaticDatePicker
      sx={{
        '& .MuiPickersToolbar-root': {
          background: '#BBB2CC',
          borderRadius: 4,
          '& > *': {
            fontFamily: 'Arial',
            color: '#463B60',
          },
          '& .MuiPickersToolbar-content > *': {
            fontSize: '2.4rem',
            fontWeight: 500,
          },
        },
      }}
    />
  );
}
