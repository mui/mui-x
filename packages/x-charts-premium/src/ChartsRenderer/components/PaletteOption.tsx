import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { GridChartsPaletteIcon } from '../icons';

const PaletteOptionRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PaletteOptionRoot',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const PaletteOptionIcon = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PaletteOptionIcon',
})(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: 4,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.background.default,
}));

function PaletteOption(props: {
  palette: (mode: 'light' | 'dark') => string[];
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const colors = props.palette(theme.palette.mode ?? 'light');
  return (
    <PaletteOptionRoot>
      <PaletteOptionIcon>
        <GridChartsPaletteIcon
          style={
            Object.fromEntries(
              colors.map((color, index) => [`--color-${index + 1}`, color]),
            ) as React.CSSProperties
          }
        />
      </PaletteOptionIcon>
      {props.children}
    </PaletteOptionRoot>
  );
}

export { PaletteOption };
