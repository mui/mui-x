import * as React from 'react';
import Box from '@mui/material/Box';
import MuiToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import MuiToggleButton from '@mui/material/ToggleButton';
import { styled } from '@mui/material/styles';

const ToggleButton = styled(MuiToggleButton)({
  borderColor: 'transparent',
  padding: '5px 8px',
  minHeight: 32,
});
const ToggleButtonGroup = styled(MuiToggleButtonGroup)(({ theme }) => ({
  gap: theme.spacing(1),
  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.lastButton},& .${toggleButtonGroupClasses.middleButton} `]:
    {
      borderRadius: theme.shape.borderRadius,
    },
}));

type Value<T extends string> = { label?: string; icon?: React.ReactNode; key: T };

export default function ConfigToggleButtons<T extends string>({
  selectedValue,
  handleValueSwitch,
  values,
}: {
  selectedValue: T;
  handleValueSwitch: (event: React.MouseEvent<HTMLElement>, newLanguage: T) => void;
  values: Value<T>[];
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ToggleButtonGroup
        size="small"
        aria-label={'Select language'}
        value={selectedValue}
        exclusive
        onChange={handleValueSwitch}
      >
        {values.map(({ key, label, icon }) => (
          <ToggleButton value={key} key={key} aria-label={key}>
            {label || icon}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
