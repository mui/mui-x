import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  flexGrow: 1,
  gap: theme.spacing(1),
  padding: theme.spacing(0.8),
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    border: 0,
    borderRadius: theme.shape.borderRadius,
  },
}));

export type ThemeToggleGroupProps = {
  showCustomTheme: boolean;
  toggleCustomTheme: () => void;
};

export default function ThemeToggleGroup({
  showCustomTheme,
  toggleCustomTheme,
}: ThemeToggleGroupProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        border: `1px solid ${theme.palette.divider}`,
        flexWrap: 'wrap',
      }}
    >
      <StyledToggleButtonGroup
        orientation={isMobile ? 'horizontal' : 'vertical'}
        value={showCustomTheme}
        onChange={(_event, newValue) => {
          if (newValue !== null) {
            toggleCustomTheme();
          }
        }}
        exclusive
        size="small"
      >
        <ToggleButton value title="Custom theme" sx={{ flexGrow: 1 }}>
          <AutoFixHighIcon />
          {isMobile && 'Custom Theme'}
        </ToggleButton>
        <ToggleButton value={false} title="Default theme" sx={{ flexGrow: 1 }}>
          <SettingsSuggestIcon />
          {isMobile && 'Default Theme'}
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Paper>
  );
}
