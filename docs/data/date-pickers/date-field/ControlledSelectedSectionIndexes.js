import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';

export default function ControlledSelectedSectionIndexes() {
  const [selectedSectionIndexes, setSelectedSectionIndexes] = React.useState(null);
  const inputRef = React.useRef(null);

  const setSelectedDateSectionName = (selectedDateSectionName) => {
    inputRef.current?.focus();
    setSelectedSectionIndexes(selectedDateSectionName);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => setSelectedDateSectionName('month')}
          >
            Pick month
          </Button>
          <Button
            variant="outlined"
            onClick={() => setSelectedDateSectionName('day')}
          >
            Pick day
          </Button>
          <Button
            variant="outlined"
            onClick={() => setSelectedDateSectionName('year')}
          >
            Pick year
          </Button>
        </Stack>
        <DateField
          label="Basic date field"
          inputRef={inputRef}
          selectedSectionIndexes={selectedSectionIndexes}
          onSelectedSectionIndexesChange={setSelectedSectionIndexes}
        />
      </Stack>
    </LocalizationProvider>
  );
}
