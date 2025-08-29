import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import {
  ChartsAxisData,
  RadarItemIdentifier,
  RadarSeriesType,
} from '@mui/x-charts/models';
import { RadarChart } from '@mui/x-charts/RadarChart';
import { HighlightedCode } from '@mui/docs/HighlightedCode';

export default function RadarClick() {
  const [itemData, setItemData] = React.useState<RadarItemIdentifier>();
  const [axisData, setAxisData] = React.useState<ChartsAxisData | null>();
  const [itemClick, setItemClick] = React.useState<'mark' | 'area' | null>('mark');

  const handleItemClick = (
    event: React.MouseEvent<HTMLElement>,
    newItem: 'mark' | 'area' | null,
  ) => {
    setItemClick(newItem);
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <RadarChart
          {...commonSettings}
          series={[lisaGrades, bartGrades]}
          onAreaClick={
            itemClick === 'area' ? (event, d) => setItemData(d) : undefined
          }
          onMarkClick={
            itemClick === 'mark' ? (event, d) => setItemData(d) : undefined
          }
          onAxisClick={(event, d) => setAxisData(d)}
        />
      </Box>

      <Stack
        direction="column"
        sx={{ width: { xs: '100%', md: '40%' } }}
        spacing={2}
      >
        <Stack
          spacing={1}
          direction={{ xs: 'row', md: 'column' }}
          alignItems={{ xs: 'center', md: 'start' }}
        >
          <Typography>Item click listener</Typography>
          <ToggleButtonGroup
            value={itemClick}
            exclusive
            onChange={handleItemClick}
            aria-label="text alignment"
            size="small"
          >
            <ToggleButton value="mark">Mark</ToggleButton>
            <ToggleButton value="area">Area</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <div>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography>Click on the chart</Typography>
            <IconButton
              aria-label="reset"
              size="small"
              onClick={() => {
                setItemData(undefined);
                setAxisData(null);
              }}
            >
              <UndoOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
          <HighlightedCode
            code={`// Data from item click
${itemData ? JSON.stringify(itemData, null, 2) : '// The data will appear here'}

// Data from axis click
${axisData ? JSON.stringify(axisData, null, 2) : '// The data will appear here'}
`}
            language="json"
            copyButtonHidden
          />
        </div>
      </Stack>
    </Stack>
  );
}

const commonSettings = {
  height: 300,
  radar: {
    max: 120,
    metrics: ['Math', 'Chinese', 'English', 'Geography', 'Physics', 'History'],
  },
};
const lisaGrades: RadarSeriesType = {
  type: 'radar',
  label: 'Lisa',
  id: 'lisa-grade-series',
  data: [120, 98, 86, 99, 85, 65],
  hideMark: false,
};
const bartGrades: RadarSeriesType = {
  type: 'radar',
  label: 'Bart',
  id: 'bar-grade-series',
  data: [25, 34, 51, 16, 90, 20],
  hideMark: false,
};
