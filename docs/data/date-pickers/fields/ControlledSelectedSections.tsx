import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  FieldSectionType,
  FieldSelectedSections,
  FieldRef,
} from '@mui/x-date-pickers/models';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { DateField } from '@mui/x-date-pickers/DateField';

export default function ControlledSelectedSections() {
  const [selectedSections, setSelectedSections] =
    React.useState<FieldSelectedSections>(null);
  const fieldRef = React.useRef<FieldRef<PickerValue>>(null);

  const setSelectedSectionType = (selectedSectionType: FieldSectionType) => {
    fieldRef.current?.focusField();
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
          fieldRef={fieldRef}
          selectedSections={selectedSections}
          onSelectedSectionsChange={setSelectedSections}
        />
      </Stack>
    </LocalizationProvider>
  );
}
