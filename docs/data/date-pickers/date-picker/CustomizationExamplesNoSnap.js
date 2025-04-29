import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { BrandingProvider } from '@mui/docs/branding';
import CustomizationPlayground from 'docsx/src/modules/components/CustomizationPlayground';
import CircularProgress from '@mui/material/CircularProgress';
import { pickerExamples } from './examplesConfig.styling';

export default function CustomizationExamplesNoSnap() {
  const [selectedPicker, setSelectedPicker] = React.useState(0);

  const handleSelectedPickerChange = (_e, newValue) => {
    if (newValue !== null) {
      setSelectedPicker(newValue);
    }
  };

  if (!pickerExamples[selectedPicker]?.examples) {
    return (
      <BrandingProvider>
        <CircularProgress />
      </BrandingProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ mb: 2, width: '100%', px: { xs: 2, sm: 0 } }}>
        <BrandingProvider>
          <ToggleButtonGroup
            value={selectedPicker}
            exclusive
            onChange={handleSelectedPickerChange}
            aria-label="date picker components"
          >
            {pickerExamples.map(({ name }, index) => (
              <ToggleButton value={index} aria-label={name} key={name}>
                {name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </BrandingProvider>
        <CustomizationPlayground
          examples={pickerExamples[selectedPicker].examples}
          componentName={pickerExamples[selectedPicker].name}
        >
          {pickerExamples.map(
            (example, index) =>
              String(index) === String(selectedPicker) && (
                <example.component key={index} {...example?.componentProps} />
              ),
          )}
        </CustomizationPlayground>
      </Stack>
    </LocalizationProvider>
  );
}
