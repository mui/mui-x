import * as React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  MuiDateSectionName,
  FieldSelectedSections,
  FieldRef,
  RangeFieldSection,
  RangePosition,
} from '@mui/x-date-pickers-pro';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

export default function ControlledSelectedSectionsSingleInputRangeField() {
  const [selectedSections, setSelectedSections] =
    React.useState<FieldSelectedSections>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fieldRef = React.useRef<FieldRef<RangeFieldSection>>(null);

  const setSelectedDateSectionName = (
    selectedDateSectionName: MuiDateSectionName,
    position: RangePosition,
  ) => {
    if (!fieldRef.current) {
      return;
    }

    inputRef.current?.focus();
    const sections = fieldRef.current.getSections().map((el) => el.dateSectionName);
    setSelectedSections(
      position === 'start'
        ? sections.indexOf(selectedDateSectionName)
        : sections.lastIndexOf(selectedDateSectionName),
    );
  };

  const renderDateHeader = (position: RangePosition) => (
    <Stack spacing={2} alignItems="center">
      <Typography textTransform="capitalize">{position}</Typography>
      <Stack direction="row" spacing={1}>
        {(['month', 'day', 'year'] as const).map((sectionName) => (
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSelectedDateSectionName(sectionName, position)}
          >
            {sectionName}
          </Button>
        ))}
      </Stack>
    </Stack>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', l: 'row' }} spacing={2}>
          {renderDateHeader('start')}
          {renderDateHeader('end')}
        </Stack>
        <SingleInputDateRangeField
          sx={{ minWidth: 300 }}
          unstableFieldRef={fieldRef}
          inputRef={inputRef}
          selectedSections={selectedSections}
          onSelectedSectionsChange={setSelectedSections}
        />
      </Stack>
    </LocalizationProvider>
  );
}
