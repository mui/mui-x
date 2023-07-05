import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomizationPlayground from 'docsx/src/modules/components/CustomizationPlayground';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Box from '@mui/material/Box';
import { examples } from 'docsx/data/date-pickers/customization-examples/examples?@muix/customization';

export default function CustomizationPlaygroundWrapper() {
  console.log(examples);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <CustomizationPlayground config={examples}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker />
        </LocalizationProvider>
      </CustomizationPlayground>
    </Box>
  );
}
