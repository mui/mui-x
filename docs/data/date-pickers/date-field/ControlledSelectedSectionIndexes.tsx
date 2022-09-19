import * as React from 'react';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MuiDateSectionName } from '@mui/x-date-pickers';
import {
  Unstable_DateField as DateField,
  FieldSelectionSectionIndexes,
  FieldInstance,
  FieldSection,
} from '@mui/x-date-pickers/DateField';

export default function ControlledSelectedSectionIndexes() {
  const [selectedSectionIndexes, setSelectedSectionIndexes] =
    React.useState<FieldSelectionSectionIndexes>(null);
  const fieldRef = React.useRef<FieldInstance<FieldSection>>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const setSelectedDateSectionName = (
    selectedDateSectionName: MuiDateSectionName,
  ) => {
    const sectionIndex = fieldRef.current!.sections.findIndex(
      (section) => section.dateSectionName === selectedDateSectionName,
    );
    const newSelectedSectionIndexes =
      sectionIndex === -1 ? null : { start: sectionIndex, end: sectionIndex };

    if (newSelectedSectionIndexes != null) {
      inputRef.current?.focus();
    }
    setSelectedSectionIndexes(newSelectedSectionIndexes);
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
          fieldRef={fieldRef}
          selectedSectionIndexes={selectedSectionIndexes}
          onSelectedSectionIndexesChange={setSelectedSectionIndexes}
        />
      </Stack>
    </LocalizationProvider>
  );
}
