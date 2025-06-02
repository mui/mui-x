import * as React from 'react';
import { styled } from '@mui/material/styles';
import PTOCalendar from './PTOCalendar/PTOCalendar';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Paper from '@mui/material/Paper';

const DEMOS: { name: string; component: React.ComponentType<any> }[] = [
  {
    name: 'PTO Calendar',
    component: PTOCalendar,
  },
  {
    name: 'Financial',
    component: () => <div>Financial</div>,
  },
  {
    name: 'Inventory',
    component: () => <div>Inventory</div>,
  },
];

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    border: 0,
    borderRadius: theme.shape.borderRadius,
  },
}));

export default function Demos() {
  const [selected, setSelected] = React.useState<(typeof DEMOS)[number]['name']>(DEMOS[0].name);
  const selectedDemo = DEMOS.find((demo) => demo.name === selected);
  return (
    <>
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
              setSelected(value);
            }
          }}
        >
          {DEMOS.map((demo) => (
            <ToggleButton
              key={demo.name}
              value={demo.name}
              title={demo.name}
              sx={{ flexGrow: 1, gap: 1, flexWrap: 'wrap' }}
            >
              {demo.name}
            </ToggleButton>
          ))}
        </StyledToggleButtonGroup>
      </Paper>
      {selectedDemo && <selectedDemo.component />}
    </>
  );
}
