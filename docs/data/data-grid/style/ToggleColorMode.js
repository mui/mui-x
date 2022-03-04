import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';

import { useTheme } from '@mui/material/styles';

import { useDemoData } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

export default function ToogleColorMode() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  const parentTheme = useTheme();
  const inheritPaletteMode = parentTheme.palette.mode;

  const apiRef = useGridApiRef();
  const [paletteMode, setPaletteMode] = React.useState(inheritPaletteMode);

  return (
    <Box sx={{ width: '100%' }}>
      <ToggleButtonGroup
        value={paletteMode}
        exclusive
        onChange={(event, newValue) => {
          setPaletteMode(newValue);
          apiRef.current.setThemePalette({ mode: newValue });
        }}
        aria-label="gid color mode"
      >
        <ToggleButton value="light" aria-label="light mode">
          Light
        </ToggleButton>
        <ToggleButton value="dark" aria-label="dark mode">
          Dark
        </ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ height: 400, width: '100%', mt: 2 }}>
        <DataGridPro apiRef={apiRef} {...data} />
      </Box>
    </Box>
  );
}
