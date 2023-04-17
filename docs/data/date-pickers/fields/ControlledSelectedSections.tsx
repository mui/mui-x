import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FieldSectionType, FieldSelectedSections } from '@mui/x-date-pickers/models';
import { DateField } from '@mui/x-date-pickers/DateField';

export default function ControlledSelectedSections() {
  const [selectedSections, setSelectedSections] =
    React.useState<FieldSelectedSections>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const setSelectedSectionType = (selectedSectionType: FieldSectionType) => {
    inputRef.current?.focus();
    setSelectedSections(selectedSectionType);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => setSelectedSectionType('month')}>
            Month
          </Button>
          <Button variant="outlined" onClick={() => setSelectedSectionType('day')}>
            Day
          </Button>
          <Button variant="outlined" onClick={() => setSelectedSectionType('year')}>
            Year
          </Button>
        </Stack>
        <DateField
          inputRef={inputRef}
          selectedSections={selectedSections}
          onSelectedSectionsChange={setSelectedSections}
        />
      </Stack>
    </LocalizationProvider>
  );
}
