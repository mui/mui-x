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

export type ExampleToggleGroupProps = {
  selected: 'github' | 'figma' | 'vscode';
  onToggleChange: (value: 'github' | 'figma' | 'vscode') => void;
};

export default function ExampleToggleGroup({ selected, onToggleChange }: ExampleToggleGroupProps) {
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
        onChange={(_event, value) => onToggleChange(value)}
      >
        <ToggleButton value="github" title="GitHub" sx={{ flexGrow: 1 }}>
          <img src="/static/x/overview/github_dark.svg" height={18} alt="GitHub logo" />
        </ToggleButton>
        <ToggleButton value="vscode" title="VS Code" sx={{ flexGrow: 1 }}>
          <img src="/static/x/overview/vscode.svg" height={18} alt="vscode logo" />
        </ToggleButton>
        <ToggleButton value="figma" title="Figma" sx={{ flexGrow: 1 }}>
          <img src="/static/x/overview/figma.svg" height={24} alt="figma logo" />
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Paper>
  );
}
