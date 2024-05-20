import * as React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  FieldSectionType,
  FieldSelectedSections,
  FieldRef,
} from '@mui/x-date-pickers/models';
import { RangeFieldSection, RangePosition } from '@mui/x-date-pickers-pro/models';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

export default function ControlledSelectedSectionsSingleInputRangeField() {
  const [selectedSections, setSelectedSections] =
    React.useState<FieldSelectedSections>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fieldRef = React.useRef<FieldRef<RangeFieldSection>>(null);

  const setSelectedSectionType = (
    selectedSectionType: FieldSectionType,
    position: RangePosition,
  ) => {
    if (!fieldRef.current) {
      return;
    }

    inputRef.current?.focus();
    const sections = fieldRef.current.getSections().map((el) => el.type);
    setSelectedSections(
      position === 'start'
        ? sections.indexOf(selectedSectionType)
        : sections.lastIndexOf(selectedSectionType),
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
            onClick={() => setSelectedSectionType(sectionName, position)}
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
        <Stack spacing={2}>
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
