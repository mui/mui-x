import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { PieChart } from '@mui/x-charts/PieChart';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { mobileAndDesktopOS, platforms, valueFormatter } from './webUsageStats';

export default function PieClickNoSnap() {
  const [itemData, setItemData] = React.useState();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <PieChart
          series={series}
          width={400}
          height={300}
          slotProps={{
            legend: { hidden: true },
          }}
          onItemClick={(event, d) => setItemData(d)}
        />{' '}
      </Box>

      <Stack direction="column" sx={{ width: { xs: '100%', md: '40%' } }}>
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
              setItemData(null);
            }}
          >
            <UndoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <HighlightedCode
          code={`// Data from item click
${itemData ? JSON.stringify(itemData, null, 2) : '// The data will appear here'}
`}
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}

const series = [
  {
    innerRadius: 0,
    outerRadius: 80,
    id: 'platform-series',
    data: platforms,
    valueFormatter,
  },
  {
    innerRadius: 100,
    outerRadius: 120,
    id: 'OS-series',
    data: mobileAndDesktopOS,
    valueFormatter,
  },
];
