import * as React from 'react';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

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
        value="list"
        exclusive
        size="small"
      >
        <ToggleButton value="list" aria-label="list" sx={{ flexGrow: 1 }}>
          <ViewListIcon />
        </ToggleButton>
        <ToggleButton value="module" aria-label="module" sx={{ flexGrow: 1 }}>
          <ViewModuleIcon />
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Paper>
  );
}
