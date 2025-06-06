import * as React from 'react';
import { styled } from '@mui/material/styles';
import PTOCalendar from './PTOCalendar/PTOCalendar';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import BarChart from '@mui/icons-material/BarChart';
import Box from '@mui/material/Box';
import StockDashboard from './FinancialDashboard/StockDashboard';

const DEMOS: { name: string; icon: React.ReactNode; component: React.ComponentType<any> }[] = [
  {
    name: 'PTO Calendar',
    icon: <CalendarMonth fontSize="small" />,
    component: PTOCalendar,
  },
  {
    name: 'Stock Market',
    icon: <BarChart fontSize="small" />,
    component: StockDashboard,
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
    <Stack gap={3}>
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
              {demo.icon}
              {demo.name}
            </ToggleButton>
          ))}
        </StyledToggleButtonGroup>
      </Paper>
      <Box
        sx={{
          height: 'calc(100vh - 320px)', // TODO: Find a way to fill height without magic number
        }}
      >
        {selectedDemo && <selectedDemo.component />}
      </Box>
    </Stack>
  );
}
