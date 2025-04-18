import * as React from 'react';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5),

  [`& .${toggleButtonGroupClasses.grouped}`]: {
    border: 0,
    borderRadius: theme.shape.borderRadius,
  },
}));

export type FeaturesToggleGroupProps = {
  selected: 'stacking' | 'highlighting';
  onToggleChange: (value: 'stacking' | 'highlighting') => void;
};

export default function AdvancedFeaturesToggle({
  selected,
  onToggleChange,
}: FeaturesToggleGroupProps) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        display: 'flex',
        border: `1px solid ${theme.palette.divider}`,
        flexWrap: 'wrap',
        width: 'fit-content',
      })}
    >
      <StyledToggleButtonGroup
        orientation="horizontal"
        value={selected}
        exclusive
        size="small"
        onChange={(_event, value) => {
          if (value && value !== selected) {
            onToggleChange(value);
          }
        }}
      >
        <ToggleButton
          value="stacking"
          title="Stacking"
          sx={{ flexGrow: 1, gap: 1, flexWrap: 'wrap' }}
        >
          {/* eslint-disable material-ui/no-hardcoded-labels */}
          Stacking
        </ToggleButton>
        <ToggleButton
          value="highlighting"
          title="Highlighting"
          sx={{ flexGrow: 1, gap: 1, flexWrap: 'wrap' }}
        >
          Highlighting
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Paper>
  );
}
