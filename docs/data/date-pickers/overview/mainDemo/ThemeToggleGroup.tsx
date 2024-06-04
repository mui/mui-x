import * as React from 'react';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: theme.spacing(1),
  padding: theme.spacing(0.8),
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    border: 0,
    borderRadius: theme.shape.borderRadius,
  },
}));

export default function ThemeToggleGroup() {
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        flexWrap: 'wrap',
      }}
    >
      <StyledToggleButtonGroup
        orientation="vertical"
        value="custom"
        exclusive
        size="small"
      >
        <ToggleButton value="custom" aria-label="custom-theme" sx={{ flexGrow: 1 }}>
          <AutoFixHighIcon />
        </ToggleButton>
        <ToggleButton
          value="default"
          aria-label="default-theme"
          sx={{ flexGrow: 1 }}
        >
          <RestartAltIcon />
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Paper>
  );
}
